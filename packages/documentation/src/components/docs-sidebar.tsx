"use client";

/**
 * Custom sidebar forked from fumadocs-ui/layouts/docs/sidebar.
 *
 * Differences from upstream:
 * - Mobile drawer is a full navigation menu matching the navbar structure
 *   (Get Started, Contact Us, Status, Documentation >, Products >, Pricing, etc.)
 * - "Documentation" expands into the docs page tree
 * - Item spacing handled via Tailwind instead of CSS override
 * - No search toggle in collapsed panel (search is in HiveNavigation)
 */

import type { ComponentProps, ReactNode } from "react";

import { cn } from "@hive/design-system";
import { siteOrigin } from "@hive/design-system/constants";
import { ArrowIcon, GitHubIcon } from "@hive/design-system/icons";
import {
  FOUR_MAIN_PRODUCTS,
  SIX_HIGHLIGHTED_PRODUCTS,
} from "@hive/design-system/products";
import { cva } from "class-variance-authority";
import { usePathname } from "fumadocs-core/framework";
import Link from "fumadocs-core/link";
import {
  SidebarCollapseTrigger,
  SidebarContent as SidebarContentBase,
  SidebarDrawerContent,
  SidebarDrawerOverlay,
  SidebarFolder,
  SidebarFolderContent as SidebarFolderContentBase,
  SidebarFolderLink as SidebarFolderLinkBase,
  SidebarFolderTrigger as SidebarFolderTriggerBase,
  SidebarItem as SidebarItemBase,
  SidebarSeparator as SidebarSeparatorBase,
  SidebarTrigger,
  SidebarViewport,
  useFolder,
  useFolderDepth,
} from "fumadocs-ui/components/sidebar/base";
import { createPageTreeRenderer } from "fumadocs-ui/components/sidebar/page-tree";
import { SidebarTabsDropdown } from "fumadocs-ui/components/sidebar/tabs/dropdown";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "fumadocs-ui/components/ui/collapsible";
import { useTreeContext } from "fumadocs-ui/contexts/tree";
import { getSidebarTabs } from "fumadocs-ui/utils/get-sidebar-tabs";
import { ChevronRight, ExternalLink, Sidebar } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { SidebarFooter, ThemeToggle } from "./sidebar-footer";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mergeRefs<T>(
  ...refs: (React.Ref<T> | null | undefined)[]
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value);
      else if (ref) (ref as { current: T | null }).current = value;
    }
  };
}

function isActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

// ---------------------------------------------------------------------------
// Item styling (from fumadocs-ui/layouts/docs/sidebar)
// ---------------------------------------------------------------------------

const itemVariants = cva(
  "relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      highlight: {
        true: "data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:start-2.5",
      },
      variant: {
        button:
          "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none",
        link: "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-sidebar-active-bg data-[active=true]:text-fd-sidebar-active data-[active=true]:hover:transition-colors",
      },
    },
  },
);

function getItemOffset(depth: number) {
  return `calc(${2 + 3 * depth} * var(--spacing))`;
}

// ---------------------------------------------------------------------------
// Styled sidebar tree components (from fumadocs-ui/layouts/docs/sidebar)
// ---------------------------------------------------------------------------

function SidebarSeparator({
  children,
  className,
  style,
  ...props
}: ComponentProps<"p">) {
  const depth = useFolderDepth();
  return (
    <SidebarSeparatorBase
      className={cn("[&_svg]:size-4 [&_svg]:shrink-0", className)}
      style={{ paddingInlineStart: getItemOffset(depth), ...style }}
      {...props}
    >
      {children}
    </SidebarSeparatorBase>
  );
}

function SidebarItem({
  children,
  className,
  style,
  ...props
}: ComponentProps<typeof SidebarItemBase>) {
  const depth = useFolderDepth();
  return (
    <SidebarItemBase
      className={cn(
        itemVariants({ highlight: depth >= 1, variant: "link" }),
        "not-first:mt-0.5 data-[active=true]:[&:before]:bg-fd-sidebar-active!", // this is `[&:before]` not `before:` intentionally
        className,
      )}
      style={{ paddingInlineStart: getItemOffset(depth), ...style }}
      {...props}
    >
      {children}
    </SidebarItemBase>
  );
}

function SidebarFolderTrigger({
  className,
  style,
  ...props
}: ComponentProps<typeof SidebarFolderTriggerBase>) {
  const ctx = useFolder();
  const depth = ctx?.depth ?? 1;
  const collapsible = ctx?.collapsible ?? true;
  return (
    <SidebarFolderTriggerBase
      className={cn(
        itemVariants({ variant: collapsible ? "button" : null }),
        "w-full mt-0.5",
        className,
      )}
      style={{ paddingInlineStart: getItemOffset(depth - 1), ...style }}
      {...props}
    >
      {props.children}
    </SidebarFolderTriggerBase>
  );
}

