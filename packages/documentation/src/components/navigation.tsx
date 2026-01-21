import { GraphQLConfCard, HiveNavigation } from '@hive/design-system/hive-navigation';
import { HiveFooter } from '@hive/design-system/hive-footer';
import {
  AccountBox,
  GitHubIcon,
  PaperIcon,
  PencilIcon,
  RightCornerIcon,
  TargetIcon,
} from '@hive/design-system/icons';
import { PRODUCTS } from '@hive/design-system/products';
import type { StaticImageData } from '@hive/design-system/image';
import graphQLConfImageSrc from './graphql-conf-image.webp';
import { SearchTrigger } from './search-placeholder';

const graphQLConfImage: StaticImageData = {
  src: graphQLConfImageSrc,
  width: 358,
  height: 200,
};

const developerMenu = [
  { href: '/docs', icon: <PaperIcon />, children: 'Documentation' },
  { href: 'https://status.graphql-hive.com/', icon: <TargetIcon />, children: 'Status' },
  { href: '/product-updates', icon: <RightCornerIcon />, children: 'Product Updates' },
  { href: '/case-studies', icon: <AccountBox />, children: 'Case Studies' },
  { href: '/blog', icon: <PencilIcon />, children: 'Blog' },
  { href: 'https://github.com/graphql-hive/console', icon: <GitHubIcon />, children: 'GitHub' },
];

const footerItems = {
  resources: [
    {
      children: 'Privacy Policy',
      href: 'https://the-guild.dev/graphql/hive/privacy-policy.html',
      title: 'Privacy Policy',
    },
    {
      children: 'Terms of Use',
      href: 'https://the-guild.dev/graphql/hive/terms-of-use.pdf',
      title: 'Terms of Use',
    },
    { children: 'Partners', href: '/partners', title: 'Partners' },
  ],
};

export function Navigation() {
  return (
    <HiveNavigation
      companyMenuChildren={<GraphQLConfCard image={graphQLConfImage} />}
      productName={PRODUCTS.HIVE.name}
      search={<SearchTrigger />}
      developerMenu={developerMenu}
    />
  );
}

export function Footer() {
  return <HiveFooter showSecurityBadges items={footerItems} />;
}
