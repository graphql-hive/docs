"use client";

import { useLayoutEffect } from "react";

const TOC_LINK_SELECTOR =
  "#nd-toc a[href^='#'], [data-toc-popover-content] a[href^='#']";

export function TocLinkHandler() {
  useLayoutEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const { target } = event;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>(TOC_LINK_SELECTOR);
      const href = anchor?.getAttribute("href");
      if (!anchor || !href) return;

      const heading = document.getElementById(href.slice(1));
      if (!heading) return;

      event.preventDefault();
      event.stopPropagation();

      history.replaceState(
        history.state,
        "",
        `${location.pathname}${location.search}${href}`,
      );
      requestAnimationFrame(() => {
        heading.scrollIntoView();
      });
    }

    (
      globalThis as typeof globalThis & { __tocLinkHandlerReady?: boolean }
    ).__tocLinkHandlerReady = true;
    document.addEventListener("click", onClick, true);
    return () => {
      delete (
        globalThis as typeof globalThis & { __tocLinkHandlerReady?: boolean }
      ).__tocLinkHandlerReady;
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
