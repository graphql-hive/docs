import { cn } from "@hive/design-system/cn";
import { Heading } from "@hive/design-system/heading";

import type { BlogPost } from "../blog-card";

import { ArrowIcon } from "../../arrow-icon";
import { SimilarPostsClient } from "./client";

export function SimilarPosts({
  allPosts,
  className,
  currentTags,
  currentTitle,
}: {
  allPosts: BlogPost[];
  className?: string;
  currentTags: string[];
  currentTitle: string;
}) {
  return (
    <section
      className={cn(
        "flex items-stretch gap-4 py-6 *:flex-1 max-md:flex-col sm:gap-6 lg:p-24",
        "has-[del]:hidden",
        className,
      )}
    >
      <div className="text-green-1000 md:max-w-[36%] dark:text-neutral-100">
        <header className="flex items-center justify-between max-md:justify-center">
          <Heading as="h3" size="md">
            Explore
          </Heading>
          <ArrowIcon className="ml-2 size-12 shrink-0 max-md:hidden" />
        </header>
        <p className="mt-4 max-md:text-center">
          Dive deeper into related topics.
        </p>
      </div>
      <SimilarPostsClient
        currentTags={currentTags}
        currentTitle={currentTitle}
        sortedPosts={allPosts}
      />
    </section>
  );
}
