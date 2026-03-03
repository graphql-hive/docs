import type { BlogPost } from "./blog-card";

export async function getBlogPosts(): Promise<BlogPost[]> {
  const collections = await import("fumadocs-mdx:collections/server");
  return collections.blog
    .map((entry) => {
      const slug = entry.info.path
        .replace(/^\//, "")
        .replace(/\/index$/, "")
        .replace(/\.mdx?$/, "");
      return {
        authors: entry.authors,
        date: entry.date,
        description: entry.description ?? "",
        featured: entry.featured ?? false,
        route: `/blog/${slug}`,
        slug,
        tags: entry.tags,
        title: entry.title ?? slug,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
