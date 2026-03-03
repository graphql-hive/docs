import { cn } from "@hive/design-system/cn";

import type { BlogPost } from "./blog-card";

import { CategorySelect } from "./category-select";
import { FeaturedPosts } from "./featured-posts";
import { LatestPosts } from "./latest-posts";

const TOP_10_TAGS = [
  "graphql",
  "graphql-federation",
  "codegen",
  "typescript",
  "react",
  "graphql-hive",
  "node",
  "graphql-modules",
  "angular",
  "graphql-tools",
];

export function PostsByTag(props: {
  children?: React.ReactNode;
  className?: string;
  posts: BlogPost[];
  tag?: string;
}) {
  const tag = props.tag ?? null;

  const posts = [...props.posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  let categories = TOP_10_TAGS;
  if (tag && !TOP_10_TAGS.includes(tag)) {
    categories = [tag, ...TOP_10_TAGS];
  }

  return (
    <section className={cn("px-4 sm:px-6", props.className)}>
      <CategorySelect categories={categories} tag={tag} />
      <FeaturedPosts className="sm:mb-12 md:mt-16" posts={posts} tag={tag} />
      <LatestPosts posts={posts} tag={tag}>
        {props.children}
      </LatestPosts>
    </section>
  );
}
