import { PRODUCTS_MENU_LIST, ProductType } from '../products';

export function sharedMetaItems(options: { githubUrl: string; product: ProductType }) {
  return {
    blog: {
      href: 'https://the-guild.dev/graphql/hive/blog',
      title: 'Blog',
      type: 'page',
    },
    ecosystem: {
      title: 'Ecosystem',
      type: 'page',
      ...(options.product !== 'HIVE' && { href: 'https://the-guild.dev/graphql/hive/ecosystem' }),
    },
    github: {
      href: options.githubUrl,
      title: 'GitHub',
      type: 'page',
    },
    'graphql-foundation': {
      href: 'https://graphql.org/community/foundation',
      title: 'GraphQL Foundation',
      type: 'page',
    },
    products: {
      items: PRODUCTS_MENU_LIST,
      title: 'Products',
      type: 'menu',
    },
    'the-guild': {
      items: {
        'about-us': {
          href: 'https://the-guild.dev/about-us',
          title: 'About Us',
        },
        blog: {
          href: 'https://the-guild.dev/blog',
          title: 'The Guild Blog',
        },
        'brand-assets': {
          href: 'https://the-guild.dev/logos',
          title: 'Brand Assets',
        },
      },
      title: 'The Guild',
      type: 'menu',
    },
  };
}
