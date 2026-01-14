import { createFileRoute, notFound } from "@tanstack/react-router";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { createServerFn } from "@tanstack/react-start";
import { source } from "@/lib/source";
import browserCollections from "fumadocs-mdx:collections/browser";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import * as Twoslash from "fumadocs-twoslash/ui";
import { baseOptions } from "@/lib/layout.shared";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { isMarkdownPreferred } from "fumadocs-core/negotiation";

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
      GET: async ({ request, params }) => {
        if (!isMarkdownPreferred(request)) return;

        const slugs = params._splat?.split("/") ?? [];
        const page = source.getPage(slugs);
        if (!page) {
          return new Response("Not found", {
            status: 404,
            headers: { "Content-Type": "text/plain" },
          });
        }

        const getText = (
          page.data as { getText?: (mode: string) => Promise<string> }
        ).getText;
        if (!getText) {
          return new Response("getText not available", { status: 500 });
        }

        const content = await getText("raw");
        return new Response(content, {
          headers: {
            "Content-Type": "text/markdown",
            "Content-Length": String(new TextEncoder().encode(content).length),
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
      path: page.path,
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    // you can define props for the component
    props: {
      className?: string;
    },
  ) {
    return (
      <DocsPage toc={toc} {...props}>
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
      })}
    </DocsLayout>
  );
}
