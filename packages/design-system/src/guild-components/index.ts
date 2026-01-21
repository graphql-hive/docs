export { cn } from './cn';
export * from './components';
export * from './logos';
export * from './next-types';
export { PRODUCTS } from './products';
export * from './types/components';

/**
 * @deprecated Consider using `ComparisonTable` instead.
 * This name was kept for back-compat, because the public
 * API differs,
 */

declare module 'react' {
  interface CSSProperties extends Record<`--${string}`, number | string | undefined> {}
}
