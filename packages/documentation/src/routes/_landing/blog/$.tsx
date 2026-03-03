import type { Root } from "fumadocs-core/page-tree";

import { GetYourAPIGameRightSection } from "@hive/design-system";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "fumadocs-mdx:collections/browser";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsBody, DocsPage } from "fumadocs-ui/layouts/docs/page";

import { BlogPostHeader } from "../../../components/blog/blog-post-header";
import { getBlogPosts } from "../../../components/blog/get-blog-posts";
import { SimilarPosts } from "../../../components/blog/similar-posts";
import { LandingPageContainer } from "../../../components/landing-page-container";
import { mdxComponents } from "../../../lib/mdx-components";
import "../../../styles/hive-prose.css";

const findEntry = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const collections = await import("fumadocs-mdx:collections/server");
    const entry = collections.blog.find(
      (e) =>
        e.info.path.replace(/\.mdx?$/, "").replace(/\/index$/, "") === slug,
    );
    if (!entry) return null;

    const allPosts = await getBlogPosts();

    return {
      allPosts,
      authors: entry.authors,
      date: entry.date,
      description: entry.description ?? "",
      image: entry.image,
      path: entry.info.path,
      tags: entry.tags,
      title: entry.title ?? slug,
    };
  });

export const Route = createFileRoute("/_landing/blog/$")({
  component: BlogPostDetail,
  loader: async ({ params }) => {
    const slug = params._splat ?? "";
    const data = await findEntry({ data: slug });
    if (!data) throw notFound();
    return data;
  },
});

const emptyTree: Root = { children: [], name: "" };

const clientLoader = browserCollections.blog.createClientLoader<{
  authors: string[];
  date: string;
  tags: string[];
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
        <BlogPostHeader
          authors={props.authors}
          className="mx-auto"
          date={props.date}
          tags={props.tags}
          title={props.title}
        />
        <DocsBody className="hive-prose">
          <MDX components={mdxComponents} />
        </DocsBody>
      </DocsPage>
    );
  },
});

function BlogPostDetail() {
  const data = Route.useLoaderData();

  return (
    <LandingPageContainer className="text-green-1000 mx-auto max-w-360 overflow-hidden dark:text-white">
      <DocsLayout
        nav={{ enabled: false }}
        sidebar={{ enabled: false }}
        tree={emptyTree}
      >
        {clientLoader.useContent(data.path, {
          authors: data.authors,
          date: data.date,
          tags: data.tags,
          title: data.title,
        })}
      </DocsLayout>
      <SimilarPosts
        allPosts={data.allPosts}
        className="mx-4 md:mx-6"
        currentTags={data.tags}
        currentTitle={data.title}
      />
      <GetYourAPIGameRightSection className="light text-green-1000 dark:bg-primary/95 mx-4 sm:mb-6 md:mx-6" />
    </LandingPageContainer>
  );
}
