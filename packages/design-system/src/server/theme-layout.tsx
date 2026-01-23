import { Metadata } from "next";
import { PageMapItem } from "nextra";
import { Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { ComponentProps, FC, ReactElement, ReactNode } from "react";

import { Anchor } from "../components";
import { HiveFooter } from "../components/hive-footer";
import { HiveNavigation } from "../components/hive-navigation";
import { siteOrigin } from "../constants";
import { PRODUCTS } from "../products";
import { Body } from "./body.client";

type LP = ComponentProps<typeof Layout>;

type LayoutProps = Omit<
  LP,
  "children" | "docsRepositoryBase" | "footer" | "navbar" | "pageMap"
> &
  Partial<Pick<LP, "footer" | "navbar" | "pageMap">> &
  Required<Pick<LP, "docsRepositoryBase">>;

type NP = ComponentProps<typeof HiveNavigation>;

type NavbarProps = Omit<NP, "productName"> & Partial<Pick<NP, "productName">>;

const companyItem = {
  items: {
    about: { href: `${siteOrigin}/about-us`, title: "About" },
    blog: { href: `${siteOrigin}/blog`, title: "Blog" },
    contact: { href: `${siteOrigin}/#get-in-touch`, title: "Contact" },
  },
  title: "Company",
  type: "menu",
};

const productsItems = {
  items: Object.fromEntries(
    Object.values(PRODUCTS).map((product) => [
      product.name,
      {
        href: product.href,
        title: (
          <span
            className="inline-flex items-center gap-2"
            title={product.title}
          >
            <product.logo className="size-7 shrink-0" />
            {product.name}
          </span>
        ),
      },
    ]),
  ),
  title: "Products",
  type: "menu",
};

export const GuildLayout: FC<{
  children: ReactNode;
  description: string;
  websiteName: string;
  /**
   * In case you want to pass the html props, like overriding default `class`
   */
  htmlProps?: ComponentProps<"html">;
  /**
   * Nextra's `<Head>` component props
   */
  headProps?: ComponentProps<typeof Head>;
  /**
   * Navbar logo, `null` is used in The Guild Blog
   */
  logo: ComponentProps<typeof Navbar>["logo"] | null;
  /**
   * Nextra's Docs Theme `<Layout>` component props
   */
  layoutProps: LayoutProps;
  /**
   * Nextra's Docs Theme `<Navbar>` component props
   */
  lightOnlyPages: ComponentProps<typeof Body>["lightOnlyPages"];
  navbarProps: NavbarProps;
  pageMap?: PageMapItem[];
  search?: ReactElement;
}> = async ({
  children,
  description,
  headProps,
  htmlProps,
  layoutProps,
  lightOnlyPages,
  logo,
  navbarProps,
  search,
  websiteName,
  ...props
}) => {
  const [meta, ...pageMap] = props.pageMap || (await getPageMap());

  const pageMapWithCompanyMenu = [
    {
      data: {
        // Add for every website except The Guild Blog
        ...(siteOrigin && { company: companyItem }),
        products: productsItems,
        // @ts-expect-error -- meta.data type is inferred as {} but contains arbitrary keys
        ...meta.data,
      },
    },
    // Add for every website except The Guild Blog
    ...(siteOrigin ? [{ name: "company", route: "#", ...companyItem }] : []),
    { name: "products", route: "#", ...productsItems },
    ...pageMap,
  ];

  return (
    <html
      // Required to be set for `nextra-theme-docs` styles
      dir="ltr"
      lang="en"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
      {...htmlProps}
    >
      <Head
        backgroundColor={{ dark: "#111", light: "#fff" }}
        color={{
          hue: { dark: 67, light: 171 },
          lightness: { dark: 50, light: 24 },
          saturation: { dark: 100, light: 42 },
        }}
        {...headProps}
      >
        <style>{String.raw`
          .dark:has(body.light) ::selection {
            background: hsl(var(--nextra-primary-hue)var(--nextra-primary-saturation)calc(var(--nextra-primary-lightness) + 41%));
          }
          .dark:has(body.light) {
            --nextra-primary-hue: 171deg;
            --nextra-primary-saturation: 42%;
            --nextra-primary-lightness: 24%;
            --nextra-bg: 255, 255, 255;
          }
          .x\:tracking-tight,
          .nextra-steps :is(h2, h3, h4) {
            letter-spacing: normal;
          }
        `}</style>
      </Head>
      <Body lightOnlyPages={lightOnlyPages}>
        <Layout
          editLink="Edit this page on GitHub"
          footer={
            <HiveFooter
              description={description}
              logo={
                <div className="flex items-center gap-3">
                  {logo}
                  <span className="text-2xl/[1.2] font-medium tracking-[-0.16px]">
                    {websiteName}
                  </span>
                </div>
              }
            />
          }
          navbar={
            <HiveNavigation
              className="max-w-[90rem]"
              navLinks={[]}
              productName={websiteName}
              search={search}
              {...navbarProps}
              logo={
                <Anchor
                  className="hive-focus -m-2 flex shrink-0 items-center gap-3 rounded-md p-2"
                  href="/"
                >
                  {logo}
                  <span className="text-2xl font-medium tracking-[-0.16px]">
                    {websiteName}
                  </span>
                </Anchor>
              }
            />
          }
          search={search}
          {...layoutProps}
          feedback={{
            labels: "kind/docs",
            ...layoutProps.feedback,
          }}
          pageMap={pageMapWithCompanyMenu}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            ...layoutProps.sidebar,
          }}
        >
          {children}
        </Layout>
      </Body>
    </html>
  );
};

export function getDefaultMetadata({
  websiteName,
  description = `${websiteName} Documentation`,
  productName,
  ...additionalMetadata
}: Metadata & {
  description?: string;
  productName: string;
  websiteName: string;
}): Metadata {
  return {
    alternates: {
      // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
      canonical: "./",
    },
    appleWebApp: {
      title: websiteName,
    },
    applicationName: websiteName,
    description,
    metadataBase: new URL(process.env["SITE_URL"]!),
    robots: {
      follow: true,
      index: true,
    },
    title: {
      // Use `absolute` title if `metadata.title` was not provided in the page
      absolute: websiteName,
      template: `%s | ${websiteName}`,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@TheGuildDev",
      site: "https://the-guild.dev",
    },
    ...additionalMetadata,
    openGraph: {
      images: `https://og-image.the-guild.dev/?product=${productName}`,
      siteName: websiteName,
      type: "website",
      // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
      locale: "en_US",
      url: "./",
      ...additionalMetadata.openGraph,
    },
  };
}
