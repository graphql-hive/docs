import type { StaticImageData } from "@hive/design-system/image";

import { cn } from "@hive/design-system";
import { HiveFooter } from "@hive/design-system/hive-footer";
import {
  GraphQLConfCard,
  HiveNavigation,
  HiveNavigationMenuIcon,
} from "@hive/design-system/hive-navigation";
import {
  AccountBox,
  GitHubIcon,
  PaperIcon,
  PencilIcon,
  RightCornerIcon,
  TargetIcon,
} from "@hive/design-system/icons";
import { PRODUCTS } from "@hive/design-system/products";
import { SidebarTrigger } from "fumadocs-ui/components/sidebar/base";

import graphQLConfImageSrc from "./graphql-conf-image.webp";
import { SearchTrigger } from "./search-placeholder";

const graphQLConfImage: StaticImageData = {
  height: 200,
  src: graphQLConfImageSrc,
  width: 358,
};

const developerMenu = [
  { children: "Documentation", href: "/docs", icon: <PaperIcon /> },
  {
    children: "Status",
    href: "https://status.graphql-hive.com/",
    icon: <TargetIcon />,
  },
  {
    children: "Product Updates",
    href: "/product-updates",
    icon: <RightCornerIcon />,
  },
  { children: "Case Studies", href: "/case-studies", icon: <AccountBox /> },
  {
    children: "Blog",
    href: "https://the-guild.dev/graphql/hive/blog",
    icon: <PencilIcon />,
  },
  {
    children: "GitHub",
    href: "https://github.com/graphql-hive/console",
    icon: <GitHubIcon />,
  },
];

const footerItems = {
  resources: [
    {
      children: "Privacy Policy",
      href: "https://the-guild.dev/graphql/hive/privacy-policy.html",
      title: "Privacy Policy",
    },
    {
      children: "Terms of Use",
      href: "https://the-guild.dev/graphql/hive/terms-of-use.pdf",
      title: "Terms of Use",
    },
    { children: "Partners", href: "/partners", title: "Partners" },
  ],
};

export function Navigation({
  className,
  noBorder,
}: {
  className?: string;
  noBorder?: boolean;
}) {
  return (
    <HiveNavigation
      className={className}
      companyMenuChildren={<GraphQLConfCard image={graphQLConfImage} />}
      developerMenu={developerMenu}
      noBorder={noBorder}
      productName={PRODUCTS.HIVE.name}
      search={<SearchTrigger />}
      sidebarTrigger={
        <SidebarTrigger
          className="-m-1 rounded-lg bg-transparent p-1 text-green-1000 focus-visible:outline-hidden focus-visible:ring-3 active:bg-beige-200 md:hidden dark:text-neutral-200 dark:active:bg-neutral-800"
          type="button"
        >
          <HiveNavigationMenuIcon
            className={cn(
              "size-6 stroke-current [&_path]:[stroke-linecap:square]",
            )}
          />
        </SidebarTrigger>
      }
    />
  );
}

export function Footer({ className }: { className?: string }) {
  return (
    <HiveFooter className={className} items={footerItems} showSecurityBadges />
  );
}
