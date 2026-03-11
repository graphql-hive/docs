import type { ModuleNode, Plugin, ViteDevServer } from "vite";

const CSS_FILE_REGEX =
  /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;
const CSS_SIDE_EFFECT_FREE_PARAMS = ["url", "inline", "raw", "inline-css"];

function isCssFile(file: string) {
  return CSS_FILE_REGEX.test(file);
}

function hasCssSideEffectFreeParam(url: string) {
  const queryString = url.split("?")[1];

  if (!queryString) {
    return false;
  }

  const params = new URLSearchParams(queryString);

  return CSS_SIDE_EFFECT_FREE_PARAMS.some(
    (param) =>
      params.get(param) === "" &&
      !url.includes(`?${param}=`) &&
      !url.includes(`&${param}=`),
  );
}

async function collectDevStyles(options: {
  entries: string[];
  viteDevServer: ViteDevServer;
}) {
  const styles = new Map<string, string>();
  const visited = new Set<ModuleNode>();

  for (const entry of options.entries) {
    const normalizedPath = entry.replace(/\\/g, "/");
    let node = options.viteDevServer.moduleGraph.getModuleById(normalizedPath);

    if (!node) {
      try {
        await options.viteDevServer.transformRequest(normalizedPath);
      } catch {}

      node = options.viteDevServer.moduleGraph.getModuleById(normalizedPath);
    }

    if (node) {
      await crawlModuleForCss(options.viteDevServer, node, visited, styles);
    }
  }

  if (styles.size === 0) {
    return undefined;
  }

  return Array.from(styles.entries())
    .map(([fileName, css]) => `\n/* ${fileName} */\n${css}`)
    .join("\n");
}

async function crawlModuleForCss(
  viteDevServer: ViteDevServer,
  initialNode: ModuleNode,
  visited: Set<ModuleNode>,
  styles: Map<string, string>,
) {
  let node = initialNode;

  if (visited.has(node)) {
    return;
  }

  visited.add(node);

  if (!node.ssrTransformResult) {
    try {
      await viteDevServer.transformRequest(node.url, { ssr: true });
      const updatedNode = await viteDevServer.moduleGraph.getModuleByUrl(
        node.url,
      );

      if (updatedNode) {
        node = updatedNode;
      }
    } catch {}
  }

  if (
    node.file &&
    isCssFile(node.file) &&
    !hasCssSideEffectFreeParam(node.url)
  ) {
    const css = await loadCssContent(viteDevServer, node.url);

    if (css) {
      styles.set(node.url, css);
    }
  }

  const branches: Promise<void>[] = [];
  const urlsToVisit = new Set(node.ssrTransformResult?.deps ?? []);

  for (const importedNode of node.importedModules) {
    if (importedNode.file && isCssFile(importedNode.file)) {
      branches.push(
        crawlModuleForCss(viteDevServer, importedNode, visited, styles),
      );
      continue;
    }

    if (!urlsToVisit.has(importedNode.url)) {
      urlsToVisit.add(importedNode.url);
    }
  }

  for (const depUrl of urlsToVisit) {
    branches.push(
      (async () => {
        const depNode = await viteDevServer.moduleGraph.getModuleByUrl(depUrl);

        if (depNode) {
          await crawlModuleForCss(viteDevServer, depNode, visited, styles);
        }
      })(),
    );
  }

  await Promise.all(branches);
}

async function loadCssContent(viteDevServer: ViteDevServer, url: string) {
  const transformResult = await viteDevServer.transformRequest(url);

  if (!transformResult?.code) {
    return undefined;
  }

  const match = transformResult.code.match(
    /const\s+__vite__css\s*=\s*["'`]([\s\S]*?)["'`]/,
  );

  if (!match?.[1]) {
    return undefined;
  }

  return match[1]
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

export function tanstackDevStylesBasePathPlugin(basePath: string): Plugin {
  const devStylesPath = `${basePath}/@tanstack-start/styles.css`;

  return {
    apply: "serve",
    configureServer(viteDevServer) {
      viteDevServer.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";

        if (!url.startsWith(devStylesPath)) {
          next();
          return;
        }

        try {
          const routesParam = new URL(url, "http://localhost").searchParams.get(
            "routes",
          );
          const routeIds = routesParam ? routesParam.split(",") : [];
          const entries: string[] = [];
          const routesManifest = (
            globalThis as {
              TSS_ROUTES_MANIFEST?: Record<string, { filePath?: string }>;
            }
          ).TSS_ROUTES_MANIFEST;

          if (routesManifest && routeIds.length > 0) {
            for (const routeId of routeIds) {
              const route = routesManifest[routeId];
              if (route?.filePath) {
                entries.push(route.filePath);
              }
            }
          }

          const css =
            entries.length > 0
              ? await collectDevStyles({
                  viteDevServer,
                  entries,
                })
              : undefined;

          res.setHeader("Content-Type", "text/css");
          res.setHeader("Cache-Control", "no-store");
          res.end(css ?? "");
        } catch (error) {
          console.error("[hive] Error collecting dev styles:", error);
          res.setHeader("Content-Type", "text/css");
          res.setHeader("Cache-Control", "no-store");
          res.end(
            `/* Error collecting styles: ${
              error instanceof Error ? error.message : String(error)
            } */`,
          );
        }
      });
    },
    name: "hive:tanstack-start-dev-styles-base-path",
  };
}
