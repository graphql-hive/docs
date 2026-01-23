import { cn } from "@hive/design-system/cn";
import { CookiesConsent } from "@hive/design-system/cookies-consent";
import { ReactNode } from "react";

/**
 * Adds styles and cookie consent banner.
 * TODO: Add Base UI Tooltip Provider when migrated
 */
export function LandingPageContainer(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <div className={cn("flex h-full flex-col", props.className)}>
        {props.children}
      </div>
      <CookiesConsent />
    </>
  );
}
