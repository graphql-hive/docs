import remarkGfm from "remark-gfm";
import { createHighlighterCoreSync } from "shiki/core";
import bash from "shiki/dist/langs/bash.mjs";
import diff from "shiki/dist/langs/diff.mjs";
import dockerfile from "shiki/dist/langs/dockerfile.mjs";
import go from "shiki/dist/langs/go.mjs";
import graphql from "shiki/dist/langs/graphql.mjs";
import javascript from "shiki/dist/langs/javascript.mjs";
import js from "shiki/dist/langs/js.mjs";
import json from "shiki/dist/langs/json.mjs";
import json5 from "shiki/dist/langs/json5.mjs";
import jsonc from "shiki/dist/langs/jsonc.mjs";
import jsx from "shiki/dist/langs/jsx.mjs";
import php from "shiki/dist/langs/php.mjs";
import python from "shiki/dist/langs/python.mjs";
import ruby from "shiki/dist/langs/ruby.mjs";
import rust from "shiki/dist/langs/rust.mjs";
import sh from "shiki/dist/langs/sh.mjs";
import toml from "shiki/dist/langs/toml.mjs";
import ts from "shiki/dist/langs/ts.mjs";
import tsx from "shiki/dist/langs/tsx.mjs";
import typescript from "shiki/dist/langs/typescript.mjs";
import yaml from "shiki/dist/langs/yaml.mjs";
import githubDark from "shiki/dist/themes/github-dark.mjs";
import githubLight from "shiki/dist/themes/github-light.mjs";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import { DOCS_CODE_LANGS, DOCS_CODE_THEMES } from "./docs-code-config";

const DEFAULT_CHANGELOG_URL =
  "https://raw.githubusercontent.com/graphql-hive/console/main/deployment/CHANGELOG.md";

export const CHANGELOG_PAGE_URL =
  "/docs/schema-registry/self-hosting/changelog";

const ONE_HOUR = 3_600_000;

let markdownCache: { markdown: string; timestamp: number } | null = null;
let highlighter: ReturnType<typeof createHighlighterCoreSync> | null = null;

type HastNode = {
  children?: HastNode[];
  properties?: Record<string, unknown>;
  tagName?: string;
  type: string;
  value?: string;
};

const SUPPORTED_LANGUAGES = new Set<string>(DOCS_CODE_LANGS);
const LANGUAGE_IMPORTS = {
  bash,
  diff,
  dockerfile,
  go,
  graphql,
  javascript,
  js,
  json,
  json5,
  jsonc,
  jsx,
  php,
  python,
  ruby,
  rust,
  sh,
  toml,
  ts,
  tsx,
  typescript,
  yaml,
} as const;

function getChangelogUrl() {
  return process.env["DEPLOYMENT_CHANGELOG_URL"] ?? DEFAULT_CHANGELOG_URL;
}

function stripTopLevelHeading(markdown: string) {
  return markdown.replace(/^#\s+.*\n/, "");
}

function isElement(node: HastNode | undefined): node is HastNode & {
  children: HastNode[];
  properties: Record<string, unknown>;
  tagName: string;
} {
  return (
    node?.type === "element" &&
    typeof node.tagName === "string" &&
    Array.isArray(node.children) &&
    typeof node.properties === "object" &&
    node.properties !== null
  );
}

function getNodeText(node: HastNode): string {
  if (node.type === "text") {
    return node.value ?? "";
  }

  return node.children?.map(getNodeText).join("") ?? "";
}

function getCodeLanguage(node: HastNode): string | null {
  if (!isElement(node)) return null;

  const className = node.properties["className"];
  const classNames =
    typeof className === "string"
      ? className.split(/\s+/)
      : Array.isArray(className)
        ? className.filter(
            (value): value is string => typeof value === "string",
          )
        : [];

  for (const name of classNames) {
    if (name.startsWith("language-")) {
      return name.slice("language-".length);
    }
    if (name.startsWith("lang-")) {
      return name.slice("lang-".length);
    }
  }

  return null;
}

function getHighlighter() {
  if (highlighter) {
    return highlighter;
  }

  highlighter = createHighlighterCoreSync({
    engine: createJavaScriptRegexEngine(),
    langs: DOCS_CODE_LANGS.map((lang) => LANGUAGE_IMPORTS[lang]),
    themes: [githubLight, githubDark],
  });

  return highlighter;
}

function highlightCodeBlock(
  highlighter: ReturnType<typeof createHighlighterCoreSync>,
  preNode: HastNode,
) {
  if (!isElement(preNode) || preNode.tagName !== "pre") {
    return preNode;
  }

  const codeNode = preNode.children[0];
  if (!isElement(codeNode) || codeNode.tagName !== "code") {
    return preNode;
  }

  const lang = getCodeLanguage(codeNode);
  if (!lang || !SUPPORTED_LANGUAGES.has(lang)) {
    return preNode;
  }

  const highlighted = highlighter.codeToHast(getNodeText(codeNode), {
    lang,
    themes: DOCS_CODE_THEMES,
  });
  const result = highlighted.children[0];

  return isElement(result) ? result : preNode;
}

function transformCodeBlocks(
  node: HastNode,
  highlighter: ReturnType<typeof createHighlighterCoreSync>,
) {
  if (!node.children) return;

  node.children = node.children.map((child) => {
    const next =
      isElement(child) && child.tagName === "pre"
        ? highlightCodeBlock(highlighter, child)
        : child;

    transformCodeBlocks(next, highlighter);
    return next;
  });
}

export function rehypeHighlightChangelogCodeBlocks() {
  const highlighter = getHighlighter();
  return (tree: HastNode) => {
    transformCodeBlocks(tree, highlighter);
  };
}

export const DEPLOYMENT_CHANGELOG_MARKDOWN_PLUGINS = [remarkGfm] as const;
export const DEPLOYMENT_CHANGELOG_REHYPE_PLUGINS = [
  rehypeHighlightChangelogCodeBlocks,
] as const;

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

export function __resetDeploymentChangelogCacheForTests() {
  markdownCache = null;
  highlighter = null;
}
