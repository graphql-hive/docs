import { Link as RouterLink } from '@tanstack/react-router';
// Runtime shim for next/link -> @tanstack/react-router Link
import { forwardRef, type ReactNode } from 'react';

export interface LinkProps {
  as?: string;
  children?: ReactNode;
  className?: string;
  href: { pathname?: string; query?: Record<string, string> } | string;
  legacyBehavior?: boolean;
  locale?: false | string;
  passHref?: boolean;
  prefetch?: boolean;
  rel?: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  target?: string;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { children, className, href, prefetch, rel, replace, target, ...props },
  ref
) {
  const hrefString = typeof href === 'string' ? href : href.pathname ?? '/';

  // External links - use regular anchor
  if (hrefString.startsWith('http') || hrefString.startsWith('mailto:')) {
    return (
      <a
        className={className}
        href={hrefString}
        ref={ref}
        rel={rel ?? 'noreferrer'}
        target={target ?? '_blank'}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Hash links - use regular anchor
  if (hrefString.startsWith('#')) {
    return (
      <a className={className} href={hrefString} ref={ref} {...props}>
        {children}
      </a>
    );
  }

  // Internal links - use TanStack Router
  return (
    <RouterLink
      className={className}
      preload={prefetch === false ? undefined : 'intent'}
      ref={ref}
      to={hrefString}
      {...props}
    >
      {children}
    </RouterLink>
  );
});

export default Link;
export { Link };
