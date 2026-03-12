import type { StructuredData } from "fumadocs-core/mdx-plugins/remark-structure";
import type { AdvancedIndex } from "fumadocs-core/search/server";

import { CHANGELOG_PAGE_URL } from "@/lib/deployment-changelog";
import { pathToSlug } from "@/lib/path-to-slug";
import { getSource } from "@/lib/source";
import { createFileRoute } from "@tanstack/react-router";
import { structure } from "fumadocs-core/mdx-plugins/remark-structure";
import { findPath } from "fumadocs-core/page-tree";
import { createSearchAPI } from "fumadocs-core/search/server";
import { deploymentChangelogSnapshot } from "virtual:deployment-changelog-snapshot";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors fumadocs' defaultBuildIndex runtime check for sync/async DocCollectionEntry
async function resolveStructuredData(data: any): Promise<StructuredData> {
  if ("structuredData" in data) return data.structuredData;
  if (typeof data.load === "function") {
    const loaded = await data.load();
    return loaded.structuredData;
  }
  throw new Error("Cannot resolve structuredData from page");
}

async function getChangelogStructuredData(): Promise<StructuredData> {
  if (!deploymentChangelogSnapshot) return { contents: [], headings: [] };
  return structure(deploymentChangelogSnapshot);
}

async function buildIndexes(): Promise<AdvancedIndex[]> {
  const source = await getSource();
  const { blog, caseStudies, productUpdates } =
    await import("fumadocs-mdx:collections/server");

  const changelogStructuredData = getChangelogStructuredData();

  const docsIndexes = await Promise.all(
    source.getPages().map(async (page) => ({
      breadcrumbs: getDocsBreadcrumbs(source, page.url),
      description: page.data.description,
      id: page.url,
      structuredData:
        page.url === CHANGELOG_PAGE_URL
          ? await changelogStructuredData
          : await resolveStructuredData(page.data),
      title: page.data.title ?? page.url,
      url: page.url,
    })),
  );

  const caseStudyIndexes = await Promise.all(
    caseStudies.map(async (entry) => {
      const { structuredData } = await entry.load();
      const slug = pathToSlug(entry.info.path);
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
      const slug = pathToSlug(entry.info.path);
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

  const blogIndexes = await Promise.all(
    blog.map(async (entry) => {
      const { structuredData } = await entry.load();
      const slug = entry.info.path
        .replace(/\.mdx?$/, "")
        .replace(/\/index$/, "");
      return {
        breadcrumbs: ["Blog"],
        description: entry.description,
        id: `/blog/${slug}`,
        structuredData,
        title: entry.title ?? slug,
        url: `/blog/${slug}`,
      };
    }),
  );

  return [
    ...docsIndexes,
    ...caseStudyIndexes,
    ...productUpdateIndexes,
    ...blogIndexes,
  ];
}

// In prod this is usually paid during build via prerendered `/api/search`.
// In local dev, the first hit can still be slow because Vite computes it on demand.
const searchAPIPromise = buildSearchAPI();

async function buildSearchAPI() {
  return createSearchAPI("advanced", {
    indexes: await buildIndexes(),
    language: "english",
  });
}

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async () => {
        const server = await searchAPIPromise;
        return server.staticGET();
      },
    },
  },
});
