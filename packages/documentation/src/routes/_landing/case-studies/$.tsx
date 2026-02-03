import { Heading } from "@hive/design-system/heading";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "fumadocs-mdx:collections/browser";
import { caseStudies } from "fumadocs-mdx:collections/server";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { getCompanyLogo } from "../../../components/case-studies/company-logos";
import { LookingToUseHiveUpsellBlock } from "../../../components/case-studies/looking-to-use-hive-upsell-block";

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
      category: entry.category,
      date: entry.date,
      excerpt: entry.excerpt ?? "",
      path: entry.info.path,
      slug,
      title: entry.title ?? slug,
    };
  });

export const Route = createFileRoute("/_landing/case-studies/$")({
  component: CaseStudyDetail,
  loader: async ({ params }) => {
    const slug = params._splat ?? "";
    const data = await serverLoader({ data: slug });
    return data;
  },
});

const clientLoader = browserCollections.caseStudies.createClientLoader<{
  slug: string;
}>({
  component(loaded, props) {
    const { default: MDX } = loaded;

    return (
      <div className="prose dark:prose-invert mx-auto min-w-0 max-w-[640px] flex-1 *:first:hidden">
        <MDX components={defaultMdxComponents} />
      </div>
    );
  },
});

function CaseStudyHeader({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  let logo: React.ReactNode = null;
  try {
    logo = getCompanyLogo(slug);
  } catch {
    // no logo for this company
  }

  return (
    <header className="mx-auto flex max-w-[--content-width] justify-between gap-8 pl-6 max-lg:flex-col sm:my-12 md:pl-12 lg:my-24">
      <div className="max-w-[640px]">
        <Heading as="h1" className="max-sm:text-[32px]" size="md">
          {title}
        </Heading>
      </div>
      {logo && (
        <div className="flex h-[224px] w-full max-w-[640px] shrink-0 items-center justify-center max-lg:-order-1 max-sm:mb-6 lg:w-[320px] xl:w-[400px]">
          {logo}
        </div>
      )}
    </header>
  );
}

function CaseStudyDetail() {
  const data = Route.useLoaderData();

  return (
    <div
      className="mx-auto box-content max-w-360 dark:text-white [--content-width:1208px]"
    >
      <CaseStudyHeader slug={data.slug} title={data.title} />
      <div className="mx-auto flex max-w-[--content-width]">
        <div className="ml-0 pl-6 max-sm:pr-6 md:pl-12">
          {clientLoader.useContent(data.path, { slug: data.slug })}
        </div>
        <LookingToUseHiveUpsellBlock className="sticky right-2 top-[108px] mb-8 h-min max-lg:hidden lg:w-[320px] xl:w-[400px]" />
      </div>
    </div>
  );
}
