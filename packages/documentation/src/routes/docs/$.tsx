import { Footer, Navigation } from "@/components/navigation";
import { PageActions } from "@/components/page-actions";
import { baseOptions } from "@/lib/layout.shared";
import { mdxComponents } from "@/lib/mdx-components";
import { getSource } from "@/lib/source";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import browserCollections from "fumadocs-mdx:collections/browser";
import * as Twoslash from "fumadocs-twoslash/ui";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
} from "fumadocs-ui/layouts/docs/page";

// page.data.lastModified;
const lastModifiedTime: Date | undefined = undefined;

export const Route = createFileRoute("/docs/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/").filter(Boolean) ?? [];
    const data = await serverLoader({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
});

const serverLoader = createServerFn({
  method: "GET",
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const source = await getSource();
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    return {
      pageTree: await source.serializePageTree(source.getPageTree()),
      path: page.path,
      url: page.url,
      // @ts-expect-error - the type should codegen in a sec
      lastModified: page.data.lastModified,
    };
  });

const clientLoader = browserCollections.docs.createClientLoader<{
  className?: string;
  githubUrl: string;
  markdownUrl: string;
}>({
  component(loaded, props) {
    const { default: MDX, toc } = loaded;

    const frontmatter = loaded.frontmatter as {
      description?: string;
      title: string;
    };

    return (
      <DocsPage
        tableOfContent={{
          // toc handler should become the full component here
          footer: (
            <PageActions
              githubUrl={props.githubUrl}
              markdownUrl={props.markdownUrl}
            />
          ),
        }}
        toc={toc}
        {...props}
      >
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <MDX
            components={{
              ...mdxComponents,
              ...Twoslash,
            }}
          />
          {/* todo: test these two */}
          {/* <a
    href={`${githubUrl}/blob/main/content/docs/${page.path}`}
    rel="noreferrer noopener"
    target="_blank"
    className="w-fit border rounded-xl p-2 font-medium text-sm text-fd-secondary-foreground bg-fd-secondary transition-colors hover:text-fd-accent-foreground hover:bg-fd-accent"
  >
    Edit on GitHub
  </a> */}
          {lastModifiedTime && <PageLastUpdate date={lastModifiedTime} />}
        </DocsBody>
      </DocsPage>
    );
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());

  return (
    <div
      className="min-h-screen bg-beige-100 dark:bg-[rgb(var(--nextra-bg))]"
      data-docs
    >
      <DocsLayout
        {...baseOptions(data.pageTree)}
        nav={{
          component: (
            <Navigation
              className="w-full bg-beige-100 dark:bg-[rgb(var(--nextra-bg))]"
              noBorder
            />
          ),
        }}
        searchToggle={{ enabled: false }}
      >
        {clientLoader.useContent(data.path, {
          className: "",
          githubUrl: `https://github.com/graphql-hive/docs/blob/main/packages/documentation/content/docs/${data.path}`,
          markdownUrl: `${data.url}.mdx`,
        })}
      </DocsLayout>
      <Footer className="border-t border-fd-border" />
    </div>
  );
}