function SidebarFolderLink({
  className,
  style,
  ...props
}: ComponentProps<typeof SidebarFolderLinkBase>) {
  const depth = useFolderDepth();
  return (
    <SidebarFolderLinkBase
      className={cn(
        itemVariants({ highlight: depth > 1, variant: "link" }),
        "w-full mt-0.5",
        className,
      )}
      style={{ paddingInlineStart: getItemOffset(depth - 1), ...style }}
      {...props}
    >
      {props.children}
    </SidebarFolderLinkBase>
  );
}

function SidebarFolderContent({
  children,
  className,
  ...props
}: ComponentProps<typeof SidebarFolderContentBase>) {
  const depth = useFolderDepth();
  return (
    <SidebarFolderContentBase
      className={cn(
        "relative mt-0.5",
        depth === 1 &&
          "before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:start-2.5",
        className,
      )}
      {...props}
    >
      {children}
    </SidebarFolderContentBase>
  );
}

const SidebarPageTree = createPageTreeRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
});

// ---------------------------------------------------------------------------
// Desktop sidebar (forked from fumadocs-ui/layouts/docs/sidebar)
// ---------------------------------------------------------------------------

function DesktopSidebar({
  children,
  className,
  ...props
}: ComponentProps<"aside">) {
  const ref = useRef<HTMLElement>(null);
  return (
    <SidebarContentBase>
      {({ collapsed, hovered, ref: asideRef, ...rest }) => (
        <>
          <div
            className="sticky top-(--fd-docs-row-1) z-10 [grid-area:sidebar] pointer-events-none *:pointer-events-auto h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] md:layout:[--fd-sidebar-width:268px] max-md:hidden"
            data-sidebar-placeholder=""
          >
            {collapsed && (
              <div className="absolute start-0 inset-y-0 w-4" {...rest} />
            )}
            <aside
              className={cn(
                "absolute flex flex-col w-full start-0 inset-y-0 items-end bg-transparent text-sm border-e duration-250 *:w-(--fd-sidebar-width)",
                collapsed && [
                  "inset-y-2 rounded-xl transition-transform border w-(--fd-sidebar-width)",
                  hovered
                    ? "shadow-lg translate-x-2 rtl:-translate-x-2"
                    : "-translate-x-(--fd-sidebar-width) rtl:translate-x-full",
                ],
                (ref.current?.dataset["collapsed"] === "true") !== collapsed &&
                  "transition-[width,inset-block,translate,background-color]",
                className,
              )}
              data-collapsed={collapsed}
              data-hovered={collapsed && hovered}
              id="nd-sidebar"
              ref={mergeRefs(ref, asideRef)}
              {...props}
              {...rest}
            >
              {children}
            </aside>
          </div>
          <div
            className={cn(
              "fixed flex top-[calc(--spacing(4)+var(--fd-docs-row-3))] start-4 shadow-lg transition-opacity rounded-xl p-0.5 border bg-fd-muted text-fd-muted-foreground z-10",
              (!collapsed || hovered) && "pointer-events-none opacity-0",
            )}
            data-sidebar-panel=""
          >
            <SidebarCollapseTrigger className="inline-flex items-center justify-center rounded-lg p-1.5 text-sm text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground">
              <Sidebar className="size-4" />
            </SidebarCollapseTrigger>
          </div>
        </>
      )}
    </SidebarContentBase>
  );
}

// ---------------------------------------------------------------------------
// Mobile drawer (forked from fumadocs-ui/layouts/docs/sidebar)
// ---------------------------------------------------------------------------

function MobileDrawer({
  children,
  className,
  ...props
}: ComponentProps<typeof SidebarDrawerContent>) {
  return (
    <>
      <SidebarDrawerOverlay className="fixed z-40 inset-0 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" />
      <SidebarDrawerContent
        className={cn(
          "fixed text-[0.9375rem] flex flex-col shadow-lg border-s end-0 inset-y-0 w-[85%] max-w-[380px] z-40 bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out",
          className,
        )}
        {...props}
      >
        {children}
      </SidebarDrawerContent>
    </>
  );
}

// ---------------------------------------------------------------------------
// Mobile menu item components
// ---------------------------------------------------------------------------

const mobileItemClass =
  "flex w-full items-center gap-2 py-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground";

function MobileLink({
  children,
  external,
  href,
}: {
  children: ReactNode;
  external?: boolean;
  href: string;
}) {
  return (
    <Link className={mobileItemClass} href={href}>
      {children}
      {external && <ExternalLink className="ml-auto size-4 opacity-50" />}
    </Link>
  );
}

