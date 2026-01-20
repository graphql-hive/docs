import { PageActions } from "@/components/page-actions";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { isMarkdownPreferred } from "fumadocs-core/negotiation";
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
    const slugs = params._splat?.split("/") ?? [];
    const data = await serverLoader({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const rawSplat = params._splat ?? "";
        const isMdxRequest = rawSplat.endsWith(".mdx");
        const slugs = (isMdxRequest ? rawSplat.slice(0, -4) : rawSplat)
          .split("/")
          .filter(Boolean);

        if (!isMdxRequest && !isMarkdownPreferred(request)) return;

        const page = source.getPage(slugs);
        if (!page) {
          return new Response("Not found", {
            headers: { "Content-Type": "text/plain" },
            status: 404,
          });
        }

        const { getText } = page.data as {
          getText?: (mode: string) => Promise<string>;
        };
        if (!getText) {
          return new Response("getText not available", { status: 500 });
        }

        const content = await getText("raw");
        return new Response(content, {
          headers: {
            "Content-Length": String(new TextEncoder().encode(content).length),
            "Content-Type": "text/markdown",
          },
        });
      },
    },
  },
});

const serverLoader = createServerFn({
  method: "GET",
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
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
    <DocsLayout {...baseOptions()} tree={data.pageTree}>
      {clientLoader.useContent(data.path, {
        className: "",
        githubUrl: `https://github.com/graphql-hive/docs/blob/main/packages/documentation/content/docs/${data.path}`,
        markdownUrl: `${data.url}.mdx`,
      })}
    </DocsLayout>
  );
}
