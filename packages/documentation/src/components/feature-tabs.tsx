"use client";

import { Tabs } from "@base-ui-components/react/tabs";
import { CallToAction } from "@hive/design-system/call-to-action";
import { cn } from "@hive/design-system/cn";
import { Heading } from "@hive/design-system/heading";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { createContext, ReactNode, useContext, useState } from "react";

import { ArrowIcon } from "./arrow-icon";
import { ChevronDownIcon } from "./ui/icons";

// Type for static image imports (Vite/webpack)
type StaticImageData = {
  blurDataURL?: string;
  height: number;
  src: string;
  width: number;
};

export type Highlight = {
  description: string;
  image?: StaticImageData | string;
  link?: string;
  title: string;
};

export interface FeatureTabsProps<T extends string> {
  children: React.ReactNode;
  className?: string;
  highlights: Record<T, Highlight[]>;
  icons: React.ReactNode[];
  /**
   * Explicit tab order. If not provided, uses Object.keys(highlights).
   */
  tabs?: readonly T[];
  /**
   * On very narrow screens, we shorten the tab names.
   */
  tabTexts?: Partial<Record<T, ReactNode>>;
}

export function FeatureTabs<T extends string>({
  children,
  className,
  highlights,
  icons,
  tabs: tabsProp,
  tabTexts = {},
}: FeatureTabsProps<T>) {
  const tabs = tabsProp ?? (Object.keys(highlights) as T[]);
  const [currentTab, setCurrentTab] = useState<T>(tabs[0]!);

  const smallScreenTabHandlers = useSmallScreenTabsHandlers();
  // Use the first tab's first highlight, not the first key in the object (which may be sorted differently)
  const [activeHighlight, setActiveHighlight] = useState(
    highlights[tabs[0]!]?.[0]?.title ?? "",
  );

  return (
    <section
      className={cn(
        "border-beige-400 isolate mx-auto w-312 max-w-full rounded-3xl bg-white",
        "[--tab-bg-dark:var(--color-beige-600)] [--tab-bg:var(--color-beige-200)] sm:max-w-[calc(100%-4rem)] sm:border md:p-6",
        className,
      )}
    >
      <FeatureTabsContext.Provider
        value={{ activeHighlight, highlights, setActiveHighlight }}
      >
        <Tabs.Root
          {...smallScreenTabHandlers}
          onValueChange={(value) => {
            const tab = value as T;
            setCurrentTab(tab);
            setActiveHighlight(highlights[tab]?.[0]?.title ?? "");
            smallScreenTabHandlers.onValueChange();
          }}
          value={currentTab}
        >
          <Tabs.List
            activateOnFocus
            className="group relative z-10 mx-4 my-6 flex flex-col overflow-hidden focus-within:overflow-visible max-sm:h-14.5 max-sm:focus-within:pointer-events-none max-sm:focus-within:rounded-b-none max-sm:focus-within:has-[>:nth-child(2)[aria-selected=true]]:-translate-y-full max-sm:focus-within:has-[>:nth-child(3)[aria-selected=true]]:translate-y-[-200%] sm:flex-row sm:rounded-2xl sm:bg-(--tab-bg) md:mx-0 md:mb-12 md:mt-0"
          >
            {tabs.map((tab, i) => {
              return (
                <Tabs.Tab
                  className="hive-focus aria-selected:text-green-1000 aria-selected:border-(--tab-bg-dark) aria-selected:bg-white max-sm:aria-[selected=false]:hidden group-focus-within:aria-[selected=false]:flex max-sm:aria-[selected=false]:rounded-none max-sm:group-focus-within:aria-[selected=false]:border-y-(--tab-bg) max-sm:group-focus-within:nth-2:aria-selected:rounded-none max-sm:group-focus-within:nth-2:aria-selected:border-y-(--tab-bg) max-sm:group-focus-within:first:aria-selected:border-b-(--tab-bg) max-sm:group-focus-within:first:aria-selected:rounded-b-none max-sm:aria-[selected=false]:pointer-events-none max-sm:aria-[selected=false]:group-focus-within:pointer-events-auto z-10 flex flex-1 items-center justify-center gap-2.5 rounded-lg border-transparent p-4 text-base font-medium leading-6 text-green-800 max-sm:border max-sm:border-(--tab-bg-dark) max-sm:bg-(--tab-bg) max-sm:group-focus-within:aria-selected:z-20 max-sm:group-focus-within:aria-selected:ring-4 sm:rounded-[15px] sm:border sm:text-xs sm:max-lg:p-3 sm:max-[721px]:p-2 md:text-sm lg:text-base max-sm:group-focus-within:last:border-t-(--tab-bg) max-sm:group-focus-within:nth-3:rounded-t-none [&>svg]:shrink-0 max-sm:group-focus-within:[&:not([aria-selected=true])]:first-child:rounded-t-lg max-sm:group-focus-within:[&:not([aria-selected=true])]:first-child:border-t-(--tab-bg-dark) [&:not([aria-selected=true])>:last-child]:invisible max-sm:group-focus-within:[[aria-selected=true]+&:last-child]:rounded-b-lg max-sm:group-focus-within:[[aria-selected=true]+&:last-child]:border-b-(--tab-bg-dark) max-sm:group-focus-within:[[:not([aria-selected=true])]+&:last-child:not([aria-selected=true])]:rounded-b-lg max-sm:group-focus-within:[[:not([aria-selected=true])]+&:last-child:not([aria-selected=true])]:border-b-(--tab-bg-dark)"
                  key={tab}
                  value={tab}
                >
                  {icons[i]}
                  {tabTexts[tab] || tab}
                  <ChevronDownIcon className="ml-auto size-6 text-green-800 transition group-focus-within:rotate-90 sm:hidden" />
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
          <div className="grid grid-cols-1 lg:grid-cols-2">{children}</div>
        </Tabs.Root>
      </FeatureTabsContext.Provider>
    </section>
  );
}

interface FeatureProps {
  description?: string;
  documentationLink?:
    | {
        href: string;
        text: string;
      }
    | string;
  highlights: Highlight[];
  setActiveHighlight: (highlight: string) => void;
  title: string;
}

function Feature({
  description,
  documentationLink,
  highlights,
  setActiveHighlight,
  title,
}: FeatureProps) {
  if (typeof documentationLink === "string") {
    documentationLink = {
      href: documentationLink,
      text: "Learn more",
    };
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-4 md:gap-12 md:px-8 md:pb-12">
      <header className="flex flex-wrap items-center gap-4 md:flex-col md:items-start md:gap-6">
        <Heading
          as="h2"
          className="text-green-1000 max-sm:text-2xl max-sm:leading-8"
          size="md"
        >
          {title}
        </Heading>
        {description && (
          <p className="basis-full leading-6 text-green-800">{description}</p>
        )}
      </header>
      <dl className="grid grid-cols-2 gap-4 md:gap-12">
        {highlights.map((highlight, i) => {
          if (highlight.link) {
            return (
              <Link
                className="hover:bg-beige-100 -m-2 block rounded-lg p-2 md:-m-4 md:rounded-xl md:p-4"
                key={i}
                onPointerOver={() => setActiveHighlight(highlight.title)}
                title={"Learn more about " + highlight.title}
                to={highlight.link}
              >
                <dt className="text-green-1000 font-medium">
                  {highlight.title}
                </dt>
                <dd className="mt-2 text-sm leading-5 text-green-800">
                  {highlight.description}
                </dd>
              </Link>
            );
          }

          return (
            <div
              className="hover:bg-beige-100 -m-2 rounded-lg p-2 md:-m-4 md:rounded-xl md:p-4"
              key={i}
              onPointerOver={() => setActiveHighlight(highlight.title)}
            >
              <dt className="text-green-1000 font-medium">{highlight.title}</dt>
              <dd className="mt-2 text-sm leading-5 text-green-800">
                {highlight.description}
              </dd>
            </div>
          );
        })}
      </dl>
      {documentationLink && (
        <CallToAction href={documentationLink.href} variant="primary">
          {documentationLink.text}
          <span className="sr-only">
            {/* descriptive text for screen readers and SEO audits */} about{" "}
            {title}
          </span>
          <ArrowIcon />
        </CallToAction>
      )}
    </div>
  );
}

const isSmallScreen = () => window.innerWidth < 640;

function useSmallScreenTabsHandlers() {
  return {
    onBlur: (event: React.FocusEvent<HTMLDivElement>) => {
      const tabs = event.currentTarget.querySelectorAll(
        '[role="tablist"] > [role="tab"]',
      );
      for (const tab of tabs) {
        tab.ariaSelected = "false";
      }
    },
    onValueChange: () => {
      if (!isSmallScreen()) return;
      setTimeout(() => {
        const { activeElement } = document;
        // This isn't a perfect dropdown for keyboard users, but we only render it on mobiles.
        if (
          activeElement &&
          activeElement instanceof HTMLElement &&
          activeElement.role === "tab"
        ) {
          activeElement.blur();
        }
      }, 0);
    },
    // edge case, but people can plug in keyboards to phones
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        !isSmallScreen() ||
        (event.key !== "ArrowDown" &&
          event.key !== "ArrowUp" &&
          event.key !== "Enter")
      ) {
        return;
      }
      event.preventDefault();

      // We proceed only if the tablist is focused.
      const { activeElement } = document;
      if (
        !activeElement ||
        !(activeElement instanceof HTMLElement) ||
        activeElement.role !== "tab"
      ) {
        return;
      }

      const items =
        activeElement.parentElement?.querySelectorAll('[role="tab"]');
      if (!items) {
        return;
      }

      let index = [...items].indexOf(activeElement);
      for (const [i, item] of items.entries()) {
        if (item.ariaSelected === "true") {
          index = i;
        }
        item.ariaSelected = "false";
      }

      switch (event.key) {
        case "ArrowDown":
          index = (index + 1) % items.length;
          break;

        case "ArrowUp":
          index = (index - 1 + items.length) % items.length;
          break;

        case "Enter": {
          const item = items[index];
          if (item instanceof HTMLElement) {
            if (Object.hasOwn(item.dataset, "selected")) {
              item.blur();
            } else {
              item.focus();
            }
          }
          break;
        }
      }

      items[index]!.ariaSelected = "true";
    },
  };
}

export interface FeatureTabProps extends Omit<
  FeatureProps,
  "setActiveHighlight"
> {}

export function FeatureTab({
  description,
  documentationLink,
  highlights,
  title,
}: FeatureTabProps) {
  const { setActiveHighlight } = useFeatureTabsContext();

  return (
    <Tabs.Panel
      className="data-hidden:hidden"
      // Make it accessible to crawlers, otherwise there's no DOM element to index
      keepMounted
      tabIndex={-1}
      value={title}
    >
      <Feature
        description={description}
        documentationLink={documentationLink}
        highlights={highlights}
        setActiveHighlight={setActiveHighlight}
        title={title}
      />
    </Tabs.Panel>
  );
}

interface FeatureTabsContextType {
  activeHighlight: string;
  highlights: Record<string, Highlight[]>;
  setActiveHighlight: (highlight: string) => void;
}

const FeatureTabsContext = createContext<FeatureTabsContextType | undefined>(
  undefined,
);

export function useFeatureTabsContext() {
  const value = useContext(FeatureTabsContext);
  if (!value) {
    throw new Error("useFeatureTabsContext must be used within a FeatureTabs");
  }
  return value;
}

export function ActiveHighlightImage() {
  const { activeHighlight, highlights } = useFeatureTabsContext();
  const allHighlights = Object.values<Highlight[]>(highlights).flat();

  return (
    <div className="relative mx-4 h-full flex-1 overflow-hidden rounded-3xl bg-blue-400 max-sm:h-72.5 sm:min-h-100 md:ml-6 md:mr-0">
      {allHighlights.map(
        (highlight, i) =>
          highlight.image && (
            <div
              className="absolute inset-0 opacity-0 transition delay-150 duration-150 ease-linear data-[current=true]:z-10 data-[current=true]:opacity-100 data-[current=true]:delay-0"
              data-current={activeHighlight === highlight.title}
              key={i}
            >
              <Image
                alt=""
                background={
                  typeof highlight.image === "object"
                    ? highlight.image.blurDataURL
                    : undefined
                }
                className="absolute left-6 top-6 h-[calc(100%-24px)] rounded-tl-3xl object-cover object-left lg:left-13.75 lg:top-27 lg:h-[calc(100%-108px)]"
                height={578} // max rendered height is 618px, and the usual is 554px
                role="presentation"
                src={
                  typeof highlight.image === "string"
                    ? highlight.image
                    : highlight.image.src
                }
                width={925} // max rendered width is 880px
              />
            </div>
          ),
      )}
    </div>
  );
}
