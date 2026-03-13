import { extractFilteredChangelogToc } from "../src/lib/changelog-toc";

const DEPLOYMENT_CHANGELOG_SNAPSHOT_ID =
  "virtual:deployment-changelog-snapshot";
const DEPLOYMENT_CHANGELOG_TOC_ID = "virtual:deployment-changelog-toc";

const CHANGELOG_URL =
  process.env["DEPLOYMENT_CHANGELOG_URL"] ??
  "https://raw.githubusercontent.com/graphql-hive/console/main/deployment/CHANGELOG.md";

async function getDeploymentChangelogSnapshot() {
  try {
    const res = await fetch(CHANGELOG_URL);
    if (!res.ok) return "";
    const text = await res.text();
    // strip top level heading
    return text.replace(/^#\s+.*\n/, "");
  } catch {
    return "";
  }
}

export function deploymentChangelogPlugin() {
  const resolvedSnapshotId = `\0${DEPLOYMENT_CHANGELOG_SNAPSHOT_ID}`;
  const resolvedTocId = `\0${DEPLOYMENT_CHANGELOG_TOC_ID}`;
  let snapshotPromise: Promise<string> | undefined;

  return {
    load(id: string) {
      if (id === resolvedSnapshotId) {
        snapshotPromise ||= getDeploymentChangelogSnapshot();
        return snapshotPromise.then(
          (snapshot) =>
            `export const deploymentChangelogSnapshot = ${JSON.stringify(snapshot)};`,
        );
      }
      if (id === resolvedTocId) {
        snapshotPromise ||= getDeploymentChangelogSnapshot();
        return snapshotPromise.then((snapshot) => {
          const toc = extractFilteredChangelogToc(snapshot);
          return `export const deploymentChangelogToc = ${JSON.stringify(toc)};`;
        });
      }
      return null;
    },
    name: "deployment-changelog",
    resolveId(source: string) {
      if (source === DEPLOYMENT_CHANGELOG_SNAPSHOT_ID)
        return resolvedSnapshotId;
      if (source === DEPLOYMENT_CHANGELOG_TOC_ID) return resolvedTocId;
      return null;
    },
  };
}
