import { productUpdates } from "fumadocs-mdx:collections/server";

type Changelog = {
  date: string;
  description: string;
  route: string;
  title: string;
};

export function getChangelogs(): Changelog[] {
  return productUpdates
    .map((entry) => {
      const slug = entry.info.path.replace(/^\//, "").replace(/\/$/, "");
      return {
        date: entry.date,
        description: entry.description ?? "",
        route: `/product-updates/${slug}`,
        title: entry.title ?? slug,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
