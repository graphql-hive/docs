import { Anchor } from "@hive/design-system/anchor";
import { cn } from "@hive/design-system/cn";
import { Heading } from "@hive/design-system/heading";

import { ArrowIcon } from "../arrow-icon";
import { ProductUpdateAuthors } from "../product-update-header";
import { BlogPostPicture } from "./blog-post-picture";
import { BlogTagChip } from "./blog-tag-chip";

export function BlogPostHeader({
  authors,
  className,
  date,
  image,
  tags,
  title,
}: {
  authors: string[];
  className?: string;
  date: string;
  image?: string;
  tags: string[];
  title: string;
}) {
  const tag = tags[0];

  return (
    <>
      {image && <BlogPostPicture image={image} />}
      <header
        className={cn(
          "flex flex-col px-1 pb-6 pt-4 sm:items-center md:px-12 md:pb-16 md:pt-12 xl:w-[888px]",
          image &&
            "-mt-16 max-sm:mx-6 rounded-3xl bg-white dark:bg-neutral-900/80",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <Anchor
            className="outline-none focus-visible:ring flex items-center gap-2 text-sm font-medium"
            href="/blog"
          >
            <ArrowIcon className="text-beige-1000 mr-1 size-4 rotate-180" />
            <span className="text-beige-800">Blog</span>
            {tag && <span className="text-beige-800"> /</span>}
          </Anchor>
          {tag && <BlogTagChip colorScheme="default" tag={tag} />}
        </div>
        <Heading
          as="h1"
          className="mb-0 mt-4 w-[--article-max-width] text-pretty sm:text-center"
          size="md"
        >
          {title}
        </Heading>
        <ProductUpdateAuthors
          authors={authors}
          className="mt-4 max-sm:justify-start"
          date={date}
        />
      </header>
    </>
  );
}
