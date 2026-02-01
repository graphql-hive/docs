import { type } from "arktype";

export const CaseStudyAuthor = type({
  "avatar?": "string",
  name: "string",
  "position?": "string",
});

export type CaseStudyAuthor = typeof CaseStudyAuthor.infer;

export const CaseStudyFrontmatter = type({
  "authors?": CaseStudyAuthor.array(),
  category: "string",
  date: /^\d{4}-\d{2}-\d{2}$/ as type.cast<`${number}-${number}-${number}`>,
  excerpt: "string",
  title: "string",
});

export type CaseStudyFrontmatter = typeof CaseStudyFrontmatter.infer;

export const CaseStudyFile = type({
  frontMatter: CaseStudyFrontmatter,
  name: "string",
  route: "string",
});

export type CaseStudyFile = typeof CaseStudyFile.infer;
