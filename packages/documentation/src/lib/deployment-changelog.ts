import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

export const CHANGELOG_URL =
  "https://raw.githubusercontent.com/graphql-hive/console/main/deployment/CHANGELOG.md";

export const CHANGELOG_PAGE_URL =
  "/docs/schema-registry/self-hosting/changelog";

export async function fetchChangelogMarkdown(): Promise<string | null> {
  try {
    const res = await fetch(CHANGELOG_URL);
    if (!res.ok) return null;
    let markdown = await res.text();
    // Strip the top-level "# hive" heading
    markdown = markdown.replace(/^#\s+.*\n/, "");
    return markdown;
  } catch {
    return null;
  }
}

let cache: { html: string; timestamp: number } | null = null;
const ONE_HOUR = 3_600_000;

export async function fetchAndRenderChangelog(): Promise<string> {
  if (cache && Date.now() - cache.timestamp < ONE_HOUR) {
    return cache.html;
  }

  const markdown = await fetchChangelogMarkdown();

  if (markdown != null) {
    const html = String(
      await remark()
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(markdown),
    );

    cache = { html, timestamp: Date.now() };
    return html;
  }

  // Serve stale cache on failure
  if (cache) return cache.html;
  return "";
}
