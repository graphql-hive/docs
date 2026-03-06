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

const BASE_PATH = "/graphql/hive-testing";

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
    nitro({
      baseURL: BASE_PATH,
      preset: process.env["VERCEL"]
        ? "vercel"
        : process.env["E2E"]
          ? "node-server"
          : "cloudflare-module",
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
});
