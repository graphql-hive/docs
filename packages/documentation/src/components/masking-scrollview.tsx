"use client";

import type { ReactNode } from "react";

import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const emptySubscribe = () => noop;

// useMounted hook - returns true when component is mounted (client-side)
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export interface MaskingScrollviewProps {
  children: ReactNode;
  className?: string;
  fade: "x" | "y";
  outerClassName?: string;
}

export function MaskingScrollview({
  children,
  className,
  fade,
  outerClassName,
  ...rest
}: MaskingScrollviewProps) {
  const scrollviewRef = useRef<HTMLDivElement | null>(null);
  const { scrolledSides, shouldTransition } = useScrolledSides(scrollviewRef);

  // We must only calculate the style on the client to avoid a "prop did not match" error.
  const mounted = useMounted();

  return (
    <div
      {...rest}
      className={outerClassName}
      style={
        mounted
          ? {
              // replace "mask" with "background" to debug it
              maskImage:
                fade === "x"
                  ? scrolledSides.left && scrolledSides.right
                    ? "none"
                    : `linear-gradient(to left, transparent, black 128px 25%, black 50%, transparent 50%),
               linear-gradient(to right, transparent, black 128px 25%, black 50%, transparent 50%)`
                  : scrolledSides.top && scrolledSides.bottom
                    ? "none"
                    : `linear-gradient(to bottom, transparent, black 128px 25%, black 50%, transparent 50%),
               linear-gradient(to top, transparent, black 128px 25%, black 50%, transparent 50%)`,
              maskPosition:
                fade === "x"
                  ? `${scrolledSides.right ? "0px" : "-128px"} 0%, ${scrolledSides.left ? "0px" : "-128px"} 0%`
                  : `0% ${scrolledSides.top ? "-128px" : "0px"}, 0% ${scrolledSides.bottom ? "0px" : "-128px"}`,
              maskSize:
                fade === "x"
                  ? "calc(100% + 128px) 100%, calc(100% + 128px) 100%"
                  : "100% calc(100% + 128px), 100% calc(100% + 128px)",
              transition: shouldTransition
                ? "mask-position 0.5s ease, -webkit-mask-position 0.5s ease"
                : "",
            }
          : {}
      }
    >
      <div className={className} ref={scrollviewRef}>
        {children}
      </div>
    </div>
  );
}

const useClientsideEffect =
  globalThis.window === undefined ? noop : useLayoutEffect;

export function useScrolledSides(
  scrollviewRef: { current: HTMLElement | null },
  options: {
    disabled?: boolean;
    thresholdPx?: number;
  } = {},
) {
  const { disabled = false, thresholdPx = 8 } = options;

  const [scrolledSides, setScrolledSides] = useState({
    bottom: false,
    left: false,
    right: false,
    top: false,
  });
  const [transitionsAllowed, allowTransitions] = useReducer(() => true, false);

  useEffect(() => {
    if (disabled) return;

    let timeout: number | undefined;

    const handleScroll = () => {
      const scrollview = scrollviewRef.current;

      if (!scrollview) return;

      const {
        clientHeight,
        clientWidth,
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth,
      } = scrollview;
      const newState = {
        bottom: scrollTop >= scrollHeight - clientHeight - thresholdPx,
        left: scrollLeft <= thresholdPx,
        right: scrollLeft >= scrollWidth - clientWidth - thresholdPx,
        top: scrollTop <= thresholdPx,
      };

      if (JSON.stringify(scrolledSides) !== JSON.stringify(newState)) {
        if (!transitionsAllowed) allowTransitions();
        setScrolledSides(newState);
      }
    };

    const addListener = () => {
      const scrollview = scrollviewRef.current;

      if (scrollview) {
        if (timeout != null) globalThis.clearTimeout(timeout);

        scrollview.addEventListener("scroll", handleScroll, { passive: true });
      } else {
        timeout = globalThis.setTimeout(() => addListener(), 1000) as unknown as number;
      }
    };

    addListener();

    const scrollviewForCleanup = scrollviewRef.current;
    return () => {
      if (timeout != null) globalThis.clearTimeout(timeout);
      if (scrollviewForCleanup)
        scrollviewForCleanup.removeEventListener("scroll", handleScroll);
    };
  }, [scrolledSides, scrollviewRef, thresholdPx, transitionsAllowed, disabled]);

  useClientsideEffect(() => {
    if (disabled) return;

    const scrollview = scrollviewRef.current;
    if (!scrollview) return;

    const child = scrollview.firstElementChild;
    const childWidth = child?.clientWidth || scrollview.clientWidth;
    const childHeight = child?.clientHeight || scrollview.clientHeight;

    const newState = {
      bottom: Math.abs(scrollview.clientHeight - childHeight) < thresholdPx,
      left: scrollview.scrollLeft <= thresholdPx,
      right: Math.abs(scrollview.clientWidth - childWidth) < thresholdPx,
      top: scrollview.scrollTop <= thresholdPx,
    };

    if (JSON.stringify(scrolledSides) !== JSON.stringify(newState)) {
      setScrolledSides(newState);
    }
  }, [scrollviewRef, disabled]);

  return { scrolledSides, shouldTransition: transitionsAllowed };
}
