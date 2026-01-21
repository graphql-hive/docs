import { Link } from '@tanstack/react-router';
import { forwardRef, ReactElement } from 'react';

import { cn } from '../cn';
import { ILink } from '../types/components';

export type AnchorProps = ILink;
export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(function Anchor(
  { children, className, href = '', newWindow, ...props },
  forwardedRef,
): ReactElement {
  const classes = cn('outline-none focus-visible:ring', className);
  const hrefString = typeof href === 'string' ? href : href?.pathname ?? '';

  // Hash links
  if (hrefString.startsWith('#')) {
    return (
      <a className={classes} href={hrefString} ref={forwardedRef} {...props}>
        {children}
      </a>
    );
  }

  // External links
  if (newWindow || /^https?:\/\//.test(hrefString)) {
    return (
      <a
        className={classes}
        href={hrefString}
        ref={forwardedRef}
        rel="noreferrer"
        target="_blank"
        {...props}
      >
        {children}
      </a>
    );
  }

  // Internal links - use TanStack Router Link
  // Filter out props that TanStack Router Link doesn't accept
  const { rel, target, ...linkProps } = props;
  return (
    <Link className={classes} ref={forwardedRef} to={hrefString} {...linkProps}>
      {children}
    </Link>
  );
});
