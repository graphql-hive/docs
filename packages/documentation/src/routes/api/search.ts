import type { StructuredData } from "fumadocs-core/mdx-plugins/remark-structure";
import type { AdvancedIndex } from "fumadocs-core/search/server";

import { getSource } from "@/lib/source";
import { createFileRoute } from "@tanstack/react-router";
import { findPath } from "fumadocs-core/page-tree";
import { createSearchAPI } from "fumadocs-core/search/server";

function getDocsBreadcrumbs(
  source: Awaited<ReturnType<typeof getSource>>,
  pageUrl: string,
): string[] | undefined {
  const pageTree = source.getPageTree();
  const path = findPath(
    pageTree.children,
    (node) => node.type === "page" && node.url === pageUrl,
  );
  if (!path) return undefined;
  path.pop();
  const breadcrumbs: string[] = [];
  if (typeof pageTree.name === "string" && pageTree.name.length > 0) {
    breadcrumbs.push(pageTree.name);
  }
  for (const segment of path) {
    if (typeof segment.name === "string" && segment.name.length > 0) {
      breadcrumbs.push(segment.name);
    }
  }
  return breadcrumbs;
}

/**
 * Resolve structuredData from a page — handles both sync (DocCollectionEntry)
 * and async (AsyncDocCollectionEntry) docs, matching fumadocs' defaultBuildIndex.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors fumadocs' defaultBuildIndex runtime check for sync/async DocCollectionEntry
async function resolveStructuredData(data: any): Promise<StructuredData> {
  if ("structuredData" in data) return data.structuredData;
  if (typeof data.load === "function") {
    const loaded = await data.load();
    return loaded.structuredData;
  }
  throw new Error("Cannot resolve structuredData from page");
}

async function buildIndexes(): Promise<AdvancedIndex[]> {
  const source = await getSource();
  const { caseStudies, productUpdates } = await import(
    "fumadocs-mdx:collections/server"
  );

  const docsIndexes = await Promise.all(
    source.getPages().map(async (page) => ({
      breadcrumbs: getDocsBreadcrumbs(source, page.url),
      description: page.data.description,
      id: page.url,
      structuredData: await resolveStructuredData(page.data),
      title: page.data.title ?? page.url,
      url: page.url,
    })),
  );

  const caseStudyIndexes = await Promise.all(
    caseStudies.map(async (entry) => {
      const { structuredData } = await entry.load();
      const slug = entry.info.path.replace(/\.mdx?$/, "");
      return {
        breadcrumbs: ["Case Studies"],
        description: entry.excerpt,
        id: `/case-studies/${slug}`,
        structuredData,
        title: entry.title,
        url: `/case-studies/${slug}`,
      };
    }),
  );

  const productUpdateIndexes = await Promise.all(
    productUpdates.map(async (entry) => {
      const { structuredData } = await entry.load();
      const slug = entry.info.path.replace(/\.mdx?$/, "");
      return {
        breadcrumbs: ["Product Updates"],
        description: entry.description,
        id: `/product-updates/${slug}`,
        structuredData,
        title: entry.title ?? slug,
        url: `/product-updates/${slug}`,
      };
    }),
  );

  // TODO: index landing pages (/, /federation, /schema-registry, etc.) once they have structuredData
  return [...docsIndexes, ...caseStudyIndexes, ...productUpdateIndexes];
}

let _searchAPI: ReturnType<typeof createSearchAPI> | undefined;

async function getSearchAPI() {
  _searchAPI ||= createSearchAPI("advanced", {
    indexes: await buildIndexes(),
    language: "english",
  });
  return _searchAPI;
}

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const server = await getSearchAPI();
        return server.GET(request);
      },
    },
  },
});
