import { createFileRoute } from "@tanstack/react-router";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

const CHANGELOG_URL =
  "https://raw.githubusercontent.com/graphql-hive/console/main/deployment/CHANGELOG.md";

let cache: { html: string; timestamp: number } | null = null;
const ONE_HOUR = 3_600_000;

async function fetchAndRenderChangelog(): Promise<string> {
  if (cache && Date.now() - cache.timestamp < ONE_HOUR) {
    return cache.html;
  }

  try {
    const res = await fetch(CHANGELOG_URL);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    let markdown = await res.text();
    // Strip the top-level "# hive" heading
    markdown = markdown.replace(/^#\s+.*\n/, "");

    const html = String(
      await remark()
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(markdown),
    );

    cache = { html, timestamp: Date.now() };
    return html;
  } catch {
    // Serve stale cache on failure
    if (cache) return cache.html;
    return "";
  }
}

export const Route = createFileRoute("/api/deployment-changelog")({
  server: {
    handlers: {
      GET: async () => {
        const html = await fetchAndRenderChangelog();
        return new Response(html, {
          headers: {
            "Cache-Control":
              "public, s-maxage=3600, stale-while-revalidate=86400",
            "Content-Type": "text/html; charset=utf-8",
          },
        });
      },
    },
  },
});
