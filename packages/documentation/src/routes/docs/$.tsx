import { Footer, Navigation } from "@/components/navigation";
import { PageActions } from "@/components/page-actions";
import { baseOptions } from "@/lib/layout.shared";
import { getSource } from "@/lib/source";
import { MDXLink } from "@hive/design-system/server/mdx-components/mdx-link";
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
} from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";

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
              ...defaultMdxComponents,
              ...Twoslash,
              a: MDXLink,
            }}
          />
        </DocsBody>
      </DocsPage>
    );
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());

  return (
    <div className="min-h-screen" data-docs>
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
