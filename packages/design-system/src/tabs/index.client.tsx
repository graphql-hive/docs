"use client";

import {
  Tab as HeadlessTab,
  TabProps as HeadlessTabProps,
  TabGroup,
  TabGroupProps,
  TabList,
  TabListProps,
  TabPanel,
  TabPanelProps,
  TabPanels,
  // this component is almost verbatim copied from Nextra, so we keep @headlessui/react to guarantee it works the same
} from "@headlessui/react";
import { useLocation } from "@tanstack/react-router";
import cn from "clsx";
import {
  FC,
  Fragment,
  ReactElement,
  ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useHash } from "../use-hash";

type TabItem = ReactElement | string;

type TabObjectItem = {
  disabled: boolean;
  key?: string;
  label: TabItem;
};

function isTabObjectItem(item: unknown): item is TabObjectItem {
  return !!item && typeof item === "object" && "label" in item;
}

export interface TabsProps extends Pick<
  TabGroupProps,
  "defaultIndex" | "onChange" | "selectedIndex"
> {
  children: ReactNode;
  /** Tabs CSS class name. */
  className?: TabListProps["className"];
  items: (TabItem | TabObjectItem)[];
  /**
   * URLSearchParams key for persisting the selected tab.
   * @default "tab"
   */
  searchParamKey?: string;
  /**
   * LocalStorage key for persisting the selected tab.
   * Set to `true` to use the default key `tabs-${id}`.
   * Leave empty or set to `null` to disable localStorage persistence.
   * Set to a string to use a custom key.
   */
  storageKey?: true | string | null;
  /** Tab CSS class name. */
  tabClassName?: HeadlessTabProps["className"];
}

export const Tabs = ({
  children,
  className,
  defaultIndex = 0,
  items,
  onChange,
  searchParamKey = "tab",
  selectedIndex: _selectedIndex,
  storageKey = null,
  tabClassName,
}: TabsProps) => {
  const id = useId();

  if (storageKey === true) {
    storageKey = `tabs-${id}`;
  }

  let [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);
  if (_selectedIndex !== undefined) {
    selectedIndex = _selectedIndex;
  }

  const tabPanelsRef = useRef<HTMLDivElement>(null!);

  const tabIndexFromSearchParams = useActiveTabFromURL(
    tabPanelsRef,
    items,
    searchParamKey,
    setSelectedIndex,
    id,
  );

  useActiveTabFromStorage(
    storageKey,
    items,
    setSelectedIndex,
    tabIndexFromSearchParams !== -1,
    id,
  );

  const handleChange = (index: number) => {
    onChange?.(index);

    if (storageKey) {
      const newValue = getTabKey(items, index, id);
      localStorage.setItem(storageKey, newValue);

      // the storage event only get picked up (by the listener) if the localStorage was changed in
      // another browser's tab/window (of the same app), but not within the context of the current tab.
      globalThis.dispatchEvent(
        new StorageEvent("storage", { key: storageKey, newValue }),
      );
    } else {
      setSelectedIndex(index);
    }

    if (searchParamKey) {
      const searchParams = new URLSearchParams(globalThis.location.search);
      const tabKeys = new Set(searchParams.getAll(searchParamKey));

      // we remove only tabs from this list from search params
      for (let i = 0; i < items.length; i++) {
        const key = getTabKey(items, i, id);
        tabKeys.delete(key);
      }

      // we add tabs from outside of this list back
      searchParams.delete(searchParamKey);
      for (const key of tabKeys) {
        searchParams.append(searchParamKey, key);
      }

      // and finally, we add the clicked tab
      searchParams.append(searchParamKey, getTabKey(items, index, id));

      globalThis.history.replaceState(
        null,
        "",
        `${globalThis.location.pathname}?${searchParams.toString()}`,
      );
    }
  };

  return (
    <TabGroup
      as={Fragment}
      defaultIndex={defaultIndex}
      onChange={handleChange}
      selectedIndex={selectedIndex}
    >
      <TabList
        className={(args) =>
          cn(
            "nextra-scrollbar overflow-x-auto overflow-y-hidden overscroll-x-contain",
            "mt-4 flex w-full gap-2 border-b border-beige-200 pb-px dark:border-neutral-800",
            "focus-visible:hive-focus",
            typeof className === "function" ? className(args) : className,
          )
        }
      >
        {items.map((item, index) => (
          <HeadlessTab
            className={(args) => {
              const { disabled, focus, hover, selected } = args;
              return cn(
                focus && "hive-focus ring-inset",
                "cursor-pointer whitespace-nowrap",
                "rounded-t p-2 font-medium leading-5 transition-colors",
                "-mb-0.5 select-none border-b-2",
                selected
                  ? "border-current outline-hidden"
                  : hover
                    ? "border-beige-200 dark:border-neutral-800"
                    : "border-transparent",
                selected
                  ? "text-green-900 dark:text-primary"
                  : disabled
                    ? "pointer-events-none text-beige-400 dark:text-neutral-600"
                    : hover
                      ? "text-black dark:text-white"
                      : "text-beige-600 dark:text-beige-200",
                typeof tabClassName === "function"
                  ? tabClassName(args)
                  : tabClassName,
              );
            }}
            disabled={isTabObjectItem(item) && item.disabled}
            key={index}
          >
            {isTabObjectItem(item) ? item.label : item}
          </HeadlessTab>
        ))}
      </TabList>
      <TabPanels ref={tabPanelsRef}>{children}</TabPanels>
    </TabGroup>
  );
};

