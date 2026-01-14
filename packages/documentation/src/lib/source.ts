import { loader, type Source, type PageData, type MetaData } from "fumadocs-core/source";
import { docs } from "fumadocs-mdx:collections/server";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import type {
  DocCollectionEntry,
  MetaCollectionEntry,
} from "fumadocs-mdx/runtime/server";

const docsSource = docs.toFumadocsSource() as Source<{
  pageData: DocCollectionEntry<"docs", PageData>;
  metaData: MetaCollectionEntry<MetaData>;
}>;

export const source = loader({
  source: docsSource,
  baseUrl: "/docs",
  plugins: [lucideIconsPlugin()],
});
