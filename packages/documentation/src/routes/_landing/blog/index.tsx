import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { BlogPageLayout } from "../../../components/blog/blog-page-layout";
import { getBlogPosts } from "../../../components/blog/get-blog-posts";
import { NewsletterFormCard } from "../../../components/blog/newsletter-form-card";
import { PostsByTag } from "../../../components/blog/posts-by-tag";
import { seo } from "../../../lib/seo";

const serverGetBlogPosts = createServerFn({ method: "GET" }).handler(async () =>
  getBlogPosts(),
);

export const Route = createFileRoute("/_landing/blog/")({
  component: BlogListRoute,
  head: seo({
    description:
      "Articles, product updates, and case studies from GraphQL Hive.",
    title: "Hive Blog",
  }),
  loader: () => serverGetBlogPosts(),
});

function BlogListRoute() {
  const posts = Route.useLoaderData();

  return (
    <BlogPageLayout>
      <PostsByTag posts={posts}>
        <NewsletterFormCard />
      </PostsByTag>
    </BlogPageLayout>
  );
}
