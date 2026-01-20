import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Link as TanStackLink } from '@tanstack/react-router';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
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
}

/**
 * Replacement for next/link - uses TanStack Router for internal links
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, replace, scroll, prefetch, target, rel, ...props },
  ref
) {
  const hrefString = typeof href === 'string' ? href : href.pathname ?? '/';

  // External links or hash links - use regular anchor
  if (hrefString.startsWith('http') || hrefString.startsWith('#') || hrefString.startsWith('mailto:')) {
    const isExternal = hrefString.startsWith('http');
    return (
      <a
        ref={ref}
        href={hrefString}
        target={target ?? (isExternal ? '_blank' : undefined)}
        rel={rel ?? (isExternal ? 'noreferrer' : undefined)}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Internal links - use TanStack Router
  return (
    <TanStackLink
      ref={ref}
      to={hrefString}
      replace={replace}
      preload={prefetch ? 'intent' : undefined}
      {...props}
    >
      {children}
    </TanStackLink>
  );
});

export default Link;
export { Link };
