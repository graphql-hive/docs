import { NavigationMenu as BaseNavigationMenu } from "@base-ui-components/react/navigation-menu";
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";

import { Anchor } from "../anchor";
import { cn } from "../cn";
import { ArrowIcon } from "../icons";

const CONTAINER_ID = "h-navmenu-container";

export interface NavigationMenuProps extends ComponentPropsWithoutRef<"nav"> {
  delayDuration?: number;
  forceMount?: true;
}

export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(
  (
    { children, className, delayDuration, forceMount: _forceMount, ...rest },
    ref,
  ) => {
    return (
      <BaseNavigationMenu.Root
        aria-label="Navigation Menu"
        className={cn("relative z-10 flex flex-1 items-center", className)}
        delay={delayDuration}
        id={CONTAINER_ID}
        ref={ref}
        {...rest}
      >
        {children}
        <BaseNavigationMenu.Portal keepMounted>
          <BaseNavigationMenu.Positioner
            className={cn(
              "box-border",
              "h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)",
              "transition-[top,left,right,bottom] duration-(--duration) ease-(--easing)",
              "data-instant:transition-none",
              // Safe area for pointer to move to popup
              "before:absolute before:content-['']",
              "data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5",
            )}
            sideOffset={6}
            style={
              {
                "--duration": "0.35s",
                "--easing": "cubic-bezier(0.22, 1, 0.36, 1)",
              } as React.CSSProperties
            }
          >
            <BaseNavigationMenu.Popup
              className={cn(
                "relative origin-(--transform-origin)",
                "h-(--popup-height) w-(--popup-width)",
                "rounded-xl border border-beige-200 bg-white shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.10)]",
                "dark:border-neutral-800 dark:bg-neutral-900",
                "transition-[opacity,transform,width,height] duration-(--duration) ease-(--easing)",
                "data-starting-style:scale-95 data-starting-style:opacity-0",
                "data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-150",
              )}
            >
              <BaseNavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
            </BaseNavigationMenu.Popup>
          </BaseNavigationMenu.Positioner>
        </BaseNavigationMenu.Portal>
        <RemoveMotionIfPreferred />
      </BaseNavigationMenu.Root>
    );
  },
);
NavigationMenu.displayName = "NavigationMenu";

interface NavigationMenuListProps {
  children?: ReactNode;
  className?: string;
}

export const NavigationMenuList = forwardRef<
  HTMLDivElement,
  NavigationMenuListProps
>(({ children, className }, ref) => (
  <BaseNavigationMenu.List
    className={cn(
      "group flex flex-1 list-none items-center rounded-lg border-beige-200 px-1.5 lg:border lg:px-3 dark:border-neutral-700",
      className,
    )}
    ref={ref}
  >
    {children}
  </BaseNavigationMenu.List>
));
NavigationMenuList.displayName = "NavigationMenuList";

interface NavigationMenuItemProps {
  children?: ReactNode;
  className?: string;
  value?: string;
}

export const NavigationMenuItem = forwardRef<
  HTMLDivElement,
  NavigationMenuItemProps
>(({ children, className, value }, ref) => {
  return (
    <BaseNavigationMenu.Item
      className={cn("relative", className)}
      ref={ref}
      value={value}
    >
      {children}
    </BaseNavigationMenu.Item>
  );
});
NavigationMenuItem.displayName = "NavigationMenuItem";

export const NavigationMenuTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(({ children, className, disabled, ...rest }, ref) => (
  <BaseNavigationMenu.Trigger
    className={cn(
      "hive-focus cursor-default rounded-sm p-3 font-medium leading-normal text-green-800 data-popup-open:text-green-1000 dark:text-neutral-300 dark:data-popup-open:text-neutral-100",
      className,
    )}
    disabled={disabled ?? false}
    ref={ref}
    {...rest}
  >
    {children}
  </BaseNavigationMenu.Trigger>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

export const NavigationMenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ children, className, ...rest }, ref) => (
  <BaseNavigationMenu.Content
    className={cn(
      "h-full w-auto bg-white p-6 dark:bg-neutral-900",
      // Sliding animation between menus
      "transition-[opacity,transform] duration-(--duration) ease-(--easing)",
      "data-starting-style:opacity-0 data-ending-style:opacity-0",
      "data-starting-style:data-[activation-direction=left]:-translate-x-12",
      "data-starting-style:data-[activation-direction=right]:translate-x-12",
      "data-ending-style:data-[activation-direction=left]:translate-x-12",
      "data-ending-style:data-[activation-direction=right]:-translate-x-12",
      className,
    )}
    ref={ref}
    {...rest}
  >
    {children}
  </BaseNavigationMenu.Content>
));
NavigationMenuContent.displayName = "NavigationMenuContent";

export interface NavigationMenuLinkProps extends Omit<
  ComponentPropsWithoutRef<"a">,
  "href"
> {
  arrow?: boolean;
  href: string;
}

export const NavigationMenuLink = forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(({ arrow, children, className, href, ...rest }, ref) => {
  return (
    <BaseNavigationMenu.Link
      className={cn(
        "hive-focus rounded-sm p-3 leading-normal text-green-800 transition-colors hover:bg-beige-100 hover:text-green-1000 dark:text-neutral-300 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-100",
        arrow && "flex items-center",
        className,
      )}
      ref={ref}
      render={
        <Anchor
          href={href}
          {...(href.startsWith("http")
            ? { rel: "noopener noreferrer", target: "_blank" }
            : {})}
        />
      }
      {...rest}
    >
      {children}
      {arrow && (
        <ArrowIcon className="ml-auto size-6 shrink-0 opacity-0 transition-all" />
      )}
    </BaseNavigationMenu.Link>
  );
});
NavigationMenuLink.displayName = "NavigationMenuLink";

// Viewport is now rendered inside NavigationMenu.Root automatically
// This is kept for API compatibility
export const NavigationMenuViewport = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(function NavigationMenuViewport() {
  return null;
});
NavigationMenuViewport.displayName = "NavigationMenuViewport";

// Indicator is not used with Base UI NavigationMenu
// Kept for API compatibility
export const NavigationMenuIndicator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & { children?: ReactNode }
>(({ className, ...rest }, ref) => (
  <div
    className={cn(
      "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
      className,
    )}
    ref={ref}
    {...rest}
  >
    <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-beige-200 shadow-md" />
  </div>
));
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

// We're removing fade-in and fade-out too, because without the slide animations they make the content less readable.
function RemoveMotionIfPreferred() {
  return (
    <style>
      {`@media (prefers-reduced-motion: reduce) { #${CONTAINER_ID} * { animation-duration: 0ms !important; transition-duration: 0ms !important; } }`}
    </style>
  );
}
