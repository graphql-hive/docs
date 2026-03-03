import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import type { BlogPost } from "../../../../components/blog/blog-card";

import { getBlogPosts } from "../../../../components/blog/get-blog-posts";
import { PostsByTag } from "../../../../components/blog/posts-by-tag";
import { LandingPageContainer } from "../../../../components/landing-page-container";

const serverGetPostsByTag = createServerFn({ method: "GET" })
  .inputValidator((tag: string) => tag)
  .handler(async ({ data: tag }) => {
    const allPosts = await getBlogPosts();
    return allPosts.filter((post) => post.tags.includes(tag));
  });

export const Route = createFileRoute("/_landing/blog/tag/$")({
  component: BlogTagRoute,
  loader: ({ params }) =>
    serverGetPostsByTag({ data: params._splat ?? "" }) as Promise<BlogPost[]>,
});

function BlogTagRoute() {
  const posts = Route.useLoaderData();
  const { _splat: tag } = Route.useParams();

  return (
    <LandingPageContainer className="text-green-1000 mx-auto max-w-360 overflow-hidden dark:text-neutral-200">
      <PostsByTag posts={posts} tag={tag} />
    </LandingPageContainer>
  );
}
