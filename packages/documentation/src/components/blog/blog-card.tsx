import { Anchor } from "@hive/design-system/anchor";
import { cn } from "@hive/design-system/cn";

import { type Author, authors } from "../authors";
import { BlogTagChip } from "./blog-tag-chip";

export interface BlogPost {
  authors: string[];
  date: string;
  description: string;
  featured: boolean;
  route: string;
  tags: string[];
  title: string;
}

export interface BlogCardProps {
  className?: string;
  post: BlogPost;
  tag?: string | null;
  variant?: "default" | "featured";
}

export function BlogCard({ className, post, tag, variant }: BlogCardProps) {
  const { tags, title } = post;
  const date = new Date(post.date);

  const firstAuthor: (Author & { name: string }) | undefined = post.authors
    .map((authorId) => authors[authorId])
    .find(Boolean);

  const avatarSrc =
    firstAuthor?.github &&
    `https://avatars.githubusercontent.com/${firstAuthor.github}?v=4&s=48`;

  return (
    <Anchor
      className={cn(
        "group/card @container/card hive-focus hover:ring-beige-400 block rounded-2xl dark:ring-neutral-600 hover:not-focus:ring dark:hover:not-focus:ring-neutral-600",
        className,
      )}
      href={post.route}
    >
      <article
        className={cn(
          "text-green-1000 flex h-full flex-col gap-6 rounded-2xl p-6 lg:gap-10 dark:text-white",
          variant === "featured"
            ? "bg-beige-200 group-hover/card:bg-beige-300/70 dark:bg-neutral-700/70 dark:hover:bg-neutral-700"
            : "group-hover/card:bg-beige-200/70 bg-beige-100 dark:bg-neutral-800/70 dark:hover:bg-neutral-800",
        )}
      >
        <header className="flex items-center justify-between gap-1 text-sm/5 font-medium">
          <BlogTagChip
            colorScheme={variant || "default"}
            inert
            tag={tag ?? tags[0] ?? ""}
          />
          <time
            className="text-beige-800 whitespace-pre text-sm/5 font-medium"
            dateTime={date.toISOString()}
          >
            {date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
        </header>
        <h3
          className={cn(
            "text-xl/7 lg:min-h-[120px]",
            variant === "featured" && "@[288px]/card:text-2xl/8",
          )}
        >
          {title}
        </h3>
        <footer className="mt-auto flex items-center gap-3">
          {avatarSrc && firstAuthor && (
            <>
              <div className="relative size-6">
                <img
                  alt=""
                  className="rounded-full"
                  height={24}
                  loading="lazy"
                  role="presentation"
                  src={avatarSrc}
                  width={24}
                />
                <div className="bg-beige-200/70 absolute inset-0 size-full rounded-full opacity-30 mix-blend-hue" />
              </div>
              <span className="text-sm/5 font-medium">{firstAuthor.name}</span>
            </>
          )}
        </footer>
      </article>
    </Anchor>
  );
}
