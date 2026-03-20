"use client";

import { cn } from "@hive/design-system/cn";
import {
  ScrollProvider,
  TOCItemType,
  useActiveAnchors,
} from "fumadocs-core/toc";
import { I18nLabel } from "fumadocs-ui/contexts/i18n";
import { Text } from "lucide-react";
import { useEffect, useRef } from "react";

interface DocsTocProps {
  children: React.ReactNode;
  toc: TOCItemType[];
}

// TODO: The active anchor left bar is animating on all navigations, but it's upstream in Fumadocs.
//       It would be nice to only animate it on scroll and hash link clicks in the same page, not when nagivating between pages.
export function DocsTableOfContent({ children, toc }: DocsTocProps) {
  return (
    <div
      className="sticky top-(--fd-docs-row-1) h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] flex flex-col [grid-area:toc] w-(--fd-toc-width) pt-12 pe-4 pb-2 max-xl:hidden"
      id="nd-toc"
    >
      {toc.length > 0 ? (
        <>
          <h3
            className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground"
            id="toc-title"
          >
            <Text className="size-4" />
            <I18nLabel label="toc" />
          </h3>
          <TOCScrollArea>
            <DocsTocItems toc={toc} />
          </TOCScrollArea>
        </>
      ) : null}
      {children}
    </div>
  );
}

function DocsTocItems({ toc }: { toc: TOCItemType[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <TocThumb
        className="absolute top-(--fd-top) h-(--fd-height) w-0.5 rounded-e-sm bg-fd-primary transition-[top,height] ease-linear"
        containerRef={containerRef}
      />
      <div
        className="flex flex-col border-s border-fd-foreground/10"
        ref={containerRef}
      >
        {toc.map((item) => (
          <DocsTocItem item={item} key={item.url} />
        ))}
      </div>
    </>
  );
}

function DocsTocItem({ item }: { item: TOCItemType }) {
  const activeAnchors = useActiveAnchors();
  const hashIndex = item.url.indexOf("#");
  const hash = hashIndex === -1 ? undefined : item.url.slice(hashIndex + 1);
  const activeOrder = hash ? activeAnchors.indexOf(hash) : -1;
  const isActive = activeOrder !== -1;
  const href = hash ? `#${hash}` : item.url;

  return (
    <a
      className={cn(
        "prose py-1.5 text-sm text-fd-muted-foreground transition-colors wrap-anywhere first:pt-0 last:pb-0 data-[active=true]:text-fd-primary",
        item.depth <= 2 && "ps-3",
        item.depth === 3 && "ps-6",
        item.depth >= 4 && "ps-8",
      )}
      data-active={isActive}
      data-toc-anchor={hash}
      href={href}
    >
      {item.title}
    </a>
  );
}

function TOCScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const viewRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative min-h-0 text-sm ms-px overflow-auto [scrollbar-width:none] mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3",
        className,
      )}
      ref={viewRef}
    >
      <ScrollProvider containerRef={viewRef}>{children}</ScrollProvider>
    </div>
  );
}

function TocThumb({
  className,
  containerRef,
}: {
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const activeAnchors = useActiveAnchors();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const thumb = thumbRef.current;
      if (!thumb) return;

      const [top, height] = calc(container, activeAnchors);
      thumb.style.setProperty("--fd-top", `${top}px`);
      thumb.style.setProperty("--fd-height", `${height}px`);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [activeAnchors, containerRef]);

  return (
    <div
      className={className}
      data-hidden={activeAnchors.length === 0}
      ref={thumbRef}
    />
  );
}

function calc(container: HTMLElement, activeAnchors: string[]) {
  if (activeAnchors.length === 0 || container.clientHeight === 0) return [0, 0];

  let upper = Number.MAX_VALUE;
  let lower = 0;
  let matched = false;

  for (const anchor of activeAnchors) {
    const element = container.querySelector<HTMLAnchorElement>(
      `[data-toc-anchor="${anchor}"]`,
    );
    if (!element) continue;
    matched = true;

    const styles = getComputedStyle(element);
    upper = Math.min(
      upper,
      element.offsetTop + Number.parseFloat(styles.paddingTop),
    );
    lower = Math.max(
      lower,
      element.offsetTop +
        element.clientHeight -
        Number.parseFloat(styles.paddingBottom),
    );
  }

  if (!matched) return [0, 0];

  return [upper, lower - upper];
}
