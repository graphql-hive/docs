import { getSource } from "@/lib/source";
import { createFileRoute } from "@tanstack/react-router";
import { createFromSource } from "fumadocs-core/search/server";

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const source = await getSource();
        const server = createFromSource(source, {
          // https://docs.orama.com/docs/orama-js/supported-languages
          language: "english",
        });
        return server.GET(request);
      },
    },
  },
});
