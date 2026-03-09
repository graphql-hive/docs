"use client";

import { use } from "react";

const GITHUB_URL =
  "https://github.com/graphql-hive/console/blob/main/deployment/CHANGELOG.md";

let htmlPromise: Promise<string> | null = null;
function getChangelogHtml() {
  return (htmlPromise ??= fetch(`${BASE_PATH}/api/deployment-changelog`).then(
    (res) => (res.ok ? res.text() : ""),
  ));
}

export function DeploymentChangelog() {
  const html = use(getChangelogHtml());

  if (!html) {
    return (
      <p>
        Unable to load the changelog. Please view it on{" "}
        <a href={GITHUB_URL}>GitHub</a>.
      </p>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