export const Tab: FC<TabPanelProps> = ({
  children,
  // For SEO display all the Panel in the DOM and set `display: none;` for those that are not selected
  className,
  unmount = false,
  ...props
}) => {
  return (
    <TabPanel
      {...props}
      className={(args) =>
        cn(
          "mt-[1.25em] rounded",
          args.focus && "hive-focus",
          typeof className === "function" ? className(args) : className,
        )
      }
      unmount={unmount}
    >
      {children}
    </TabPanel>
  );
};

function useActiveTabFromURL(
  tabPanelsRef: React.RefObject<HTMLDivElement>,
  items: (TabItem | TabObjectItem)[],
  searchParamKey: string,
  setSelectedIndex: (index: number) => void,
  id: string,
) {
  const hash = useHash();
  const { searchStr } = useLocation();
  const searchParams = new URLSearchParams(searchStr);
  const tabsInSearchParams = searchParams.getAll(searchParamKey).sort();

  const tabIndexFromSearchParams = items.findIndex((_, index) =>
    tabsInSearchParams.includes(getTabKey(items, index, id)),
  );

  useIsomorphicLayoutEffect(() => {
    const tabPanel = hash
      ? tabPanelsRef.current?.querySelector(
          `[role=tabpanel]:has([id="${hash}"])`,
        )
      : null;

    if (tabPanel) {
      let index = 0;
      for (const el of tabPanelsRef.current!.children) {
        if (el === tabPanel) {
          setSelectedIndex(Number(index));
          // Note for posterity:
          //   This is not an infinite loop. Clearing and restoring the hash is necessary
          //   for the browser to scroll to the element. The intermediate empty hash triggers
          //   a hashchange event, but we don't look for a tab panel if there is no hash.

          // Clear hash first, otherwise page isn't scrolled
          // eslint-disable-next-line react-hooks/immutability -- updating URL hash is intentional side effect
          globalThis.location.hash = "";
          // Execute on next tick after `selectedIndex` update
          requestAnimationFrame(() => {
            globalThis.location.hash = `#${hash}`;
          });
        }
        index++;
      }
    } else if (tabIndexFromSearchParams !== -1) {
      // if we don't have content to scroll to, we look at the search params
      setSelectedIndex(tabIndexFromSearchParams);
    }

    return function cleanUpTabFromSearchParams() {
      const newSearchParams = new URLSearchParams(globalThis.location.search);
      newSearchParams.delete(searchParamKey);
      globalThis.history.replaceState(
        null,
        "",
        `${globalThis.location.pathname}?${newSearchParams.toString()}`,
      );
    };
    // tabPanelsRef is a ref, so it's not a dependency
  }, [hash, tabsInSearchParams.join(",")]);

  return tabIndexFromSearchParams;
}

function useActiveTabFromStorage(
  storageKey: string | null,
  items: (TabItem | TabObjectItem)[],
  setSelectedIndex: (index: number) => void,
  ignoreLocalStorage: boolean,
  id: string,
) {
  useIsomorphicLayoutEffect(() => {
    if (!storageKey || ignoreLocalStorage) {
      // Do not listen storage events if there is no storage key
      return;
    }

    // eslint-disable-next-line unicorn/consistent-function-scoping -- needs closure over items, id, setSelectedIndex
    const setSelectedTab = (key: string) => {
      const index = items.findIndex((_, i) => getTabKey(items, i, id) === key);
      if (index !== -1) {
        setSelectedIndex(index);
      }
    };

    function onStorageChange(event: StorageEvent) {
      if (event.key === storageKey) {
        const value = event.newValue;
        if (value) {
          setSelectedTab(value);
        }
      }
    }

    const value = localStorage.getItem(storageKey);
    if (value) {
      setSelectedTab(value);
    }

    globalThis.addEventListener("storage", onStorageChange);
    return () => {
      globalThis.removeEventListener("storage", onStorageChange);
    };
  }, [storageKey, items, setSelectedIndex, id]);
}

type TabKey = string & { __brand: "TabKey" };

function getTabKey(
  items: (TabItem | TabObjectItem)[],
  index: number,
  prefix: string,
): TabKey {
  const item = items[index];
  const isObject = isTabObjectItem(item);
  // if the key is defined by user, we use it
  if (isObject && item.key) {
    return item.key as TabKey;
  }
  const label = isObject ? item.label : item;
  // otherwise we use the slugified label prefixed by the tab group id, if the label is a string
  // or the index of the item in the items array prefixed by the tab group id if the label is a ReactElement
  const key =
    typeof label === "string"
      ? slugify(label)
      : `${prefix}-${index.toString()}`;
  return key as TabKey;
}

function slugify(label: string) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036F]/g, "") // strip accents
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}

const useIsomorphicLayoutEffect =
  globalThis.window === undefined ? useEffect : useLayoutEffect;
