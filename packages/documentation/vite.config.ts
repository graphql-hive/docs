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

import { deploymentChangelogPlugin } from "./source-plugins/deployment-changelog-plugin";

const BASE_PATH = "/graphql/hive";

const NITRO_PRESET = process.env["VERCEL"] ? "vercel" : "cloudflare-module";
const CLOUDFLARE_ENTRY = fileURLToPath(
  new URL("src/server/cloudflare-entry.ts", import.meta.url),
);

export default defineConfig({
  base: BASE_PATH,
  build: {
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        defaultHandler(warning);
      },
    },
  },
  define: {
    BASE_PATH: JSON.stringify(BASE_PATH),
  },
  plugins: [
    !process.env["CI"] && devtools(),
    deploymentChangelogPlugin(),
    nitro({
      baseURL: BASE_PATH,
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
      pages: [{ path: "/api/search" }],
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
});
