import type { Root } from "fumadocs-core/page-tree";

import { ProductUpdateAuthors } from "@/components/product-update-header";
import { getProductUpdateBySlug } from "@/lib/landing-content";
import { mdxComponents } from "@/lib/mdx-components";
import { Heading } from "@hive/design-system";
import { createFileRoute, notFound } from "@tanstack/react-router";
import browserCollections from "fumadocs-mdx:collections/browser";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsBody, DocsPage } from "fumadocs-ui/layouts/docs/page";

export const Route = createFileRoute("/_landing/product-updates/$")({
  component: ProductUpdateDetail,
  loader: async ({ params }) => {
    const slug = params._splat ?? "";
    const data = getProductUpdateBySlug(slug);
    if (!data) throw notFound();
    await clientLoader.preload(data.path);
    return data;
  },
});

const emptyTree: Root = { children: [], name: "" };

const clientLoader = browserCollections.productUpdates.createClientLoader<{
  authors: ({ name: string } | string)[];
  date: string;
  title: string;
}>({
  component(loaded, props) {
    const { default: MDX, toc } = loaded;

    return (
      <DocsPage
        breadcrumb={{ enabled: false }}
        footer={{ enabled: false }}
        tableOfContentPopover={{ enabled: false }}
        toc={toc}
      >
        <Heading
          as="h1"
          className="mb-0 text-4xl dark:text-neutral-200"
          size="md"
        >
          {props.title}
        </Heading>
        <ProductUpdateAuthors
          align="start"
          authors={props.authors}
          className="mb-4"
          date={props.date}
        />
        <DocsBody>
          <MDX components={mdxComponents} />
        </DocsBody>
      </DocsPage>
    );
  },
});

function ProductUpdateDetail() {
  const data = Route.useLoaderData();

  return (
    <DocsLayout
      nav={{ enabled: false }}
      sidebar={{ enabled: false }}
      tree={emptyTree}
    >
      {clientLoader.useContent(data.path, {
        authors: data.authors,
        date: data.date,
        title: data.title,
      })}
    </DocsLayout>
  );
}
