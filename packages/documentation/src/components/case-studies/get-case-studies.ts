import { caseStudies } from "fumadocs-mdx:collections/server";

import { CaseStudyFile } from "./case-study-types";

export async function getCaseStudies(): Promise<CaseStudyFile[]> {
  return caseStudies
    .map((entry) => {
      const slug = entry.info.path
        .replace(/^\//, "")
        .replace(/\/$/, "")
        .replace(/\.mdx?$/, "");
      return {
        frontMatter: {
          authors: entry.authors,
          category: entry.category,
          date: entry.date as `${number}-${number}-${number}`,
          excerpt: entry.excerpt,
          title: entry.title,
        },
        name: slug,
        route: `/case-studies/${slug}`,
      };
    })
    .sort((a, b) => (a.frontMatter.date < b.frontMatter.date ? 1 : -1));
}
