"use client";

import { PageActions } from "@/components/page-actions";
import { Link } from "@tanstack/react-router";
import { TOCItemType, useActiveAnchors } from "fumadocs-core/toc";
import { Text } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

interface DocsTocProps {
  githubUrl: string;
  markdownUrl: string;
  toc: TOCItemType[];
}

export function DocsTableOfContent({
  githubUrl,
  markdownUrl,
  toc,
}: DocsTocProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeAnchor = useActiveAnchors()[0];

  useLayoutEffect(() => {
    if (!activeAnchor) return;

    containerRef.current
      ?.querySelector<HTMLElement>(`[data-hash="${activeAnchor}"]`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  }, [activeAnchor]);

  return (
    <div
      className="sticky top-(--fd-docs-row-1) hidden h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] w-(--fd-toc-width) flex-col [grid-area:toc] pt-12 pe-4 pb-2 xl:flex"
      id="nd-toc"
    >
      <h3
        className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground"
        id="toc-title"
      >
        <Text className="size-4" />
        On this page
      </h3>
      <div className="overflow-y-auto pt-4">
        {toc.length === 0 ? (
          <div className="rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground">
            No headings found on this page.
          </div>
        ) : (
          <div
            className="flex flex-col border-s border-fd-foreground/10"
            ref={containerRef}
          >
            {toc.map((item) => (
              <DocsTocItem item={item} key={item.url} />
            ))}
          </div>
        )}
      </div>
      <PageActions githubUrl={githubUrl} markdownUrl={markdownUrl} />
    </div>
  );
}

function DocsTocItem({ item }: { item: TOCItemType }) {
  const activeAnchors = useActiveAnchors();
  const hashIndex = item.url.indexOf("#");
  const hash = hashIndex === -1 ? undefined : item.url.slice(hashIndex + 1);
  const isActive = hash ? activeAnchors.includes(hash) : false;
  const to = hashIndex <= 0 ? "." : item.url.slice(0, hashIndex);

  return (
    <Link
      className={[
        "prose py-1.5 text-sm text-fd-muted-foreground transition-colors wrap-anywhere first:pt-0 last:pb-0 data-[active=true]:text-fd-primary",
        item.depth <= 2 ? "ps-3" : "",
        item.depth === 3 ? "ps-6" : "",
        item.depth >= 4 ? "ps-8" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-active={isActive}
      data-hash={hash}
      hash={hash}
      hashScrollIntoView
      resetScroll={false}
      to={to || "."}
    >
      {item.title}
    </Link>
  );
}
