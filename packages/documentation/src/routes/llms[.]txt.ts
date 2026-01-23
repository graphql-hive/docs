import { source } from "@/lib/source";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const baseUrl = new URL(request.url).origin;
        const pages = source.getPages();

        const lines = [
          "# GraphQL Hive",
          "",
          "> GraphQL Hive documentation",
          "",
          "## Docs",
          "",
          ...pages.map((page) => {
            const desc = page.data.description
              ? `: ${page.data.description}`
              : "";
            return `- [${page.data.title}](${baseUrl}${page.url}.md)${desc}`;
          }),
        ];

        return new Response(lines.join("\n"), {
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        });
      },
    },
  },
});
