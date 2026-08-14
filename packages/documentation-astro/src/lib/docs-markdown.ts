import type { CollectionEntry } from "astro:content";

export type DocsEntry = CollectionEntry<"docs">;

export function getDocsSlug(entry: DocsEntry) {
  return entry.id.replace(/(^|\/)index$/, "").replace(/\.(md|mdx)$/, "");
}

export function getDocsMarkdown(entry: DocsEntry) {
  if (!entry.body)
    throw new Error(`Documentation entry has no Markdown body: ${entry.id}`);

  const data = entry.data as { description?: string; title?: string };
  const title = data.title ?? entry.id.split("/").at(-1) ?? entry.id;
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    data.description && `description: ${JSON.stringify(data.description)}`,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  return `${frontmatter}\n\n${entry.body.trim()}\n`;
}

export function markdownResponse(entry: DocsEntry) {
  return new Response(getDocsMarkdown(entry), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
