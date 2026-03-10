import { compile } from "@mdx-js/mdx";
import type { CompileOptions } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

const DEFAULT_CHANGELOG_URL =
  "https://raw.githubusercontent.com/graphql-hive/console/main/deployment/CHANGELOG.md";

export const CHANGELOG_PAGE_URL =
  "/docs/schema-registry/self-hosting/changelog";

const ONE_HOUR = 3_600_000;
const CHANGELOG_PATH = "deployment/CHANGELOG.md";

let markdownCache: { markdown: string; timestamp: number } | null = null;
let compiledCache: { code: string; markdown: string } | null = null;
let runtimeCompileOptionsPromise: Promise<CompileOptions> | undefined;

function getChangelogUrl() {
  return process.env["DEPLOYMENT_CHANGELOG_URL"] ?? DEFAULT_CHANGELOG_URL;
}

function stripTopLevelHeading(markdown: string) {
  return markdown.replace(/^#\s+.*\n/, "");
}

async function getRuntimeCompileOptions(): Promise<CompileOptions> {
  runtimeCompileOptionsPromise ||= (async () => {
    return {
      development: false,
      format: "md",
      outputFormat: "function-body",
      remarkPlugins: [remarkGfm],
    };
  })();

  return runtimeCompileOptionsPromise;
}

export async function getDeploymentChangelogMarkdown(): Promise<string | null> {
  if (markdownCache && Date.now() - markdownCache.timestamp < ONE_HOUR) {
    return markdownCache.markdown;
  }

  try {
    const res = await fetch(getChangelogUrl());
    if (!res.ok) return null;
    const markdown = stripTopLevelHeading(await res.text());
    markdownCache = { markdown, timestamp: Date.now() };
    return markdown;
  } catch {
    return markdownCache?.markdown ?? null;
  }
}

export async function compileDeploymentChangelogToCode(markdown: string) {
  const compiled = await compile(
    { path: CHANGELOG_PATH, value: markdown },
    await getRuntimeCompileOptions(),
  );
  return String(compiled);
}

export async function getDeploymentChangelogCode(): Promise<string> {
  const markdown = await getDeploymentChangelogMarkdown();
  if (!markdown) return "";

  if (compiledCache?.markdown === markdown) {
    return compiledCache.code;
  }

  try {
    const code = await compileDeploymentChangelogToCode(markdown);
    compiledCache = { code, markdown };
    return code;
  } catch {
    return compiledCache?.code ?? "";
  }
}

export function __resetDeploymentChangelogCacheForTests() {
  markdownCache = null;
  compiledCache = null;
  runtimeCompileOptionsPromise = undefined;
}
