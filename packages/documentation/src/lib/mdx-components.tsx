import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Heading } from "@hive/design-system/heading";
import { MdxImage } from "@hive/design-system/mdx-components";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { MDXLink } from "../../../design-system/src/mdx-components/mdx-link";
import { prefixBasePath } from "../../../design-system/src/mdx-components/prefix-base-path";

function createHeading(as: "h2" | "h3" | "h4" | "h5" | "h6") {
  return function MdxHeading(props: React.ComponentProps<"h2">) {
    return <Heading as={as} className="scroll-m-28" {...props} />;
  };
}

function MdxSource({
  src,
  type,
  ...props
}: ComponentPropsWithoutRef<"source"> & { src?: string }) {
  if (!src) {
    throw new Error("Must provide `src` prop");
  }
  let inferredType = type;
  if (!inferredType) {
    const ext = src.split(".").pop();
    if (ext) {
      inferredType = `video/${ext === "mov" ? "quicktime" : ext}`;
    }
  }
  return <source {...props} src={prefixBasePath(src)} type={inferredType} />;
}

function MdxVideoElement({
  children,
  className,
  poster,
  ...props
}: ComponentPropsWithoutRef<"video"> & { children?: ReactNode }) {
  return (
    <video
      autoPlay
      className={`mt-6 w-full ${className ?? ""}`}
      loop
      muted
      poster={prefixBasePath(poster)}
      {...props}
    >
      {children}
      Your browser does not support HTML video.
    </video>
  );
}

function MdxImg(props: React.ComponentProps<typeof MdxImage>) {
  return <MdxImage {...props} src={prefixBasePath(props.src)} />;
}

export const mdxComponents = {
  ...defaultMdxComponents,
  a: MDXLink,
  h2: createHeading("h2"),
  h3: createHeading("h3"),
  h4: createHeading("h4"),
  h5: createHeading("h5"),
  h6: createHeading("h6"),
  iframe: (props: ComponentPropsWithoutRef<"iframe">) => (
    // eslint-disable-next-line react/iframe-missing-sandbox
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className={`mt-6 aspect-video w-full ${props.className ?? ""}`}
      title="YouTube Video Player"
      {...props}
    />
  ),
  img: MdxImg,
  source: MdxSource,
  video: MdxVideoElement,
};
