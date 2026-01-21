'use client';

import { createFileRoute, Outlet } from '@tanstack/react-router';
import { HiveNavigation, GraphQLConfCard } from '@hive/design-system/guild-components/components/hive-navigation';
import { HiveFooter } from '@hive/design-system/guild-components/components/hive-footer';
import {
  AccountBox,
  GitHubIcon,
  PaperIcon,
  PencilIcon,
  RightCornerIcon,
  TargetIcon,
} from '@hive/design-system/guild-components/components/icons';
import { PRODUCTS } from '@hive/design-system/guild-components/products';
import type { StaticImageData } from '@hive/design-system/guild-components/components/image';
import graphQLConfImageSrc from '../components/graphql-conf-image.webp';
import { SearchTrigger } from '../components/search-placeholder';

// Convert Vite string import to StaticImageData format
const graphQLConfImage: StaticImageData = {
  src: graphQLConfImageSrc,
  width: 358,
  height: 200,
};

export const Route = createFileRoute('/_landing')({
  component: LandingLayout,
});

/**
 * Pathless layout for landing pages (/, /pricing, /federation, etc.)
 * Includes HiveNavigation and HiveFooter with beige background
 */
function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col light">
      <HiveNavigation
        companyMenuChildren={<GraphQLConfCard image={graphQLConfImage} />}
        productName={PRODUCTS.HIVE.name}
        search={<SearchTrigger />}
        developerMenu={[
          {
            href: '/docs',
            icon: <PaperIcon />,
            children: 'Documentation',
          },
          {
            href: 'https://status.graphql-hive.com/',
            icon: <TargetIcon />,
            children: 'Status',
          },
          {
            href: '/product-updates',
            icon: <RightCornerIcon />,
            children: 'Product Updates',
          },
          {
            href: '/case-studies',
            icon: <AccountBox />,
            children: 'Case Studies',
          },
          {
            href: '/blog',
            icon: <PencilIcon />,
            children: 'Blog',
          },
          {
            href: 'https://github.com/graphql-hive/console',
            icon: <GitHubIcon />,
            children: 'GitHub',
          },
        ]}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <HiveFooter
        showSecurityBadges
        items={{
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
            {
              children: 'Partners',
              href: '/partners',
              title: 'Partners',
            },
          ],
        }}
      />
    </div>
  );
}
