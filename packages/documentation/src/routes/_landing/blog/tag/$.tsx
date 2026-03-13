import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import type { BlogPost } from "../../../../components/blog/blog-card";

import { BlogPageLayout } from "../../../../components/blog/blog-page-layout";
import { getBlogPosts } from "../../../../components/blog/get-blog-posts";
import { PostsByTag } from "../../../../components/blog/posts-by-tag";
import { seo } from "../../../../lib/seo";

const serverGetPostsByTag = createServerFn({ method: "GET" })
  .inputValidator((tag: string) => tag)
  .handler(async ({ data: tag }) => {
    const allPosts = await getBlogPosts();
    return allPosts.filter((post) => post.tags.includes(tag));
  });

export const Route = createFileRoute("/_landing/blog/tag/$")({
  component: BlogTagRoute,
  head: seo(({ match, params }) => {
    const tag = params["_splat"] ?? "";
    return {
      breadcrumbs: [
        { name: "Blog", pathname: "/blog" },
        { name: tag, pathname: match.pathname },
      ],
      description: `Posts tagged ${tag} in the Hive Blog.`,
      title: `Hive Blog - ${tag}`,
    };
  }),
  loader: ({ params }) =>
    serverGetPostsByTag({ data: params["_splat"] ?? "" }) as Promise<
      BlogPost[]
    >,
});

function BlogTagRoute() {
  const posts = Route.useLoaderData();
  const { _splat: tag } = Route.useParams();

  return (
    <BlogPageLayout>
      <PostsByTag posts={posts} tag={tag} />
    </BlogPageLayout>
  );
}
