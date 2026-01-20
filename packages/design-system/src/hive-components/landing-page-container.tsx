import { ReactNode } from 'react';
import { cn } from '../guild-components/cn';
import { CookiesConsent } from '../guild-components/components/cookies-consent';

/**
 * Adds styles and cookie consent banner.
 * TODO: Add Base UI Tooltip Provider when migrated
 */
export function LandingPageContainer(props: { children: ReactNode; className?: string }) {
  return (
    <>
      <div className={cn('flex h-full flex-col', props.className)}>{props.children}</div>
      <CookiesConsent />
    </>
  );
}
