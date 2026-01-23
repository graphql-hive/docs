import clsx from "clsx";
import { addBasePath } from "next/dist/client/add-base-path";
import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import fs from "node:fs/promises";
import path from "node:path";

const docsComponents = getDocsMDXComponents({
  iframe: ({ className, ...props }) => (
    // eslint-disable-next-line react/iframe-missing-sandbox -- YouTube requires allow-scripts + allow-same-origin
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className={clsx("mt-6 aspect-video w-full", className)}
      title="YouTube Video Player"
      {...props}
    />
  ),
  async source({ src, type, ...props }) {
    if (!src) {
      throw new Error("Must provide `src` prop");
    }
    if (src.startsWith("/")) {
      const filePath = path.join(process.cwd(), "public", src);
      try {
        await fs.access(filePath);
      } catch (error) {
        const relativePath = path.relative(process.cwd(), filePath);
        if (
          typeof error === "object" &&
          error &&
          "code" in error &&
          error.code === "ENOENT"
        ) {
          throw new Error(`File doesn't exist: ${relativePath}`);
        }
        throw new Error(`Error checking file: ${relativePath}`);
      }
    }

    let ext = path.extname(src).slice(1); // remove dot;
    if (ext === "mov") {
      ext = "quicktime";
    }
    return (
      <source {...props} src={addBasePath(src)} type={type || `video/${ext}`} />
    );
  },
  video: ({ children, className, ...props }) => (
    <video
      autoPlay
      className={clsx("mt-6 w-full", className)}
      loop
      muted
      {...props}
    >
      {children}
      Your browser does not support HTML video.
    </video>
  ),
});

export const useMDXComponents = (components?: object) => ({
  ...docsComponents,
  ...components,
});
