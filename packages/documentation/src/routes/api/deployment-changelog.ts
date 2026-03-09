import { createFileRoute } from "@tanstack/react-router";

import { fetchAndRenderChangelog } from "../../lib/deployment-changelog";

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
