import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

import { remarkRelativeLinks } from "./src/markdown/remark-relative-links.mjs";

export default defineConfig({
  integrations: [
    mdx({
      processor: unified({ remarkPlugins: [remarkRelativeLinks] }),
    }),
  ],
  publicDir: fileURLToPath(new URL("../documentation/public", import.meta.url)),
  vite: {
    resolve: {
      alias: [
        alias(
          "@hive/design-system/hive-components/callout",
          "./src/mdx-shims/callout.ts",
        ),
        alias("@hive/design-system/tabs", "./src/mdx-shims/tabs.ts"),
        alias("@hive/design-system/image", "./src/mdx-shims/image.ts"),
        alias(
          "@hive/design-system/hive-components/card",
          "./src/mdx-shims/card.ts",
        ),
        alias(
          "@hive/design-system/hive-components/screenshot",
          "./src/mdx-shims/screenshot.ts",
        ),
        alias(
          "@hive/design-system/call-to-action",
          "./src/mdx-shims/call-to-action.ts",
        ),
        alias(
          "@hive/design-system/contact-us",
          "./src/mdx-shims/contact-us.ts",
        ),
        alias(
          "@hive/design-system/mdx-components/mdx-video",
          "./src/mdx-shims/video.ts",
        ),
        alias(
          "@hive/design-system/youtube-iframe",
          "./src/mdx-shims/youtube-iframe.ts",
        ),
        alias(
          "@hive/design-system/hive-components/cli-errors",
          "./src/mdx-shims/cli-errors.ts",
        ),
        alias("fumadocs-ui/components/steps", "./src/mdx-shims/steps.ts"),
        alias("fumadocs-ui/components/files", "./src/mdx-shims/files.ts"),
        alias("fumadocs-ui/components/callout", "./src/mdx-shims/callout.ts"),
        alias(
          "#components/otel-metrics/metrics-section",
          "./src/mdx-shims/metrics-section.ts",
        ),
        alias("#components/large-callout", "./src/mdx-shims/large-callout.ts"),
        alias("#components/lede", "./src/mdx-shims/lede.ts"),
        alias("#components/small-avatar", "./src/mdx-shims/small-avatar.ts"),
        alias(
          "@/components/deployment-changelog",
          "./src/mdx-shims/changelog.ts",
        ),
        alias(
          "virtual:deployment-changelog-toc",
          "./src/mdx-shims/changelog-toc.ts",
        ),
        {
          find: /.*\/src\/components\/arrow-icon\.tsx$/,
          replacement: fileURLToPath(
            new URL("./src/mdx-shims/arrow-icon.ts", import.meta.url),
          ),
        },
      ],
    },
  },
});

function alias(find, path) {
  return {
    find,
    replacement: fileURLToPath(new URL(path, import.meta.url)),
  };
}
