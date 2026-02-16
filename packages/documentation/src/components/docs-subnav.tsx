"use client";

import { SearchIcon } from "@hive/design-system/icons";
import { HiveCombinationMark } from "@hive/design-system/logos";
import Link from "fumadocs-core/link";
import { SidebarTrigger } from "fumadocs-ui/components/sidebar/base";
import { PanelLeft } from "lucide-react";

function openSearch() {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      ctrlKey: true,
      key: "k",
      metaKey: true,
    }),
  );
}

const triggerClass =
  "inline-flex size-10 items-center justify-center rounded-lg text-fd-muted-foreground hover:bg-fd-accent/50";

/**
 * Mobile-only sub-navigation for docs pages.
 * Replaces fumadocs' default LayoutHeader via `nav.component`.
 * On desktop, the full HiveNavigation header is shown above the DocsLayout.
 */
export function DocsSubnav() {
  return (
    <header className="[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center ps-4 pe-2.5 border-b backdrop-blur-sm h-(--fd-header-height) md:hidden max-md:layout:[--fd-header-height:--spacing(14)] bg-fd-background/80">
      <Link className="inline-flex items-center" href="/">
        <HiveCombinationMark className="h-6 w-auto text-green-1000 dark:text-neutral-200" />
        <span className="sr-only">Hive</span>
      </Link>
      <div className="flex-1" />
      <button
        aria-label="Search"
        className={triggerClass}
        onClick={openSearch}
        type="button"
      >
        <SearchIcon aria-hidden className="size-5" />
      </button>
      <SidebarTrigger className={triggerClass}>
        <PanelLeft className="size-5" />
      </SidebarTrigger>
    </header>
  );
}
