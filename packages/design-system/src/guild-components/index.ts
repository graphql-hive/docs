export { cn } from './cn';
export * from './components';
export * from './logos';
export * from './next-types';
export { PRODUCTS } from './products';
export * from './types/components';
export { Navbar, NotFoundPage, useConfig, useTheme, useThemeConfig } from 'nextra-theme-docs';
export {
  Banner,
  Bleed,
  Callout,
  Cards,
  Code,
  Collapse,
  FileTree,
  Mermaid,
  Search,
  Steps,
  Table,
  Tabs,
} from 'nextra/components';
export { useMounted } from 'nextra/hooks';
export { normalizePages } from 'nextra/normalize-pages';

/**
 * @deprecated Consider using `ComparisonTable` instead.
 * This name was kept for back-compat, because the public
 * API differs,
 */

declare module 'react' {
  type CSSProperties = Record<`--${string}`, number | string | undefined>;
}
