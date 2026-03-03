import type { BlogPost } from "./blog-card";

/**
 * Returns a merged feed of blog posts, product updates, and case studies.
 * Mirrors the old site's behavior where all content types appear in /blog.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const collections = await import("fumadocs-mdx:collections/server");

  const blogPosts = collections.blog.map((entry) => {
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
  });

  const productUpdatePosts = collections.productUpdates.map((entry) => {
    const slug = entry.info.path
      .replace(/^\//, "")
      .replace(/\/index$/, "")
      .replace(/\.mdx?$/, "");
    return {
      authors: entry.authors.map((a) => (typeof a === "string" ? a : a.name)),
      date: entry.date,
      description: entry.description ?? "",
      featured: false,
      route: `/product-updates/${slug}`,
      slug,
      tags: ["Product Update"],
      title: entry.title ?? slug,
    };
  });

  const caseStudyPosts = collections.caseStudies.map((entry) => {
    const slug = entry.info.path
      .replace(/^\//, "")
      .replace(/\/index$/, "")
      .replace(/\.mdx?$/, "");
    return {
      authors: entry.authors.map((a) => (typeof a === "string" ? a : a.name)),
      date: entry.date,
      description: entry.excerpt ?? "",
      featured: false,
      route: `/case-studies/${slug}`,
      slug,
      tags: ["Case Study"],
      title: entry.title ?? slug,
    };
  });

  return [...blogPosts, ...productUpdatePosts, ...caseStudyPosts].sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
}
