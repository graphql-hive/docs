# Migration Sync Workflow

This directory uses a migration sync system to gradually migrate content from the old repository (`.context/hive-console`) while **preserving full git history** using filtered history merging.

## Overview

During the migration period:

- **Old repo** (`.context/hive-console`): `graphql-hive/console` - active development continues
- **New repo** (current): `graphql-hive/docs` - destination for migrated content

The sync tool uses `git filter-repo` to rewrite the old repo's history, moving all files into a subdirectory (e.g., `temporary/`). This avoids conflicts with your new repo's root files (package.json, etc.) while preserving complete history.

### Current Migration Status

**Last migrated commit:** 16a73cbb45c5d345469352064fe4f45970944a5b

**Worktree status:** The `.context/hive-console` worktree contains 86 commits starting from #7478 (`8e2e40d`), which are all **newer** than the last manually migrated commit. This means all 86 commits need to be synced.

**Starting point:** We start fresh from the beginning of the worktree. The script will migrate all 86 commits in chronological order.

## Quick Start

```bash
# 1. Initialize the sync (creates filtered history)
./scripts/migration-sync.ts init

# 2. Check current sync status
./scripts/migration-sync.ts status

# 3. Sync next commit (review mode - recommended)
./scripts/migration-sync.ts sync-next

# 4. Verify migration completeness (optional)
./scripts/sitemap-diff.ts
```

## Prerequisites

Install `git-filter-repo` (much faster than filter-branch):

```bash
# macOS
brew install git-filter-repo

# Linux/Other
pip install git-filter-repo
```

## How It Works

### Filtered History

Instead of merging directly (which would conflict with root-level files), we:

1. Clone the old repo to a temporary location
2. Run `git filter-repo --to-subdirectory-filter temporary` to rewrite history
3. Add the filtered repo as a remote
4. Merge commits from the filtered branch

Result: Old repo files appear in `temporary/` with full history preserved.

### State Tracking

Progress is tracked in `.migration-state.json`:

```json
{
  "version": 1,
  "sourceRepo": ".context/hive-console",
  "sourceBranch": "main",
  "targetSubdirectory": "temporary",
  "lastSyncedCommit": "abc123...",
  "migrations": [
    {
      "commit": "abc123...",
      "date": "2026-02-04...",
      "message": "commit message",
      "author": "Author Name",
      "syncedAt": "2026-02-04T...",
      "mergeCommit": "def456..."
    }
  ]
}
```

This file should be committed to the repository to share migration progress with the team.

### Directory Structure After Merge

```
hive-docs/
├── packages/
│   ├── documentation/          # Your new docs site
│   ├── design-system/          # Your design system
│   └── ...
├── temporary/                  # Migrated old repo files (staging area)
│   ├── package.json            # Old package.json (preserved)
│   ├── packages/
│   └── ...
├── package.json                # Your new root package.json (untouched)
└── .migration-state.json
```

## Commands

### migration-sync.ts

```bash
# Initialize (one-time setup, creates filtered history)
./scripts/migration-sync.ts init

# Update filtered remote with latest changes from old repo
./scripts/migration-sync.ts update

# Check status
./scripts/migration-sync.ts status

# Sync next commit (interactive mode)
./scripts/migration-sync.ts sync-next

# Sync all remaining commits
./scripts/migration-sync.ts sync-all

# Reset everything (careful!)
./scripts/migration-sync.ts reset --confirm
```

### sitemap-diff.ts

Verify that all pages from the old site are present in the new site:

```bash
# Compare default sitemaps (after building both sites)
./scripts/sitemap-diff.ts

# Compare specific sitemap files
./scripts/sitemap-diff.ts --old .context/hive-console/dist/sitemap.xml --new packages/documentation/dist/sitemap.xml

# Output as JSON for CI/CD
./scripts/sitemap-diff.ts --json

# Save report
./scripts/sitemap-diff.ts --save migration-report.json
```

## Detailed Workflow

### 1. Initialize

```bash
./scripts/migration-sync.ts init
```

This will:

- Clone the old repo to a temporary directory
- Filter history to move all files into `temporary/`
- Add the filtered repo as a remote named `hive-console-filtered`
- Fetch the filtered branch

