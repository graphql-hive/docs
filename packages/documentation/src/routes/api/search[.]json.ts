import { buildIndexes } from "@/lib/search-indexes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/search.json")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(await buildIndexes(), {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        });
      },
    },
  },
});
