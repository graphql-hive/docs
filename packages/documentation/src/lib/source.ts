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

function createSource(docs: { toFumadocsSource(): unknown }) {
  const docsSource = docs.toFumadocsSource() as Source<{
    metaData: MetaCollectionEntry<MetaData>;
    pageData: DocCollectionEntry<"docs", PageData>;
  }>;
  return loader({
    baseUrl: "/docs",
    plugins: [lucideIconsPlugin()],
    source: docsSource,
  });
}

export type DocsSource = ReturnType<typeof createSource>;

let _source: DocsSource | undefined;

export async function getSource(): Promise<DocsSource> {
  if (!_source) {
    const { docs } = await import("fumadocs-mdx:collections/server");
    _source = createSource(docs);
  }
  return _source;
}

export async function getSerializedPageTree() {
  const source = await getSource();
  return source.serializePageTree(source.getPageTree());
}
