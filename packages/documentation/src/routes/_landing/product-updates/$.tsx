import type { Root } from "fumadocs-core/page-tree";

import { ProductUpdateAuthors } from "@/components/product-update-header";
import { Heading } from "@hive/design-system";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "fumadocs-mdx:collections/browser";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsBody, DocsPage } from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";

const findEntry = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const { productUpdates } = await import("fumadocs-mdx:collections/server");
    const entry = productUpdates.find(
      (e) => e.info.path.replace(/\.mdx?$/, "") === slug,
    );
    if (!entry) return null;

    return {
      authors: entry.authors,
      date: entry.date,
      description: entry.description ?? "",
      path: entry.info.path,
      title: entry.title ?? slug,
    };
  });

export const Route = createFileRoute("/_landing/product-updates/$")({
  component: ProductUpdateDetail,
  loader: async ({ params }) => {
    const slug = params._splat ?? "";
    const data = await findEntry({ data: slug });
    if (!data) throw notFound();
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
          authors={props.authors}
          className="mb-4"
          date={props.date}
        />
        <DocsBody>
          <MDX components={defaultMdxComponents} />
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
