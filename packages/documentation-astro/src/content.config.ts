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

export const collections = {
  docs,
  productUpdates,
};
