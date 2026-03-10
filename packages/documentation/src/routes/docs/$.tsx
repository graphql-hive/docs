import { DeploymentChangelogMarkdownContext } from "@/components/deployment-changelog";
import { Footer, Navigation } from "@/components/navigation";
import { EditOnGitHub, PageActions } from "@/components/page-actions";
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

    // todo: can't we localize it to the changelog page file itself?
    const deploymentChangelogMarkdown =
      page.url === "/docs/schema-registry/self-hosting/changelog"
        ? await import("@/lib/deployment-changelog").then((module) =>
            module.getDeploymentChangelogMarkdown(),
          )
        : null;

    return {
      deploymentChangelogMarkdown,
      lastModified: page.data.lastModified,
      pageTree: await source.serializePageTree(source.getPageTree()),
      path: page.path,
      url: page.url,
    };
  });

const clientLoader = browserCollections.docs.createClientLoader<DocsPageProps>({
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
          <DeploymentChangelogMarkdownContext.Provider
            value={props.deploymentChangelogMarkdown}
          >
            <MDX
              components={{
                ...mdxComponents,
                ...Twoslash,
              }}
            />
          </DeploymentChangelogMarkdownContext.Provider>
          <div className="flex justify-between">
            {props.lastModified ? (
              <PageLastUpdate date={new Date(props.lastModified)} />
            ) : null}
            <EditOnGitHub githubUrl={props.githubUrl} />
          </div>
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
          deploymentChangelogMarkdown: data.deploymentChangelogMarkdown,
          githubUrl: `https://github.com/graphql-hive/docs/blob/main/packages/documentation/content/docs/${data.path}`,
          lastModified: data.lastModified?.getTime() ?? 0,
          markdownUrl: `${data.url}.mdx`,
        })}
      </DocsLayout>
      <Footer className="border-t border-fd-border" />
    </div>
  );
}

interface DocsPageProps {
  className?: string;
  deploymentChangelogMarkdown: string | null;
  githubUrl: string;
  lastModified: number;
  markdownUrl: string;
}