function MobileCollapsible({
  children,
  defaultOpen,
  title,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
  title: string;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <Collapsible onOpenChange={setOpen} open={open}>
      <CollapsibleTrigger className={cn(mobileItemClass, "cursor-pointer")}>
        {title}
        <ChevronRight
          className={cn(
            "ml-auto size-4 opacity-50 transition-transform",
            open && "rotate-90",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-2 pl-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function MobileProductsList() {
  return (
    <div className="flex flex-col">
      <p className="py-2 text-xs font-medium uppercase tracking-wide text-fd-muted-foreground/60">
        The GraphQL Stack
      </p>
      {FOUR_MAIN_PRODUCTS.map((product) => {
        const Logo = product.logo;
        return (
          <Link
            className="flex items-center gap-2 py-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            href={product.href}
            key={product.name}
          >
            <Logo className="size-4" />
            {product.name}
          </Link>
        );
      })}
      <p className="mt-2 py-2 text-xs font-medium uppercase tracking-wide text-fd-muted-foreground/60">
        Libraries
      </p>
      {SIX_HIGHLIGHTED_PRODUCTS.map((product) => {
        const Logo = product.logo;
        return (
          <Link
            className="flex items-center gap-2 py-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            href={product.href}
            key={product.name}
          >
            <Logo className="size-4" />
            {product.name}
          </Link>
        );
      })}
      <Link
        className="mt-1 flex items-center gap-1 py-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        href="/ecosystem"
      >
        Explore all libraries <ArrowIcon className="size-3" />
      </Link>
    </div>
  );
}

function MobileCompanyMenu() {
  return (
    <div className="flex flex-col">
      <Link
        className="flex items-center gap-2 py-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        href={`${siteOrigin}/about-us`}
      >
        About Us
      </Link>
      <Link
        className="flex items-center gap-2 py-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        href={`${siteOrigin}/logos`}
      >
        Brand Assets
      </Link>
    </div>
  );
}

function MobileNavMenu() {
  const pathname = usePathname();
  const onDocsPage = isActive("/docs", pathname);

  return (
    <nav className="flex flex-col">
      <MobileLink href="https://app.graphql-hive.com/">
        Get Started
      </MobileLink>
      <MobileLink external href={`${siteOrigin}/contact`}>
        Contact Us
      </MobileLink>
      <MobileLink external href="https://status.graphql-hive.com/">
        Status
      </MobileLink>

      <MobileCollapsible defaultOpen={onDocsPage} title="Documentation">
        <div className="[&>*:not(:first-child)]:mt-0.5">
          <SidebarPageTree />
        </div>
      </MobileCollapsible>

      <MobileCollapsible title="Products">
        <MobileProductsList />
      </MobileCollapsible>

      <MobileLink href="/pricing">Pricing</MobileLink>
      <MobileLink href="/product-updates">Product Updates</MobileLink>
      <MobileLink href="/case-studies">Case Studies</MobileLink>
      <MobileLink href="/blog">Blog</MobileLink>
      <MobileLink external href="https://github.com/graphql-hive/console">
        GitHub
      </MobileLink>

      <MobileCollapsible title="The Guild">
        <MobileCompanyMenu />
      </MobileCollapsible>

      <MobileLink external href="https://graphql.org/community/foundation/">
        GraphQL Foundation
      </MobileLink>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

function BackToOverview() {
  const { full, root } = useTreeContext();
  if (root === full) return null;
  return (
    <Link
      className="flex items-center gap-1.5 px-4 py-2 text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground"
      href="/docs"
    >
      <ArrowIcon className="size-3 rotate-180" />
      Back
    </Link>
  );
}

export function DocsSidebar() {
  const { full: tree } = useTreeContext();
  const tabs = useMemo(() => getSidebarTabs(tree), [tree]);

  return (
    <>
      <DesktopSidebar>
        {tabs.length > 0 && (
          <div className="p-4 pb-0">
            <SidebarTabsDropdown className="w-full bg-white dark:bg-(--nextra-bg) text-green-1000 dark:text-white" options={tabs} />
          </div>
        )}
        <SidebarViewport>
          <div className="[&>*:not(:first-child)]:mt-0.5">
            <SidebarPageTree />
          </div>
        </SidebarViewport>
        <BackToOverview />
        <div className="flex flex-col border-t p-4 pt-2">
          <SidebarFooter />
        </div>
      </DesktopSidebar>
      <MobileDrawer>
        <div className="flex items-center gap-1.5 p-4 pb-2 text-fd-muted-foreground">
          <Link
            className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
            href="https://github.com/graphql-hive/console"
          >
            <GitHubIcon className="size-4.5" />
          </Link>
          <ThemeToggle className="ms-auto" />
          <SidebarTrigger className="rounded-lg p-2 hover:bg-fd-accent hover:text-fd-accent-foreground">
            <Sidebar className="size-4.5" />
          </SidebarTrigger>
        </div>
        {tabs.length > 0 && (
          <div className="px-4 pb-2">
            <SidebarTabsDropdown className="w-full" options={tabs} />
          </div>
        )}
        <SidebarViewport>
          <MobileNavMenu />
        </SidebarViewport>
      </MobileDrawer>
    </>
  );
}
