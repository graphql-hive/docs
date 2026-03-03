"use client";

import { SearchIcon } from "@hive/design-system/icons";
import { useCallback, useSyncExternalStore } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const emptySubscribe = () => noop;

/**
 * Search trigger component for HiveNavigation.
 * Styled to match the old Nextra search box.
 * Opens fumadocs search dialog when clicked or when ⌘K is pressed.
 */
export function SearchTrigger() {
  const isMac = useSyncExternalStore(
    emptySubscribe,
    () => !navigator.platform.includes("Win"),
    () => true,
  );

  const handleClick = useCallback(() => {
    const event = new KeyboardEvent("keydown", {
      bubbles: true,
      ctrlKey: !isMac,
      key: "k",
      metaKey: isMac,
    });
    document.dispatchEvent(event);
  }, [isMac]);

  return (
    <>
      <button
        aria-label="Search documentation"
        className="md:ml-3 max-md:size-8 md:h-12 md:w-64 cursor-pointer items-center rounded-lg border border-green-200 bg-white md:px-4 text-sm text-green-700 transition-none hover:border-green-300 focus:outline-hidden focus:ring-2 focus:ring-green-500/50 md:flex dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 max-md:border-none max-md:bg-transparent dark:max-md:bg-transparent flex justify-center md:justify-start max-md:text-current"
        onClick={handleClick}
        type="button"
      >
        <SearchIcon
          className="size-4.5 md:hidden"
          vectorEffect="non-scaling-stroke"
        />
        <span className="text-green-700/70 dark:text-neutral-400 max-md:hidden">
          Search<span className="max-lg:hidden"> documentation</span>...
        </span>
        <kbd
          className="rounded-sm border-none bg-green-200 px-1.5 py-0.5 text-xs font-medium text-green-800 dark:bg-neutral-700 dark:text-neutral-300 max-md:hidden ml-auto"
          id="search-kbd"
          suppressHydrationWarning
        >
          ⌘K
        </kbd>
      </button>
      <script
        dangerouslySetInnerHTML={{
          __html: `(e=>e&&navigator.platform.includes('Win')&&(e.textContent='Ctrl K'))(document.getElementById('search-kbd'))`,
        }}
      />
    </>
  );
}
