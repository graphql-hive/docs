"use client";

import { use } from "react";

import { getChangelogHtml } from "../lib/deployment-changelog.server";

const GITHUB_URL =
  "https://github.com/graphql-hive/console/blob/main/deployment/CHANGELOG.md";

let htmlPromise: Promise<string> | null = null;

export function DeploymentChangelog() {
  const html = use((htmlPromise ??= getChangelogHtml()));

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
