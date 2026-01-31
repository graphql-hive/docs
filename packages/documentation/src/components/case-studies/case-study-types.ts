import { z } from "zod";

import { MdxFile } from "../../mdx-types";

export const CaseStudyAuthor = z.object({
  avatar: z.string().optional(),
  name: z.string(),
  position: z.string().optional(),
});

export type CaseStudyAuthor = z.infer<typeof CaseStudyAuthor>;

export const CaseStudyFrontmatter = z.object({
  authors: z.array(CaseStudyAuthor).default([]),
  category: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) as unknown as z.ZodType<
    `${number}-${number}-${number}`
  >,
  excerpt: z.string(),
  title: z.string(),
});

export type CaseStudyFrontmatter = z.infer<typeof CaseStudyFrontmatter>;

export const CaseStudyFile = MdxFile(CaseStudyFrontmatter);
export type CaseStudyFile = z.infer<typeof CaseStudyFile>;
