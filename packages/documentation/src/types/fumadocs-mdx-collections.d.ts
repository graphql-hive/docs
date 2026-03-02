declare module "fumadocs-mdx:collections/server" {
  import type {
    AsyncDocCollectionEntry,
    DocsCollectionEntry,
  } from "fumadocs-mdx/runtime/server";

  export const docs: DocsCollectionEntry;

  export const caseStudies: AsyncDocCollectionEntry<
    "caseStudies",
    {
      authors: {
        avatar?: string;
        name: string;
        position?: string;
      }[];
      category: string;
      date: string;
      excerpt: string;
      title: string;
    }
  >[];

  export const productUpdates: AsyncDocCollectionEntry<
    "productUpdates",
    {
      authors: {
        avatar?: string;
        name: string;
        position?: string;
      }[];
      date: string;
      description: string;
      title: string;
    }
  >[];
}

declare module "fumadocs-mdx:collections/browser" {
  import type { DocCollectionEntry } from "fumadocs-mdx/runtime/browser";

  const browserCollections: {
    caseStudies: DocCollectionEntry;
    docs: DocCollectionEntry;
    productUpdates: DocCollectionEntry;
  };

  export default browserCollections;
}
