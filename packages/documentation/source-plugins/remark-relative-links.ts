import { existsSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

/**
 * Remark plugin that resolves relative MDX links to absolute `/docs/...` URLs.
 *
 * Relative links like `[text](../foo)` or `[text](../foo.mdx)` are not
 * transformed by Fumadocs and break TanStack Start prerender.
 * This plugin resolves them against the filesystem and rewrites to
 * absolute URL paths like `/docs/router/plugin-system`.
 */
export function remarkRelativeLinks() {
  return remarkRelativeLinkTransform;
}

interface MdAstNode {
  children?: MdAstNode[];
  type: string;
  url?: string;
}

const CONTENT_DOCS_DIR = resolve("content/docs");

function remarkRelativeLinkTransform(
  tree: MdAstNode,
  file: { history?: string[]; path?: string },
) {
  const filePath = file.path ?? file.history?.[0];
  if (!filePath) return;

  const dir = dirname(filePath);

  visitLinks(tree, (node) => {
    const { url } = node;
    if (!url || (!url.startsWith("./") && !url.startsWith("../"))) return;

    const [rawPath, hash] = url.split("#") as [string, string | undefined];
    const suffix = hash ? `#${hash}` : "";

    // Strip .mdx/.md extension if present
    const pathWithoutExt = rawPath.replace(/\.mdx?$/, "");

    // Try to find the actual file
    const resolved = resolveDocFile(dir, pathWithoutExt);
    if (!resolved) return;

    // Compute the URL path relative to content/docs
    const rel = relative(CONTENT_DOCS_DIR, resolved);
    // Strip /index from the end (index pages don't have /index in the URL)
    const urlPath = rel.replace(/\.mdx?$/, "").replace(/\/index$/, "");
    node.url = `/docs/${urlPath}${suffix}`;
  });
}

function resolveDocFile(dir: string, pathWithoutExt: string): string | null {
  for (const candidate of [
    `${pathWithoutExt}.mdx`,
    `${pathWithoutExt}.md`,
    `${pathWithoutExt}/index.mdx`,
    `${pathWithoutExt}/index.md`,
  ]) {
    const full = resolve(dir, candidate);
    if (existsSync(full)) return full;
  }
  return null;
}

function visitLinks(node: MdAstNode, fn: (node: MdAstNode) => void) {
  if (node.type === "link") fn(node);
  if (node.children) {
    for (const child of node.children) visitLinks(child, fn);
  }
}
