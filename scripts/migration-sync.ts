#!/usr/bin/env node
/**
 * Migration Sync Tool with Filtered History
 *
 * Uses git filter-repo/filter-branch to rewrite old repo history into a subdirectory,
 * then merges with --allow-unrelated-histories to preserve history without conflicts.
 *
 * Usage:
 *   ./scripts/migration-sync.ts status            - Show current sync status
 *   ./scripts/migration-sync.ts init              - Setup filtered remote
 *   ./scripts/migration-sync.ts sync-next         - Sync next commit
 *   ./scripts/migration-sync.ts sync-all          - Sync all remaining commits
 *   ./scripts/migration-sync.ts reset             - Reset sync state
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

interface MigrationState {
  version: number;
  sourceRepo: string;
  sourceBranch: string;
  targetSubdirectory: string;
  lastSyncedCommit: string | null;
  migrations: Migration[];
}

interface Migration {
  commit: string;
  date: string;
  message: string;
  author: string;
  syncedAt: string;
  mergeCommit: string;
}

interface CommitInfo {
  hash: string;
  date: string;
  message: string;
  author: string;
}

const STATE_FILE = ".migration-state.json";
const SOURCE_REPO = ".context/hive-console";
const FILTERED_REMOTE = "hive-console-filtered";
const FILTERED_BRANCH = "filtered-for-migration";
const DEFAULT_SUBDIRECTORY = "temporary";

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function loadState(): MigrationState {
  if (!existsSync(STATE_FILE)) {
    return {
      version: 1,
      sourceRepo: SOURCE_REPO,
      sourceBranch: "main",
      targetSubdirectory: DEFAULT_SUBDIRECTORY,
      lastSyncedCommit: null,
      migrations: [],
    };
  }
  return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
}

function saveState(state: MigrationState): void {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function exec(cmd: string, cwd?: string): string {
  try {
    return execSync(cmd, {
      encoding: "utf-8",
      cwd: cwd || process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch (error: any) {
    throw new Error(`Command failed: ${cmd}\n${error.message}`);
  }
}

function hasRemote(remoteName: string): boolean {
  try {
    const remotes = exec("git remote");
    return remotes.split("\n").includes(remoteName);
  } catch {
    return false;
  }
}

function checkGitFilterRepo(): boolean {
  try {
    exec("git filter-repo --version");
    return true;
  } catch {
    return false;
  }
}

function setupFilteredRemote(state: MigrationState): void {
  const sourcePath = resolve(SOURCE_REPO);
  const subdirectory = state.targetSubdirectory;

  console.log(`${colors.cyan}Setting up filtered remote...${colors.reset}`);
  console.log(`  Source: ${colors.yellow}${sourcePath}${colors.reset}`);
  console.log(
    `  Target subdirectory: ${colors.yellow}${subdirectory}${colors.reset}\n`,
  );

  const tempDir = `/tmp/hive-console-filtered-${Date.now()}`;

  console.log(`${colors.dim}Creating temporary clone...${colors.reset}`);
  exec(`git clone "${sourcePath}" "${tempDir}"`);

  const filterRepoAvailable = checkGitFilterRepo();

  if (filterRepoAvailable) {
    console.log(
      `${colors.dim}Using git-filter-repo to rewrite history...${colors.reset}`,
    );
    exec(
      `git filter-repo --force --to-subdirectory-filter "${subdirectory}"`,
      tempDir,
    );
  } else {
    console.log(
      `${colors.yellow}git-filter-repo not found, using filter-branch (slower)...${colors.reset}`,
    );
    console.log(
      `${colors.dim}Install git-filter-repo for faster operations:${colors.reset}`,
    );
    console.log(
      `${colors.dim}  brew install git-filter-repo  # macOS${colors.reset}`,
    );
    console.log(
      `${colors.dim}  pip install git-filter-repo   # pip${colors.reset}\n`,
    );

    exec(
      `git filter-branch --force --index-filter '
        git read-tree --empty
        git checkout -f HEAD
        mkdir -p "${subdirectory}"
        git ls-tree -z --name-only HEAD | xargs -0 -I {} git mv {} "${subdirectory}/" || true
      ' HEAD`,
      tempDir,
    );
  }

  if (hasRemote(FILTERED_REMOTE)) {
    console.log(
      `${colors.yellow}Removing existing remote '${FILTERED_REMOTE}'...${colors.reset}`,
    );
    exec(`git remote remove ${FILTERED_REMOTE}`);
  }

  console.log(`${colors.dim}Adding filtered remote...${colors.reset}`);
  exec(`git remote add ${FILTERED_REMOTE} "${tempDir}"`);

  console.log(`${colors.dim}Fetching from filtered remote...${colors.reset}`);
  exec(`git fetch ${FILTERED_REMOTE} ${state.sourceBranch}:${FILTERED_BRANCH}`);

  console.log(`${colors.green}✓ Filtered remote configured${colors.reset}\n`);
  console.log(`${colors.dim}Temporary clone at: ${tempDir}${colors.reset}`);
  console.log(
    `${colors.dim}Clean up later with: rm -rf ${tempDir}${colors.reset}\n`,
  );
}

function updateFilteredRemote(state: MigrationState): void {
  console.log(
    `${colors.cyan}Updating filtered remote with latest changes...${colors.reset}`,
  );

  const remoteUrl = exec(`git remote get-url ${FILTERED_REMOTE}`);
  const tempDir = remoteUrl.replace("file://", "");

  if (!existsSync(tempDir)) {
    console.log(
      `${colors.yellow}Temporary clone not found, reinitializing...${colors.reset}`,
    );
    setupFilteredRemote(state);
    return;
  }

  console.log(
    `${colors.dim}Pulling latest changes from source...${colors.reset}`,
  );
  exec(`git pull origin ${state.sourceBranch}`, tempDir);

  console.log(
    `${colors.dim}Fetching updated filtered branch...${colors.reset}`,
  );
  exec(`git fetch ${FILTERED_REMOTE} ${state.sourceBranch}:${FILTERED_BRANCH}`);

  console.log(`${colors.green}✓ Filtered remote updated${colors.reset}\n`);
}

function getCommitsToSync(state: MigrationState, limit?: number): CommitInfo[] {
  const since = state.lastSyncedCommit ? `^${state.lastSyncedCommit}` : "";
  const limitFlag = limit ? `-n ${limit}` : "";

  const format = "%H|%ai|%s|%an";
  const logCmd = `git log ${FILTERED_BRANCH} ${since} ${limitFlag} --format="${format}"`;

  let output: string;
  try {
    output = exec(logCmd);
  } catch {
    return [];
  }

  if (!output) return [];

  const commits: CommitInfo[] = [];
  const lines = output.split("\n").filter(Boolean);

  for (const line of lines) {
    const parts = line.split("|");
    const hash = parts[0]!;
    const date = parts[1]!;
    const message = parts.slice(2, -1).join("|");
    const author = parts[parts.length - 1]!;

    commits.push({ hash, date, message, author });
  }

  return commits.reverse();
}

function performMerge(commitHash: string): string {
  console.log(
    `${colors.cyan}Merging commit ${commitHash.slice(0, 12)}...${colors.reset}`,
  );

  try {
    exec(
      `git merge --allow-unrelated-histories -m "[migration] Merge from hive-console\n\nOriginal commit: ${commitHash}" ${commitHash}`,
    );
    const mergeCommit = exec("git rev-parse HEAD");
    console.log(`${colors.green}✓ Merged successfully${colors.reset}`);
    return mergeCommit;
  } catch (error: any) {
    console.error(`${colors.red}✗ Merge failed${colors.reset}`);
    console.error(
      `${colors.yellow}Resolve conflicts and run: git merge --continue${colors.reset}`,
    );
    console.error(
      `${colors.dim}Or abort with: git merge --abort${colors.reset}`,
    );
    throw error;
  }
}

function displayStatus(state: MigrationState): void {
  console.log(
    `\n${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`,
  );
  console.log(
    `${colors.bright}${colors.cyan}║${colors.reset}           ${colors.bright}MIGRATION SYNC STATUS${colors.reset}                    ${colors.cyan}║${colors.reset}`,
  );
  console.log(
    `${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`,
  );

  console.log(`${colors.bright}Source Repository:${colors.reset}`);
  console.log(`  Path: ${colors.yellow}${SOURCE_REPO}${colors.reset}`);
  console.log(`  Branch: ${colors.yellow}${state.sourceBranch}${colors.reset}`);
  console.log(
    `  Target subdirectory: ${colors.yellow}${state.targetSubdirectory}${colors.reset}`,
  );

  const hasRemoteConfigured = hasRemote(FILTERED_REMOTE);
  console.log(
    `  Filtered remote: ${hasRemoteConfigured ? colors.green + "✓ Configured" : colors.yellow + "⚠ Not configured (run 'init')"}${colors.reset}`,
  );

  if (state.lastSyncedCommit) {
    const lastMigration = state.migrations[state.migrations.length - 1];
    console.log(`\n${colors.bright}Last Synced:${colors.reset}`);
    console.log(
      `  Source: ${colors.green}${state.lastSyncedCommit.slice(0, 12)}${colors.reset}`,
    );
    console.log(
      `  Date: ${colors.green}${lastMigration?.date || "Unknown"}${colors.reset}`,
    );
    console.log(
      `  Message: ${colors.dim}${lastMigration?.message.slice(0, 60)}${colors.reset}`,
    );
    console.log(
      `  Merge commit: ${colors.dim}${lastMigration?.mergeCommit.slice(0, 12)}${colors.reset}`,
    );
    console.log(
      `  Synced at: ${colors.dim}${lastMigration?.syncedAt}${colors.reset}`,
    );
  } else {
    console.log(`\n${colors.yellow}⚠ No commits synced yet${colors.reset}`);
  }

  if (hasRemoteConfigured) {
    const commitsToSync = getCommitsToSync(state);
    const totalSynced = state.migrations.length;

    console.log(`\n${colors.bright}Progress:${colors.reset}`);
    console.log(
      `  Synced: ${colors.green}${totalSynced} commits${colors.reset}`,
    );
    console.log(
      `  Pending: ${commitsToSync.length > 0 ? colors.yellow : colors.green}${commitsToSync.length} commits${colors.reset}`,
    );

    if (commitsToSync.length > 0) {
      console.log(`\n${colors.bright}Next commits to sync:${colors.reset}`);
      commitsToSync.slice(0, 5).forEach((commit, i) => {
        const icon = i === 0 ? "▶" : " ";
        const color = i === 0 ? colors.cyan : colors.dim;
        console.log(
          `  ${color}${icon} ${commit.hash.slice(0, 12)}${colors.reset} ${commit.message.slice(0, 50)}${commit.message.length > 50 ? "..." : ""}`,
        );
      });
      if (commitsToSync.length > 5) {
        console.log(
          `  ${colors.dim}... and ${commitsToSync.length - 5} more${colors.reset}`,
        );
      }
    } else {
      console.log(`\n${colors.green}✓ All commits are synced!${colors.reset}`);
    }
  }

  console.log();
}

function syncNextCommit(state: MigrationState): void {
  const commits = getCommitsToSync(state, 1);

  if (commits.length === 0) {
    console.log(`${colors.green}✓ No commits to sync${colors.reset}`);
    return;
  }

  const commit = commits[0]!;
  console.log(
    `${colors.bright}Syncing:${colors.reset} ${commit.hash.slice(0, 12)} ${colors.dim}${commit.message.slice(0, 60)}${colors.reset}\n`,
  );

  const mergeHash = performMerge(commit.hash);

  state.lastSyncedCommit = commit.hash;
  state.migrations.push({
    commit: commit.hash,
    date: commit.date,
    message: commit.message,
    author: commit.author,
    syncedAt: new Date().toISOString(),
    mergeCommit: mergeHash,
  });
  saveState(state);

  console.log(
    `\n${colors.green}${colors.bright}✓ Sync complete${colors.reset}`,
  );
  console.log(
    `${colors.dim}Files now in: ${state.targetSubdirectory}/${colors.reset}`,
  );
  console.log(
    `${colors.dim}Next: Review the merge, then run 'sync-next' again${colors.reset}\n`,
  );
}

function syncAllCommits(state: MigrationState): void {
  const commits = getCommitsToSync(state);

  if (commits.length === 0) {
    console.log(`${colors.green}✓ No commits to sync${colors.reset}`);
    return;
  }

  console.log(
    `${colors.cyan}Syncing ${commits.length} commit(s)...${colors.reset}\n`,
  );

  for (const commit of commits) {
    console.log(
      `${colors.bright}Processing:${colors.reset} ${commit.hash.slice(0, 12)} ${colors.dim}${commit.message.slice(0, 60)}${colors.reset}`,
    );

    try {
      const mergeHash = performMerge(commit.hash);

      state.lastSyncedCommit = commit.hash;
      state.migrations.push({
        commit: commit.hash,
        date: commit.date,
        message: commit.message,
        author: commit.author,
        syncedAt: new Date().toISOString(),
        mergeCommit: mergeHash,
      });
      saveState(state);

      console.log();
    } catch (error) {
      console.error(
        `${colors.red}✗ Stopped at commit ${commit.hash.slice(0, 12)}${colors.reset}`,
      );
      process.exit(1);
    }
  }

  console.log(
    `${colors.green}${colors.bright}✓ All commits synced!${colors.reset}\n`,
  );
}

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0] || "status";

  const state = loadState();

  if (command === "help" || command === "-h" || command === "--help") {
    console.log(`
${colors.bright}Migration Sync Tool${colors.reset}

Uses git filter-repo to rewrite old repo history into a subdirectory,
then merges with --allow-unrelated-histories to preserve history.

${colors.bright}Commands:${colors.reset}
  status, s              Show current sync status
  init                   Setup filtered remote (one-time)
  update                 Refresh filtered remote with latest changes
  sync-next, sn          Sync next commit (interactive mode)
  sync-all, sa           Sync all remaining commits
  reset                  Reset sync state (requires --confirm)
  help                   Show this help

${colors.bright}Workflow:${colors.reset}
  1. ./scripts/migration-sync.ts init        # Setup (filters history)
  2. ./scripts/migration-sync.ts status      # Check status
  3. ./scripts/migration-sync.ts sync-next   # Sync one commit
  4. Review changes in ${state.targetSubdirectory}/
  5. Repeat steps 3-4

${colors.bright}Prerequisites:${colors.reset}
  git-filter-repo (recommended):
    brew install git-filter-repo  # macOS
    pip install git-filter-repo   # Other

${colors.bright}State File:${colors.reset}
  Progress tracked in ${colors.yellow}${STATE_FILE}${colors.reset}

${colors.bright}Files Location:${colors.reset}
  Old repo files are placed in: ${colors.yellow}${state.targetSubdirectory}/${colors.reset}
  This avoids conflicts with your new repo's root files.
`);
    return;
  }

  switch (command) {
    case "status":
    case "s":
      displayStatus(state);
      break;

    case "init":
      setupFilteredRemote(state);
      displayStatus(state);
      break;

    case "update":
      updateFilteredRemote(state);
      displayStatus(state);
      break;

    case "sync-next":
    case "sn": {
      if (!hasRemote(FILTERED_REMOTE)) {
        console.log(
          `${colors.red}Error: Filtered remote not configured. Run 'init' first.${colors.reset}\n`,
        );
        process.exit(1);
      }
      syncNextCommit(state);
      break;
    }

    case "sync-all":
    case "sa": {
      if (!hasRemote(FILTERED_REMOTE)) {
        console.log(
          `${colors.red}Error: Filtered remote not configured. Run 'init' first.${colors.reset}\n`,
        );
        process.exit(1);
      }
      syncAllCommits(state);
      break;
    }

    case "reset":
      console.log(
        `${colors.red}${colors.bright}⚠ WARNING:${colors.reset} This will reset the migration state.`,
      );
      console.log(
        `Current progress: ${state.migrations.length} commits synced`,
      );
      console.log(
        `\nTo confirm, run: ${colors.yellow}./scripts/migration-sync.ts reset --confirm${colors.reset}\n`,
      );

      if (args.includes("--confirm")) {
        if (hasRemote(FILTERED_REMOTE)) {
          console.log(
            `${colors.yellow}Removing remote '${FILTERED_REMOTE}'...${colors.reset}`,
          );
          exec(`git remote remove ${FILTERED_REMOTE}`);
        }
        saveState({
          version: 1,
          sourceRepo: SOURCE_REPO,
          sourceBranch: "main",
          targetSubdirectory: DEFAULT_SUBDIRECTORY,
          lastSyncedCommit: null,
          migrations: [],
        });
        console.log(`${colors.green}✓ Migration state reset${colors.reset}\n`);
      }
      break;

    default:
      console.log(`${colors.red}Unknown command: ${command}${colors.reset}`);
      console.log(`Run './scripts/migration-sync.ts help' for usage.\n`);
      process.exit(1);
  }
}

main();
