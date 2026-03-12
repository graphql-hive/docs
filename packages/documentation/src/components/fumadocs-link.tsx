"use client";

import { Link } from "@tanstack/react-router";
import { forwardRef } from "react";

type FumadocsLinkProps = React.ComponentProps<"a"> & {
  prefetch?: boolean;
};

// Eventually this should reuse the design-system Anchor, but first its
// callsites need to stop depending on Nextra/Fumadocs-style anchor props.
export const FumadocsLink = forwardRef<HTMLAnchorElement, FumadocsLinkProps>(
  function FumadocsLink(
    { children, href = "#", prefetch = true, rel, target, ...props },
    forwardedRef,
  ) {
    const hrefString = href;

    if (hrefString.startsWith("#")) {
      return (
        <a
          href={hrefString}
          ref={forwardedRef}
          rel={rel}
          target={target}
          {...props}
        >
          {children}
        </a>
      );
    }

    if (
      target === "_blank" ||
      /^\w+:/.test(hrefString) ||
      hrefString.startsWith("//")
    ) {
      return (
        <a
          href={hrefString}
          ref={forwardedRef}
          rel={rel ?? "noreferrer noopener"}
          target={target ?? "_blank"}
          {...props}
        >
          {children}
        </a>
      );
    }

    const hashIndex = hrefString.indexOf("#");
    const to = hashIndex === -1 ? hrefString : hrefString.slice(0, hashIndex);
    const hash = hashIndex === -1 ? undefined : hrefString.slice(hashIndex + 1);

    return (
      <Link
        hash={hash}
        preload={prefetch ? "intent" : false}
        ref={forwardedRef}
        resetScroll={hash === undefined}
        to={to || "."}
        {...props}
      >
        {children}
      </Link>
    );
  },
);
