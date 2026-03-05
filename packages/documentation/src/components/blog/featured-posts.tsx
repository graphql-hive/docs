import { cn } from "@hive/design-system/cn";

import { BlogCard, type BlogPost } from "./blog-card";

export function FeaturedPosts({
  className,
  posts,
  tag,
}: {
  className?: string;
  posts: BlogPost[];
  tag: string | null;
}) {
  const featuredPosts = posts.filter((post) => post.featured).slice(0, 3);

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <ul
      className={cn(
        "mt-6 flex items-stretch gap-4 *:flex-1 max-md:flex-col sm:gap-6 lg:mt-16",
        className,
      )}
    >
      {featuredPosts.map((post) => (
        <li key={post.route}>
          <BlogCard
            className="h-full"
            post={post}
            tag={tag}
            variant="featured"
          />
        </li>
      ))}
    </ul>
  );
}
