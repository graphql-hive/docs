import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "fumadocs-mdx:collections/browser";
import { caseStudies } from "fumadocs-mdx:collections/server";
import { DocsBody, DocsPage } from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";

export const Route = createFileRoute("/_landing/case-studies/$")({
  component: CaseStudyDetail,
  loader: async ({ params }) => {
    const slug = params._splat ?? "";
    const data = await serverLoader({ data: slug });
    await clientLoader.preload(data.path);
    return data;
  },
});

const serverLoader = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const entry = caseStudies.find(
      (e) =>
        e.info.path
          .replace(/^\//, "")
          .replace(/\/$/, "")
          .replace(/\.mdx?$/, "") === slug,
    );
    if (!entry) throw notFound();

    return {
      authors: entry.authors,
      category: entry.category,
      date: entry.date,
      excerpt: entry.excerpt ?? "",
      path: entry.info.path,
      slug,
      title: entry.title ?? slug,
    };
  });

const clientLoader = browserCollections.caseStudies.createClientLoader<{
  category: string;
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
        <div className="mx-auto max-w-260">
          <div className="text-beige-800 mb-2 text-sm font-medium dark:text-neutral-400">
            {props.category}
          </div>
          <h1 className="mt-2 text-4xl">{props.title}</h1>
        </div>
        <DocsBody>
          <MDX components={defaultMdxComponents} />
        </DocsBody>
      </DocsPage>
    );
  },
});

function CaseStudyDetail() {
  const data = Route.useLoaderData();

  return (
    <div className="mx-auto w-full max-w-360 dark:text-neutral-200">
      {clientLoader.useContent(data.path, {
        category: data.category,
        title: data.title,
      })}
    </div>
  );
}
