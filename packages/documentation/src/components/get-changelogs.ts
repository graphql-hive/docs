type Changelog = {
  date: string;
  description: string;
  route: string;
  title: string;
};

import { pathToSlug } from "@/lib/path-to-slug";

export async function getChangelogs(): Promise<Changelog[]> {
  const collections = await import("fumadocs-mdx:collections/server");
  return collections.productUpdates
    .map((entry) => {
      const slug = pathToSlug(entry.info.path);
      return {
        date: entry.date,
        description: entry.description ?? "",
        route: `/product-updates/${slug}`,
        title: entry.title ?? slug,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
