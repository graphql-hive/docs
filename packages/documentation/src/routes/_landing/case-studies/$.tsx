import { getCaseStudyBySlug, getOtherCaseStudies } from "@/lib/landing-content";
import { mdxComponents } from "@/lib/mdx-components";
import { seo } from "@/lib/seo";
import { DecorationIsolation } from "@hive/design-system/decorations";
import { Heading } from "@hive/design-system/heading";
import { createFileRoute, notFound } from "@tanstack/react-router";
import browserCollections from "fumadocs-mdx:collections/browser";

import { CaseStudyCard } from "../../../components/case-studies/case-study-card";
import { getCompanyLogo } from "../../../components/case-studies/company-logos";
import { LookingToUseHiveUpsellBlock } from "../../../components/case-studies/looking-to-use-hive-upsell-block";
import { GetYourAPIGameWhite } from "../../../components/get-your-api-game-white";
import "../../../styles/hive-prose.css";
import { SmallAvatar } from "../../../components/small-avatar";

interface CaseStudyLoaderData {
  authors: { avatar?: string; name: string; position?: string }[];
  category: string;
  date: string;
  excerpt: string;
  otherCaseStudies: {
    frontMatter: { category: string; excerpt: string };
    name: string;
    route: string;
  }[];
  path: string;
  slug: string;
  title: string;
}

export const Route = createFileRoute("/_landing/case-studies/$")({
  component: CaseStudyDetail,
  head: ({
    match,
    params,
  }: {
    match: { pathname: string };
    params: { _splat?: string };
  }) => {
    const slug = params._splat ?? "";
    const entry = getCaseStudyBySlug(slug);
    if (!entry) return {};
    return seo({
      breadcrumbs: [
        { name: "Case Studies", pathname: "/case-studies" },
        {
          name: entry.frontMatter.title ?? slug,
          pathname: match.pathname,
        },
      ],
      description: entry.frontMatter.excerpt ?? "",
      pathname: entry.frontMatter.canonical ?? match.pathname,
      title: entry.frontMatter.title ?? slug,
    });
  },
  loader: async ({ params }): Promise<CaseStudyLoaderData> => {
    const slug = params._splat ?? "";
    const entry = getCaseStudyBySlug(slug);
    if (!entry) throw notFound();
    const data = {
      authors: entry.frontMatter.authors ?? [],
      category: entry.frontMatter.category,
      date: entry.frontMatter.date,
      excerpt: entry.frontMatter.excerpt ?? "",
      otherCaseStudies: getOtherCaseStudies(slug),
      path: entry.path,
      slug,
      title: entry.frontMatter.title ?? slug,
    };
    await clientLoader.preload(data.path);
    return data;
  },
});

const clientLoader = browserCollections.caseStudies.createClientLoader<{
  slug: string;
}>({
  component(loaded, _props) {
    const { default: MDX } = loaded;

    return (
      <div className="prose dark:prose-invert min-w-0 w-(--article-max-width) max-w-full [&>h1:first-child]:hidden">
        <MDX components={mdxComponents} />
      </div>
    );
  },
});

