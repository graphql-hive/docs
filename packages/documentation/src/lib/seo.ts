import defaultOgImage from "../routes/opengraph-image.png";
import { withBasePath } from "./with-base-path";

type MetaTag = {
  charSet?: string;
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

/**
 * Matches Parameters<UpdatableRouteOptions['head']>[0], but there's a ton of generics there,
 * so a more readable error will be surfaced if we write it explicitly.
 */
type SeoHeadContext = {
  match: {
    pathname: string;
  };
  params: Record<string, string | undefined>;
};

export const SITE_NAME = "Hive";
export const SITE_URL = "https://the-guild.dev/graphql/hive";
export const SITE_ORIGIN = "https://the-guild.dev";
export const SITE_PATHNAME = (
  typeof BASE_PATH === "string" && BASE_PATH
    ? BASE_PATH
    : new URL(SITE_URL).pathname
).replace(/\/$/, "");
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
  links?: LinkTag[];
  meta?: MetaTag[];
  pathname?: string;
  pathnameOverride?: never;
  scripts?: ScriptTag[];
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

  const normalized = image.startsWith("/assets") ? withBasePath(image) : image;

  if (normalized.startsWith("/")) {
    return `${SITE_ORIGIN}${normalized}`;
  }

  return absoluteUrl(normalized);
}

function titleToBreadcrumbName(title: string, pathname?: string) {
  if (pathname === "/") {
    return SITE_NAME;
  }

  if (title.includes("|")) {
    return title.split("|")[0]?.trim() ?? title;
  }

  if (title !== DEFAULT_TITLE) {
    return title;
  }

  const fallback = pathname?.split("/").findLast(Boolean);
  if (!fallback) {
    return SITE_NAME;
  }

  return fallback
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function buildSeo({
  breadcrumbs,
  description = DEFAULT_DESCRIPTION,
  image,
  links = [],
  meta = [],
  pathname,
  scripts = [],
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
  const resolvedBreadcrumbs =
    pathname == null
      ? []
      : breadcrumbs && breadcrumbs.length > 0
        ? breadcrumbs.at(-1)?.pathname === pathname
          ? breadcrumbs
          : [
              ...breadcrumbs,
              {
                name: titleToBreadcrumbName(title, pathname),
                pathname,
              },
            ]
        : [
            {
              name: titleToBreadcrumbName(title, pathname),
              pathname,
            },
          ];
  const breadcrumbScripts =
    resolvedBreadcrumbs.length > 0
      ? [
          {
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: resolvedBreadcrumbs.map((item, index) => ({
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
    links: [
      ...links,
      ...(canonical ? [{ href: canonical, rel: "canonical" }] : []),
    ],
    meta: [
      ...meta,
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
    scripts: [...scripts, ...breadcrumbScripts],
  };
}

type SeoFactoryOptions = Omit<SeoOptions, "breadcrumbs" | "pathname"> & {
  breadcrumbs?: Breadcrumb[] | null;
  pathname?: string | null;
};

type Options =
  | ((head: SeoHeadContext) => SeoFactoryOptions | null | undefined)
  | SeoFactoryOptions;

export function seo(context: Options) {
  return (head: SeoHeadContext) => {
    const resolved = typeof context === "function" ? context(head) : context;
    if (!resolved) {
      return {};
    }

    const pathname =
      resolved.pathname === undefined
        ? head.match?.pathname
        : (resolved.pathname ?? undefined);

    return buildSeo({
      ...resolved,
      breadcrumbs: resolved.breadcrumbs ?? undefined,
      pathname,
    });
  };
}

export function createTitleWithSection(
  title: string,
  section?: "Hive Gateway" | "Hive Router",
) {
  return section ? `${title} | ${section}` : title;
}
