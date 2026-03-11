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

import { extractFilteredChangelogToc } from "./src/lib/changelog-toc";

const BASE_PATH = "/graphql/hive-testing";
const DEPLOYMENT_CHANGELOG_SNAPSHOT_ID =
  "virtual:deployment-changelog-snapshot";
const DEPLOYMENT_CHANGELOG_TOC_ID = "virtual:deployment-changelog-toc";
const NITRO_PRESET = process.env["VERCEL"] ? "vercel" : "cloudflare-module";
const CLOUDFLARE_ENTRY = fileURLToPath(
  new URL("src/server/cloudflare-entry.ts", import.meta.url),
);
const DEFAULT_CHANGELOG_URL =
  "https://raw.githubusercontent.com/graphql-hive/console/main/deployment/CHANGELOG.md";

function stripTopLevelHeading(markdown: string) {
  return markdown.replace(/^#\s+.*\n/, "");
}

async function getDeploymentChangelogSnapshot() {
  try {
    const res = await fetch(
      process.env["DEPLOYMENT_CHANGELOG_URL"] ?? DEFAULT_CHANGELOG_URL,
    );
    if (!res.ok) return "";
    return stripTopLevelHeading(await res.text());
  } catch {
    return "";
  }
}

function deploymentChangelogPlugin() {
  const resolvedSnapshotId = `\0${DEPLOYMENT_CHANGELOG_SNAPSHOT_ID}`;
  const resolvedTocId = `\0${DEPLOYMENT_CHANGELOG_TOC_ID}`;
  let snapshotPromise: Promise<string> | undefined;

  return {
    name: "deployment-changelog",
    resolveId(source: string) {
      if (source === DEPLOYMENT_CHANGELOG_SNAPSHOT_ID)
        return resolvedSnapshotId;
      if (source === DEPLOYMENT_CHANGELOG_TOC_ID) return resolvedTocId;
      return null;
    },
    load(id: string) {
      if (id === resolvedSnapshotId) {
        snapshotPromise ||= getDeploymentChangelogSnapshot();
        return snapshotPromise.then(
          (snapshot) =>
            `export const deploymentChangelogSnapshot = ${JSON.stringify(snapshot)};`,
        );
      }
      if (id === resolvedTocId) {
        snapshotPromise ||= getDeploymentChangelogSnapshot();
        return snapshotPromise.then((snapshot) => {
          const toc = extractFilteredChangelogToc(snapshot);
          return `export const deploymentChangelogToc = ${JSON.stringify(toc)};`;
        });
      }
      return null;
    },
  };
}

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
    port: 1440,
  },
  ssr: {
    noExternal: ["@hive/design-system", "tailwind-merge"],
  },
});