function CaseStudyHeader({
  authors,
  slug,
  title,
}: {
  authors: { avatar?: string; name: string; position?: string }[];
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
    <header className="mx-auto flex max-w-(--content-width) justify-between gap-8 px-6 max-lg:flex-col sm:my-12 md:pl-12 lg:my-24 lg:pr-2">
      <div className="max-w-[640px]">
        <Heading as="h1" className="max-sm:text-[32px]" size="md">
          {title}
        </Heading>
        {authors.length > 0 && (
          <ul className="flex flex-wrap gap-4 text-sm max-lg:my-4 lg:mt-8">
            {authors.map((author) => (
              <li className="flex items-center gap-3" key={author.name}>
                {author.avatar && <SmallAvatar src={author.avatar} />}
                <span className="font-medium">{author.name}</span>
                {author.position && <span>{author.position}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      {logo && (
        <LogoWithDecorations className="h-[224px] w-full max-w-[640px] shrink-0 max-lg:-order-1 max-sm:mb-6 lg:w-[320px] lg:max-xl:h-[180px] lg:max-xl:[&>svg]:w-[140px] lg:max-xl:[&_svg]:h-[120px] xl:w-[400px]">
          {logo}
        </LogoWithDecorations>
      )}
    </header>
  );
}

function LogoWithDecorations({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {children}
      <DecorationIsolation>
        <WideArchDecoration className="absolute right-0 top-0 dark:opacity-10" />
        <WideArchDecoration className="absolute bottom-0 left-0 rotate-180 dark:opacity-10" />
        <WideArchDecorationDefs />
      </DecorationIsolation>
    </div>
  );
}

function WideArchDecoration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="161"
      viewBox="0 0 162 161"
      width="162"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M161.133 160L161.133 160.133L161 160.133L112.877 160.133L112.743 160.133L112.743 160L112.743 85.7294C112.743 65.0319 95.9681 48.2566 75.2706 48.2566L1.00007 48.2566L0.866737 48.2566L0.866737 48.1233L0.866745 -2.79986e-05L0.866745 -0.133361L1.00008 -0.133361L58.6487 -0.133339C65.3279 -0.133338 71.7422 2.5257 76.468 7.25144L112.971 43.7544L117.246 48.029L153.749 84.532C158.474 89.2578 161.133 95.6722 161.133 102.351L161.133 160Z"
        fill="url(#paint0_linear_2522_12246)"
        stroke="url(#paint1_linear_2522_12246)"
        strokeWidth="0.266667"
      />
    </svg>
  );
}

function WideArchDecorationDefs() {
  return (
    <svg
      fill="none"
      height="161"
      viewBox="0 0 162 161"
      width="162"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_2522_12246"
          x1="143.326"
          x2="48.814"
          y1="19.5349"
          y2="126.512"
        >
          <stop stopColor="#F1EEE4" stopOpacity="0" />
          <stop offset="1" stopColor="#F1EEE4" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint1_linear_2522_12246"
          x1="161"
          x2="1"
          y1="0"
          y2="160"
        >
          <stop stopColor="white" stopOpacity="0.1" />
          <stop offset="1" stopColor="white" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MoreStoriesSection({
  className,
  currentSlug,
  otherCaseStudies,
}: {
  className?: string;
  currentSlug: string;
  otherCaseStudies: {
    frontMatter: { category: string; excerpt: string };
    name: string;
    route: string;
  }[];
}) {
  if (otherCaseStudies.length === 0) return null;

  return (
    <section className={`py-6 sm:p-24 ${className ?? ""}`}>
      <Heading as="h2" className="text-center" size="md">
        More stories
      </Heading>
      <ul className="mt-6 flex flex-wrap gap-4 max-sm:flex-col sm:mt-16 sm:gap-6">
        {otherCaseStudies
          .filter((item) => item.name !== currentSlug)
          .slice(0, 3)
          .map((item) => {
            let logo: React.ReactNode = null;
            try {
              logo = getCompanyLogo(item.name);
            } catch {
              // no logo
            }
            return (
              <li className="relative grow basis-[320px]" key={item.name}>
                <CaseStudyCard
                  category={item.frontMatter.category}
                  className="h-full"
                  excerpt={item.frontMatter.excerpt}
                  href={item.route}
                  logo={logo}
                />
              </li>
            );
          })}
      </ul>
    </section>
  );
}

function CaseStudyDetail() {
  const data = Route.useLoaderData();

  return (
    <div className="hive-prose mx-auto w-full box-content max-w-360 [--content-width:1208px]">
      <CaseStudyHeader
        authors={data.authors}
        slug={data.slug}
        title={data.title}
      />
      <div className="mx-auto flex max-w-(--content-width)">
        <div className="ml-0 min-w-0 flex-1 pl-4 max-sm:pr-4 md:pl-12">
          {clientLoader.useContent(data.path, { slug: data.slug })}
        </div>
        <LookingToUseHiveUpsellBlock className="sticky right-2 top-[108px] mb-8 h-min max-lg:hidden lg:w-[320px] xl:w-[400px]" />
      </div>
      <MoreStoriesSection
        className="mx-4 md:mx-6"
        currentSlug={data.slug}
        otherCaseStudies={data.otherCaseStudies}
      />
      <GetYourAPIGameWhite className="sm:my-24" />
    </div>
  );
}
