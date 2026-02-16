import type { StaticImageData } from "@hive/design-system/image";

import { HiveFooter } from "@hive/design-system/hive-footer";
import {
  GraphQLConfCard,
  HiveNavigation,
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
  { children: "Blog", href: "/blog", icon: <PencilIcon /> },
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
  mobileHidden,
}: {
  className?: string;
  mobileHidden?: boolean;
}) {
  return (
    <HiveNavigation
      className={className}
      companyMenuChildren={<GraphQLConfCard image={graphQLConfImage} />}
      developerMenu={developerMenu}
      mobileHidden={mobileHidden}
      productName={PRODUCTS.HIVE.name}
      search={<SearchTrigger />}
    />
  );
}

export function Footer() {
  return <HiveFooter items={footerItems} showSecurityBadges />;
}
