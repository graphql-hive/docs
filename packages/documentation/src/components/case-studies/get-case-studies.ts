import { caseStudies } from "fumadocs-mdx:collections/server";

import { CaseStudyFile, CaseStudyFrontmatter } from "./case-study-types";

export async function getCaseStudies(): Promise<CaseStudyFile[]> {
  return caseStudies
    .map((entry) => {
      const frontMatter = CaseStudyFrontmatter.parse(entry);
      const slug = entry.info.path.replace(/^\//, "").replace(/\/$/, "");
      return {
        frontMatter,
        name: slug,
        route: `/case-studies/${slug}`,
      };
    })
    .sort((a, b) => (a.frontMatter.date < b.frontMatter.date ? 1 : -1));
}
