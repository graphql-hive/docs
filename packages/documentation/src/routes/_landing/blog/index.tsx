import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { getBlogPosts } from "../../../components/blog/get-blog-posts";
import { PostsByTag } from "../../../components/blog/posts-by-tag";
import { LandingPageContainer } from "../../../components/landing-page-container";

const serverGetBlogPosts = createServerFn({ method: "GET" }).handler(async () =>
  getBlogPosts(),
);

export const Route = createFileRoute("/_landing/blog/")({
  component: BlogListRoute,
  loader: () => serverGetBlogPosts(),
});

function BlogListRoute() {
  const posts = Route.useLoaderData();

  return (
    <LandingPageContainer className="text-green-1000 mx-auto max-w-360 overflow-hidden dark:text-neutral-200">
      <PostsByTag posts={posts} />
    </LandingPageContainer>
  );
}
