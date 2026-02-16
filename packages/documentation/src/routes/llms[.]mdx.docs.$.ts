import { getSource } from "@/lib/source";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/llms.mdx/docs/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slugs = params._splat?.split("/").filter(Boolean) ?? [];
        const source = await getSource();
        const page = source.getPage(slugs);
        if (!page) throw notFound();

        const processed = await page.data.getText("processed");
        // We're adding frontmatter back, but only the parts relevant to LLMs.
        const frontmatter = [
          "---",
          `title: ${page.data.title}`,
          page.data.description && `description: ${page.data.description}`,
          "---",
        ]
          .filter(Boolean)
          .join("\n");

        return new Response(`${frontmatter}\n${processed}`, {
          headers: {
            "Content-Type": "text/markdown",
          },
        });
      },
    },
  },
});
