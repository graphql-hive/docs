import { ProductUpdateAuthors } from "@/components/product-update-header";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "fumadocs-mdx:collections/browser";
import { productUpdates } from "fumadocs-mdx:collections/server";
import { DocsBody, DocsPage } from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";

const findEntry = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(({ data: slug }) => {
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

const clientLoader =
  browserCollections.productUpdates.createClientLoader({
    component(loaded) {
      const { default: MDX, toc } = loaded;

      return (
        <DocsPage
          breadcrumb={{ enabled: false }}
          footer={{ enabled: false }}
          tableOfContentPopover={{ enabled: false }}
          toc={toc}
        >
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
    <div className="mx-auto max-w-360 dark:text-neutral-200">
      <h1 className="mt-12 mb-0 text-center text-4xl">{data.title}</h1>
      <ProductUpdateAuthors authors={data.authors} date={data.date} />
      <div
        className="mx-auto grid w-full [--fd-toc-width:268px]"
        style={{
          gridTemplate: `"main toc" 1fr / minmax(0, 1fr) var(--fd-toc-width)`,
        }}
      >
        {clientLoader.useContent(data.path, {})}
      </div>
    </div>
  );
}
