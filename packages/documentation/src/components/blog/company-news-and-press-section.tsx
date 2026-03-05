import { cn } from "@hive/design-system/cn";
import { Heading } from "@hive/design-system/heading";

import { BlogCard } from "./blog-card";

export function CompanyNewsAndPressSection({
  className,
}: {
  className?: string;
}) {
  return (
    <section className={cn("py-6 lg:py-24", className)}>
      <Heading as="h3" className="text-balance text-center" size="md">
        Company News and Press
      </Heading>
      <ul className="mt-6 flex items-stretch gap-4 *:flex-1 max-md:flex-col sm:gap-6 lg:mt-16">
        <li>
          <BlogCard
            className="h-full"
            post={{
              authors: ["dotan"],
              date: "2025-03-25",
              description: "",
              featured: true,
              route: "/blog/hive-platform-achieves-soc2-certification",
              tags: ["security"],
              title: "Hive Platform Achieves SOC-2 Type II Certification",
            }}
            variant="featured"
          />
        </li>
        <li>
          <BlogCard
            className="h-full"
            post={{
              authors: ["uri"],
              date: "2024-09-10",
              description: "",
              featured: true,
              route: "/blog/stellate-acquisition",
              tags: ["Company", "GraphQL"],
              title: "The Guild acquires Stellate",
            }}
            variant="featured"
          />
        </li>
        <li>
          <BlogCard
            className="h-full"
            post={{
              authors: ["uri"],
              date: "2024-02-24",
              description: "",
              featured: true,
              route: "https://the-guild.dev/blog/rebranding-in-open-source",
              tags: ["branding"],
              title: "Rebranding in open source",
            }}
            variant="featured"
          />
        </li>
      </ul>
    </section>
  );
}
