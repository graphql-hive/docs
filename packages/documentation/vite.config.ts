import type { LoggingFunction, RollupLog } from "rollup";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsConfigPaths from "vite-tsconfig-paths";

import { deploymentChangelogPlugin } from "./tools/source-plugins/deployment-changelog-plugin";
import { tanstackDevStylesBasePathPlugin } from "./tools/source-plugins/tanstack-dev-styles-base-path";

const BASE_PATH = "/graphql/hive";

const NITRO_PRESET = process.env["VERCEL"] ? "vercel" : "cloudflare-module";
const CLOUDFLARE_ENTRY = fileURLToPath(
  new URL("src/server/cloudflare-entry.ts", import.meta.url),
);

export default defineConfig(async ({ command }) => ({
  base: BASE_PATH,
  build: {
    rollupOptions: {
      onwarn(warning: RollupLog, defaultHandler: LoggingFunction) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        defaultHandler(warning);
      },
    },
  },
  define: {
    BASE_PATH: JSON.stringify(BASE_PATH),
  },
  plugins: [
    command === "serve" && !process.env["CI"] && devtools(),
    command === "serve" && tanstackDevStylesBasePathPlugin(BASE_PATH),
    deploymentChangelogPlugin(),
    nitro({
      baseURL: BASE_PATH,
      cloudflare:
        NITRO_PRESET === "cloudflare-module"
          ? {
              wrangler: {
                assets: {
                  html_handling: "drop-trailing-slash",
                },
              },
            }
          : undefined,
      entry:
        NITRO_PRESET === "cloudflare-module" ? CLOUDFLARE_ENTRY : undefined,
      prerender: {
        ignore: [/[?&]utm_/],
      },
      preset: NITRO_PRESET,
      routeRules: await import("./redirects").then((m) => m.routeRules),
    }),
    mdx(await import("./source.config")),
    tailwindcss(),
    svgr({
      include: "**/*.svg?svgr",
      svgrOptions: {
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  minifyStyles: false,
                  removeTitle: false,
                  removeViewBox: false,
                },
              },
            },
            "removeXMLNS",
            "removeXlink",
            "prefixIds",
          ],
        },
      },
    }),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      prerender: {
        crawlLinks: true,
        enabled: true,
        retryCount: 10,
        retryDelay: 1000,
      },
      sitemap: {
        enabled: true,
        host: "https://the-guild.dev",
      },
      spa: {
        enabled: true,
        prerender: {
          crawlLinks: true,
          enabled: true,
        },
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
      "@hive/design-system": fileURLToPath(
        new URL("../design-system/src", import.meta.url),
      ),
    },
  },
  server: {
    // Vite will increment the port if 1440 is taken.
    port: 1440,
  },
  ssr: {
    noExternal: ["@hive/design-system", "tailwind-merge"],
  },
}));
