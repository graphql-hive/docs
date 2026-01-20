import { forwardRef, ReactElement } from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '../cn';
import { ILink } from '../types/components';

export type AnchorProps = ILink;
export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(function Anchor(
  { href = '', children, newWindow, className, ...props },
  forwardedRef,
): ReactElement {
  const classes = cn('outline-none focus-visible:ring', className);
  const hrefString = typeof href === 'string' ? href : href?.pathname ?? '';

  // Hash links
  if (hrefString.startsWith('#')) {
    return (
      <a ref={forwardedRef} href={hrefString} className={classes} {...props}>
        {children}
      </a>
    );
  }

  // External links
  if (newWindow || /^https?:\/\//.test(hrefString)) {
    return (
      <a
        ref={forwardedRef}
        href={hrefString}
        target="_blank"
        rel="noreferrer"
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Internal links - use TanStack Router Link
  return (
    <Link ref={forwardedRef} to={hrefString} className={classes} {...props}>
      {children}
    </Link>
  );
});
