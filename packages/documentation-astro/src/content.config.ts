import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const contentRoot = "../documentation/content";

const docs = defineCollection({
  loader: glob({
    base: `${contentRoot}/docs`,
    pattern: "**/*.{md,mdx}",
  }),
});

const productUpdates = defineCollection({
  loader: glob({
    base: `${contentRoot}/product-updates`,
    pattern: "**/*.{md,mdx}",
  }),
});

const caseStudies = defineCollection({
  loader: glob({
    base: `${contentRoot}/case-studies`,
    pattern: "**/*.{md,mdx}",
  }),
});

const blog = defineCollection({
  loader: glob({
    base: `${contentRoot}/blog`,
    pattern: "**/*.{md,mdx}",
  }),
});

export const collections = {
  blog,
  caseStudies,
  docs,
  productUpdates,
};
