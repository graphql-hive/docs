declare module "fumadocs-mdx:collections/server" {
  import type {
    DocCollectionEntry,
    DocsCollectionEntry,
  } from "fumadocs-mdx/runtime/server";

  export const docs: DocsCollectionEntry;
  export const caseStudies: DocCollectionEntry[];
  export const productUpdates: DocCollectionEntry[];
}

declare module "fumadocs-mdx:collections/browser" {
  import type { DocCollectionEntry } from "fumadocs-mdx/runtime/browser";

  const browserCollections: {
    docs: DocCollectionEntry;
  };

  export default browserCollections;
}
