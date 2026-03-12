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
  head: ({ params }: { params: { _splat?: string } }) => {
    const tag = params._splat ?? "";
    return seo({
      breadcrumbs: [
        { name: "Blog", pathname: "/blog" },
        { name: tag, pathname: `/blog/tag/${tag}` },
      ],
      description: `Posts tagged ${tag} in the Hive Blog.`,
      pathname: `/blog/tag/${tag}`,
      title: `Hive Blog - ${tag}`,
    });
  },
  loader: ({ params }) =>
    serverGetPostsByTag({ data: params._splat ?? "" }) as Promise<BlogPost[]>,
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
