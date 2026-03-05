import { pathToSlug } from "@/lib/path-to-slug";

import { CaseStudyFile } from "./case-study-types";

export async function getCaseStudies(): Promise<CaseStudyFile[]> {
  const { caseStudies } = await import("fumadocs-mdx:collections/server");
  return caseStudies
    .map((entry) => {
      const slug = pathToSlug(entry.info.path);
      return {
        frontMatter: {
          authors: entry.authors,
          category: entry.category,
          date: entry.date as `${number}-${number}-${number}`,
          excerpt: entry.excerpt,
          title: entry.title,
        },
        name: slug,
        path: entry.info.path,
        route: `/case-studies/${slug}`,
      };
    })
    .sort((a, b) => (a.frontMatter.date < b.frontMatter.date ? 1 : -1));
}
