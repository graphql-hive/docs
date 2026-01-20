// Runtime shim for next/link -> @tanstack/react-router Link
import { forwardRef, type ReactNode } from 'react';
import { Link as RouterLink } from '@tanstack/react-router';

export interface LinkProps {
  href: string | { pathname?: string; query?: Record<string, string> };
  as?: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
  locale?: string | false;
  legacyBehavior?: boolean;
  children?: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, replace, prefetch, target, rel, className, ...props },
  ref
) {
  const hrefString = typeof href === 'string' ? href : href.pathname ?? '/';

  // External links - use regular anchor
  if (hrefString.startsWith('http') || hrefString.startsWith('mailto:')) {
    return (
      <a
        ref={ref}
        href={hrefString}
        target={target ?? '_blank'}
        rel={rel ?? 'noreferrer'}
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Hash links - use regular anchor
  if (hrefString.startsWith('#')) {
    return (
      <a ref={ref} href={hrefString} className={className} {...props}>
        {children}
      </a>
    );
  }

  // Internal links - use TanStack Router
  return (
    <RouterLink
      ref={ref}
      to={hrefString}
      className={className}
      preload={prefetch === false ? undefined : 'intent'}
      {...props}
    >
      {children}
    </RouterLink>
  );
});

export default Link;
export { Link };