**Takes a few minutes** for large repos, but it's a one-time operation.

### 2. Review Status

```bash
./scripts/migration-sync.ts status
```

Shows:

- Filtered remote configuration status
- Target subdirectory (default: `temporary/`)
- Last synced commit (if any)
- Number of pending commits
- Next 5 commits to sync

### 3. Sync Commits

**Interactive mode** (recommended):

```bash
./scripts/migration-sync.ts sync-next
# Review the changes in temporary/
./scripts/migration-sync.ts sync-next
# Repeat...
```

**Batch mode** (for catching up):

```bash
./scripts/migration-sync.ts sync-all
```

### 4. Handle Conflicts

If a merge has conflicts:

```bash
# Resolve conflicts in your editor
# Then complete the merge
git add .
git commit -m "[migration] Merge resolved"

# Continue syncing
./scripts/migration-sync.ts sync-next
```

### 5. Update Filtered Remote

When the old repo has new commits:

```bash
./scripts/migration-sync.ts update
./scripts/migration-sync.ts status
```

### 6. Verify Migration

After building both sites:

```bash
# Build old site
cd .context/hive-console
npm run build

# Build new site
cd ../..
npm run build

# Compare sitemaps
./scripts/sitemap-diff.ts
```

This will show:

- URLs present in old but missing from new (need migration)
- URLs present in new but not in old (new content)
- URLs with changed metadata

## Configuration

Edit `.migration-state.json` to customize:

```json
{
  "targetSubdirectory": "temporary",
  "sourceBranch": "main"
}
```

Default subdirectory is `temporary/`, but you can change it before running `init`.

## Git History Visualization

After migration, your history will look like:

```
*   [migration] Merge from hive-console (merge commit in new repo)
|\
| * Original commit from old repo (files now in temporary/)
* | Previous commit in new repo
```

Full `git log`, `git blame`, and file history are preserved for all migrated files.

## Completion Checklist

When migration is complete:

- [ ] All commits synced: `./scripts/migration-sync.ts status` shows "All commits are synced!"
- [ ] Sitemap diff shows no missing URLs
- [ ] Tests pass in new repo
- [ ] `.migration-state.json` committed
- [ ] Clean up:

  ```bash
  # Remove migration tools
  rm scripts/migration-sync.ts scripts/sitemap-diff.ts .migration-state.json
  git rm --cached .migration-state.json

  # Remove filtered remote
  git remote remove hive-console-filtered

  # Clean temp directory (shown in init output)
  rm -rf /tmp/hive-console-filtered-*

  git commit -m "chore: remove migration tools"
  ```

- [ ] Move files from subdirectory to final location if needed
- [ ] Archive or remove the `.context/hive-console` directory
- [ ] Update documentation

## Troubleshooting

### Reset Sync State

If something goes wrong:

```bash
./scripts/migration-sync.ts reset --confirm
```

This removes the filtered remote and resets state. Previously merged commits remain in history.

### Filter-Repo Not Found

The script will fall back to `git filter-branch` (slower), but installing `git-filter-repo` is recommended:

```bash
brew install git-filter-repo  # macOS
pip install git-filter-repo   # pip
```

### Old Repo Updates

The old repo is a git worktree. To get latest changes:

```bash
# Update the filtered remote
./scripts/migration-sync.ts update

# Or manually
cd .context/hive-console
git pull origin main
cd ../..
./scripts/migration-sync.ts update
```

### Merge Conflicts

If you get conflicts during sync:

1. Resolve them manually
2. `git add .`
3. `git commit` (the message is already prepared)
4. Continue with `./scripts/migration-sync.ts sync-next`

### Large Repositories

For very large repos, the initial `init` may take several minutes. The filtered clone is stored in `/tmp/` and reused on subsequent updates.

## Architecture

The sync system consists of:

1. **migration-sync.ts**: Main sync tool using git filter-repo
2. **sitemap-diff.ts**: Verification tool comparing built outputs
3. **.migration-state.json**: Tracks sync progress (commit to repo)
4. **Temporary filtered clone**: Stored in `/tmp/hive-console-filtered-*`

Both scripts are standalone TypeScript files with no external dependencies (except Node.js and optionally git-filter-repo).
