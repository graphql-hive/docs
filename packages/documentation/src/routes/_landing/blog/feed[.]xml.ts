import { authors } from "@/components/authors";
import { getBlogPosts } from "@/components/blog/get-blog-posts";
import { createFileRoute } from "@tanstack/react-router";
import RSS from "rss";

const SITE_URL = "https://the-guild.dev/graphql/hive";

function resolveAuthorName(authorId: string): string | undefined {
  return authors[authorId]?.name;
}

export const Route = createFileRoute("/_landing/blog/feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await getBlogPosts();

        if (posts.length === 0) {
          throw new Error("No blog posts found for RSS feed");
        }

        const feed = new RSS({
          feed_url: `${SITE_URL}/blog/feed.xml`,
          site_url: `${SITE_URL}/blog`,
          title: "Hive Blog",
        });

        for (const post of posts) {
          const firstAuthor = post.authors[0];
          const author = firstAuthor
            ? resolveAuthorName(firstAuthor)
            : undefined;
          feed.item({
            categories: post.tags,
            date: new Date(post.date),
            description: post.description,
            title: post.title,
            url: `${SITE_URL}${post.route}`,
            ...(author ? { author } : {}),
          });
        }

        return new Response(feed.xml({ indent: true }), {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
