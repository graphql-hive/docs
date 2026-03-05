import { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "../cn";
import { MDXComponents } from "./types";

/**
 * Default MDX components for design system.
 * These provide styled versions of common MDX elements.
 */
const defaultComponents: MDXComponents = {
  iframe: ({ className, ...props }: ComponentPropsWithoutRef<"iframe">) => (
    // eslint-disable-next-line react/iframe-missing-sandbox -- YouTube requires allow-scripts + allow-same-origin
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className={cn("mt-6 aspect-video w-full", className)}
      title="YouTube Video Player"
      {...props}
    />
  ),
  source: ({
    src,
    type,
    ...props
  }: ComponentPropsWithoutRef<"source"> & { src?: string }) => {
    if (!src) {
      throw new Error("Must provide `src` prop");
    }
    let inferredType = type;
    if (!inferredType && src) {
      const ext = src.split(".").pop();
      if (ext) {
        inferredType = `video/${ext === "mov" ? "quicktime" : ext}`;
      }
    }
    return <source {...props} src={src} type={inferredType} />;
  },
  video: ({
    children,
    className,
    ...props
  }: ComponentPropsWithoutRef<"video"> & { children?: ReactNode }) => (
    <video
      autoPlay
      className={cn("mt-6 w-full", className)}
      loop
      muted
      {...props}
    >
      {children}
      Your browser does not support HTML video.
    </video>
  ),
};

export const useMDXComponents = (
  components?: MDXComponents,
): MDXComponents => ({
  ...defaultComponents,
  ...components,
});
