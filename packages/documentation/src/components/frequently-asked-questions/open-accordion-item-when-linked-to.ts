"use client";

import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";

const useIsomorphicLayoutEffect =
  globalThis.window === undefined ? useEffect : useLayoutEffect;
export function OpenAccordionItemWhenLinkedTo() {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useIsomorphicLayoutEffect(() => {
    console.log("hash", hash);
    if (hash) {
      const button = document.querySelector<HTMLButtonElement>(
        `#${hash} button[aria-expanded="false"]`,
      );
      if (button) {
        button.click();
        // in the case where user scrolls up and clicks the same link again,
        // we couldn't rely on hash change, so we just consume it here
        globalThis.history.replaceState({}, "", globalThis.location.pathname);
      }
    }
  }, [hash]);

  return null;
}

const subscribe = (onStoreChange: () => void) => {
  const handler = () => {
    onStoreChange();
  };

  globalThis.addEventListener("hashchange", handler);
  return () => void globalThis.removeEventListener("hashchange", handler);
};

const getSnapshot = () => {
  const { hash } = globalThis.location;
  if (hash.startsWith("#faq")) {
    return hash.slice(1);
  }
  return;
};

const getServerSnapshot = () => {
  return;
};
