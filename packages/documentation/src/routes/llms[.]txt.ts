import { getSource } from "@/lib/source";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const baseUrl = new URL(request.url).origin;
        const source = await getSource();
        const pages = source.getPages();

        const lines = [
          "# Hive Console",
          "",
          "> Hive Console documentation",
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
