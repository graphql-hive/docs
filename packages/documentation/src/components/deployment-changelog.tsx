"use client";

import { runSync } from "@mdx-js/mdx";
import { mdxComponents } from "@/lib/mdx-components";
import type { MDXContent } from "mdx/types";
import * as Twoslash from "fumadocs-twoslash/ui";
import { use } from "react";
import * as jsxRuntime from "react/jsx-runtime";

import { getChangelogCode } from "../lib/deployment-changelog.server";

const GITHUB_URL =
  "https://github.com/graphql-hive/console/blob/main/deployment/CHANGELOG.md";

let codePromise: Promise<string> | null = null;
const contentCache = new Map<string, MDXContent>();

function getContent(code: string): MDXContent {
  let cached = contentCache.get(code);
  if (cached) return cached;

  const module = runSync(code, {
    ...jsxRuntime,
    baseUrl: import.meta.url,
  });

  cached = module.default;
  contentCache.set(code, cached);
  return cached;
}

export function DeploymentChangelog() {
  const code = use((codePromise ??= getChangelogCode()));

  if (!code) {
    return (
      <p>
        Unable to load the changelog. Please view it on{" "}
        <a href={GITHUB_URL}>GitHub</a>.
      </p>
    );
  }

  const Content = getContent(code);

  return <Content components={{ ...mdxComponents, ...Twoslash }} />;
}
