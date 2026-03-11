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

import { tanstackDevStylesBasePathPlugin } from "./source-plugins/tanstack-dev-styles-base-path";

const BASE_PATH = "/graphql/hive-testing";
const NITRO_PRESET = process.env["VERCEL"]
  ? "vercel"
  : process.env["E2E"]
    ? "node-server"
    : "cloudflare-module";
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
    // `serve` is vite dev server, not prod
    command === "serve" && !process.env["E2E"] && devtools(),
    command === "serve" &&
      (process.env["HIVE_ENABLE_TANSTACK_DEV_STYLES_BASE_PATH"] === "1" ||
        !process.env["E2E"]) &&
      tanstackDevStylesBasePathPlugin(BASE_PATH),
    nitro({
      baseURL: BASE_PATH,
      entry:
        NITRO_PRESET === "cloudflare-module" ? CLOUDFLARE_ENTRY : undefined,
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
        host: "https://the-guild.dev/graphql/hive",
      },
      spa: {
        enabled: true,
        prerender: {
          crawlLinks: true,
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
    port: 1440,
  },
  ssr: {
    noExternal: ["@hive/design-system", "tailwind-merge"],
  },
}));
