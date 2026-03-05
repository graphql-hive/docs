import { getChangelogs } from "@/components/get-changelogs";
import { createFileRoute } from "@tanstack/react-router";
import RSS from "rss";

const SITE_URL = "https://the-guild.dev/graphql/hive";

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        const feed = new RSS({
          feed_url: `${SITE_URL}/feed.xml`,
          site_url: SITE_URL,
          title: "Hive Changelog",
        });

        for (const item of await getChangelogs()) {
          feed.item({
            date: item.date,
            description: item.description,
            title: item.title,
            url: `${SITE_URL}${item.route}`,
          });
        }

        return new Response(feed.xml({ indent: true }), {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
