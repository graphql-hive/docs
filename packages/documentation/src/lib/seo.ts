import defaultOgImage from "../routes/opengraph-image.png";

type MetaTag = {
  content?: string;
  name?: string;
  property?: string;
  title?: string;
};

type LinkTag = {
  href: string;
  rel: string;
};

type ScriptTag = {
  children: string;
  type: "application/ld+json";
};

type Breadcrumb = {
  name: string;
  pathname: string;
};

export const SITE_NAME = "Hive";
export const SITE_URL = "https://the-guild.dev/graphql/hive";
export const SITE_ORIGIN = "https://the-guild.dev";
export const SITE_PATHNAME = new URL(SITE_URL).pathname.replace(/\/$/, "");
export const DEFAULT_TITLE = "Open-Source GraphQL Federation Platform";
export const DEFAULT_DESCRIPTION =
  "Fully Open-source schema registry, analytics and gateway for GraphQL federation and other GraphQL APIs";
export const DEFAULT_OG_IMAGE = defaultOgImage;
export const DEFAULT_OG_TYPE = "website";
export const DEFAULT_LOCALE = "en_US";
export const DEFAULT_TWITTER_CARD = "summary_large_image";
export const DEFAULT_TWITTER_SITE = SITE_ORIGIN;
export const DEFAULT_TWITTER_CREATOR = "@TheGuildDev";

type SeoOptions = {
  breadcrumbs?: Breadcrumb[];
  description?: string;
  image?: string;
  pathname?: string;
  title?: string;
  type?: string;
};

export function absoluteUrl(pathname = "/") {
  if (/^https?:\/\//.test(pathname)) {
    return pathname;
  }

  const normalized = pathname === "/" ? "" : pathname.replace(/^\/+/, "");
  return normalized ? `${SITE_URL}/${normalized}` : SITE_URL;
}

function absoluteImage(image?: string) {
  image ??= DEFAULT_OG_IMAGE;

  if (/^https?:\/\//.test(image)) {
    return image;
  }

  const basePath = typeof BASE_PATH === "string" ? BASE_PATH : "";
  const normalized =
    basePath && image.startsWith(basePath)
      ? `${SITE_PATHNAME}${image.slice(basePath.length)}`
      : image;

  if (normalized.startsWith(SITE_PATHNAME)) {
    return `${SITE_ORIGIN}${normalized}`;
  }

  return absoluteUrl(normalized);
}

export function seo({
  breadcrumbs,
  description = DEFAULT_DESCRIPTION,
  image,
  pathname,
  title = DEFAULT_TITLE,
  type = DEFAULT_OG_TYPE,
}: SeoOptions = {}): {
  links: LinkTag[];
  meta: MetaTag[];
  scripts: ScriptTag[];
} {
  const canonical = pathname ? absoluteUrl(pathname) : undefined;
  const ogImage = absoluteImage(image);
  const resolvedTitle =
    title === DEFAULT_TITLE || title.includes("|")
      ? title
      : `${title} | ${SITE_NAME}`;
  const breadcrumbScripts =
    breadcrumbs && breadcrumbs.length > 0
      ? [
          {
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: breadcrumbs.map((item, index) => ({
                "@type": "ListItem",
                item: absoluteUrl(item.pathname),
                name: item.name,
                position: index + 1,
              })),
            }),
            type: "application/ld+json" as const,
          },
        ]
      : [];

  return {
    links: canonical ? [{ href: canonical, rel: "canonical" }] : [],
    meta: [
      { title: resolvedTitle },
      { content: description, name: "description" },
      { content: resolvedTitle, property: "og:title" },
      { content: description, property: "og:description" },
      { content: SITE_NAME, property: "og:site_name" },
      { content: DEFAULT_LOCALE, property: "og:locale" },
      { content: ogImage, property: "og:image" },
      { content: type, property: "og:type" },
      { content: DEFAULT_TWITTER_CARD, name: "twitter:card" },
      { content: DEFAULT_TWITTER_SITE, name: "twitter:site" },
      { content: DEFAULT_TWITTER_CREATOR, name: "twitter:creator" },
      { content: resolvedTitle, name: "twitter:title" },
      { content: description, name: "twitter:description" },
      { content: ogImage, name: "twitter:image" },
      ...(canonical ? [{ content: canonical, property: "og:url" }] : []),
    ],
    scripts: breadcrumbScripts,
  };
}

export function createTitleWithSection(
  title: string,
  section?: "Hive Gateway" | "Hive Router",
) {
  return section ? `${title} | ${section}` : title;
}
