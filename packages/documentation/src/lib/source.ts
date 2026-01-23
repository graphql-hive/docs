import type {
  DocCollectionEntry,
  MetaCollectionEntry,
} from "fumadocs-mdx/runtime/server";

import {
  loader,
  type MetaData,
  type PageData,
  type Source,
} from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { docs } from "fumadocs-mdx:collections/server";

const docsSource = docs.toFumadocsSource() as Source<{
  metaData: MetaCollectionEntry<MetaData>;
  pageData: DocCollectionEntry<"docs", PageData>;
}>;

export const source = loader({
  baseUrl: "/docs",
  plugins: [lucideIconsPlugin()],
  source: docsSource,
});
