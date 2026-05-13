import { buildIndexes } from "@/lib/search-indexes";
import { createFileRoute } from "@tanstack/react-router";
import { createSearchAPI, type SearchAPI } from "fumadocs-core/search/server";

let searchServerPromise: Promise<SearchAPI> | undefined;

async function getSearchServer() {
  searchServerPromise ??= buildIndexes().then((indexes) =>
    createSearchAPI("advanced", {
      indexes,
      language: "english",
    }),
  );

  return searchServerPromise;
}

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const server = await getSearchServer();

        return server.GET(request);
      },
    },
  },
});
