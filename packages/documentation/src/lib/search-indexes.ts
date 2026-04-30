import type { StructuredData } from "fumadocs-core/mdx-plugins/remark-structure";
import type { AdvancedIndex } from "fumadocs-core/search/server";

import { CHANGELOG_PAGE_URL } from "@/lib/deployment-changelog";
import { pathToSlug } from "@/lib/path-to-slug";
import { getSource } from "@/lib/source";
import { structure } from "fumadocs-core/mdx-plugins/remark-structure";
import { findPath } from "fumadocs-core/page-tree";

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

type DataWithStructuredData = {
  structuredData: StructuredData;
};

type DataWithLoader = {
  load(): Promise<DataWithStructuredData>;
};

async function resolveStructuredData(data: unknown): Promise<StructuredData> {
  if (
    typeof data === "object" &&
    data !== null &&
    "structuredData" in data &&
    "load" in data === false
  ) {
    return (data as DataWithStructuredData).structuredData;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "load" in data &&
    typeof (data as DataWithLoader).load === "function"
  ) {
    const loaded = await (data as DataWithLoader).load();
    return loaded.structuredData;
  }

  throw new Error("Cannot resolve structuredData from page");
}

async function getChangelogStructuredData(): Promise<StructuredData> {
  try {
    const snapshotModule =
      (await import("virtual:deployment-changelog-snapshot")) as {
        deploymentChangelogSnapshot?: string;
      };

    if (!snapshotModule.deploymentChangelogSnapshot) {
      return { contents: [], headings: [] };
    }

    return structure(snapshotModule.deploymentChangelogSnapshot);
  } catch {
    return { contents: [], headings: [] };
  }
}

export async function buildIndexes(): Promise<AdvancedIndex[]> {
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
