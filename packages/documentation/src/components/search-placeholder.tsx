'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Search trigger component for HiveNavigation.
 * Styled to match the old Nextra search box.
 * Opens fumadocs search dialog when clicked or when ⌘K is pressed.
 */
export function SearchTrigger() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const handleClick = useCallback(() => {
    // Fumadocs search uses ⌘K / Ctrl+K to open
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true,
    });
    document.dispatchEvent(event);
  }, [isMac]);

  return (
    <button
      aria-label="Search documentation"
      className="nextra-search ml-3 hidden h-12 w-64 cursor-pointer items-center justify-between rounded-lg border border-green-200 bg-white px-4 text-sm text-green-700 transition-none hover:border-green-300 focus:outline-hidden focus:ring-2 focus:ring-green-500/50 md:flex dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
      onClick={handleClick}
      type="button"
    >
      <span className="text-green-700/70 dark:text-neutral-400">Search documentation...</span>
      <kbd className="rounded border-none bg-green-200 px-1.5 py-0.5 text-xs font-medium text-green-800 dark:bg-neutral-700 dark:text-neutral-300">
        {isMac ? '⌘' : 'Ctrl '}K
      </kbd>
    </button>
  );
}
