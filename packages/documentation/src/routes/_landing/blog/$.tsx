import type { Root } from "fumadocs-core/page-tree";

import { GetYourAPIGameRightSection } from "@hive/design-system";
import { createFileRoute, notFound } from "@tanstack/react-router";
import browserCollections from "fumadocs-mdx:collections/browser";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsBody, DocsPage } from "fumadocs-ui/layouts/docs/page";

import { BlogPostHeader } from "../../../components/blog/blog-post-header";
import { SimilarPosts } from "../../../components/blog/similar-posts";
import { LandingPageContainer } from "../../../components/landing-page-container";
import {
  getBlogDetailBySlug,
  landingPosts,
} from "../../../lib/landing-content";
import { mdxComponents } from "../../../lib/mdx-components";
import "../../../styles/hive-prose.css";

interface BlogLoaderData {
  allPosts: import("../../../components/blog/blog-card").BlogPost[];
  authors: string[];
  date: string;
  description: string;
  image?: string;
  mobileImage?: string;
  ogImage?: string;
  path: string;
  tags: string[];
  title: string;
}

export const Route = createFileRoute("/_landing/blog/$")({
  component: BlogPostDetail,
  head: ({ loaderData: d }: { loaderData?: BlogLoaderData }) => {
    if (!d) return {};
    return {
      meta: [
        { title: d.title },
        { content: d.description, name: "description" },
        { content: d.title, property: "og:title" },
        { content: d.description, property: "og:description" },
        ...(d.ogImage ? [{ content: d.ogImage, property: "og:image" }] : []),
      ],
    };
  },
  loader: async ({ params }): Promise<BlogLoaderData> => {
    const slug = params._splat ?? "";
    const data = await getBlogDetailBySlug(slug);
    if (!data) throw notFound();
    await clientLoader.preload(data.path);
    return {
      ...data,
      allPosts: landingPosts,
    };
  },
});

const emptyTree: Root = { children: [], name: "" };

const clientLoader = browserCollections.blog.createClientLoader({
  component(loaded) {
    const { default: MDX, toc } = loaded;

    return (
      <DocsPage
        breadcrumb={{ enabled: false }}
        footer={{ enabled: false }}
        tableOfContentPopover={{ enabled: false }}
        toc={toc}
      >
        <DocsBody className="hive-prose mx-auto">
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
      <BlogPostHeader
        authors={data.authors}
        className="mx-auto"
        date={data.date}
        image={data.image}
        mobileImage={data.mobileImage}
        tags={data.tags}
        title={data.title}
      />
      <DocsLayout
        nav={{ enabled: false }}
        sidebar={{ enabled: false }}
        tree={emptyTree}
      >
        {clientLoader.useContent(data.path)}
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
