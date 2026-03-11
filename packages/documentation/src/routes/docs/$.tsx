import type { TableOfContents } from "fumadocs-core/toc";

import { DocsTableOfContent } from "@/components/docs-toc";
import { Footer, Navigation } from "@/components/navigation";
import { EditOnGitHub } from "@/components/page-actions";
import { baseOptions } from "@/lib/layout.shared";
import { mdxComponents } from "@/lib/mdx-components";
import { getSource } from "@/lib/source";
import { withBasePath } from "@/lib/with-base-path";
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
      lastModified: page.data.lastModified,
      pageTree: await source.serializePageTree(source.getPageTree()),
      path: page.path,
      url: page.url,
    };
  });

const clientLoader = browserCollections.docs.createClientLoader<DocsPageProps>({
  component(loaded, props) {
    const { default: MDX, toc: mdxToc } = loaded;
    const { extraToc } = loaded as { extraToc?: TableOfContents };
    const toc: TableOfContents = extraToc ? [...mdxToc, ...extraToc] : mdxToc;

    const frontmatter = loaded.frontmatter as {
      description?: string;
      title: string;
    };

    return (
      <DocsPage
        breadcrumb={{
          includeRoot: true,
        }}
        tableOfContent={{
          component: (
            <DocsTableOfContent
              githubUrl={props.githubUrl}
              markdownUrl={props.markdownUrl}
              toc={toc}
            />
          ),
        }}
        toc={toc}
        {...props}
      >
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody className="relative">
          <MDX
            components={{
              ...mdxComponents,
              ...Twoslash,
            }}
          />
          <AboveFooter>
            {props.lastModified ? (
              <PageLastUpdate date={new Date(props.lastModified)} />
            ) : null}
            <EditOnGitHub githubUrl={props.githubUrl} />
          </AboveFooter>
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
          githubUrl: `https://github.com/graphql-hive/docs/blob/main/packages/documentation/content/docs/${data.path}`,
          lastModified: data.lastModified?.getTime() ?? 0,
          markdownUrl: withBasePath(`${data.url}.mdx`),
        })}
      </DocsLayout>
      <Footer className="border-t border-fd-border" />
    </div>
  );
}

interface DocsPageProps {
  className?: string;
  githubUrl: string;
  lastModified: number;
  markdownUrl: string;
}

// workaround for the fact that we can't use flex-1 in .prose docs body
function AboveFooter({ children }: { children: React.ReactNode }) {
  return (
    // mt-16 reserves space
    <div className="mt-16">
      {/* absolute bottom-0 hugs footer */}
      <div className="flex justify-between absolute bottom-0 inset-x-0">
        {children}
      </div>
    </div>
  );
}
