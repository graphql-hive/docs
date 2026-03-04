import type { GlobalConfig } from "fumadocs-mdx/config";

/**
 * Fumadocs MDX plugin + remark plugin that auto-detects colocated blog images
 * (header-image.* and opengraph-image.png) and exposes them as
 * Vite-resolved asset URLs on collection entries.
 *
 * The remark plugin injects `export { default as X } from './file'`
 * so images go through Vite's asset pipeline (hashing, optimization).
 *
 * The resolved URLs are available after `entry.load()` via passthroughs.
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

const HEADER_IMAGE_NAMES = [
  "header-image.webp",
  "header-image.png",
  "header-image.jpg",
];
const OG_IMAGE_NAME = "opengraph-image.png";

type FumadocsPlugin = NonNullable<GlobalConfig["plugins"]>[number];

const EXTEND_TYPES = `{
  _headerImage?: string;
  _ogImage?: string;
}`;

/**
 * Fumadocs plugin that registers passthroughs and extends types
 * so `_headerImage` and `_ogImage` are available on collection entries.
 */
export function autoImage(): FumadocsPlugin {
  return {
    "index-file": {
      generateTypeConfig() {
        const lines: string[] = ["{", "  DocData: {"];
        for (const collection of this.core.getCollections()) {
          lines.push(`    ${collection.name}: ${EXTEND_TYPES},`);
        }
        lines.push("  }", "}");
        return lines.join("\n");
      },
      serverOptions(opts) {
        opts.doc ??= {};
        opts.doc.passthroughs ??= [];
        opts.doc.passthroughs.push("_headerImage", "_ogImage");
      },
    },
    name: "auto-image",
  };
}

/**
 * Remark plugin that injects image re-exports into MDX.
 * Generates: `export { default as _headerImage } from './header-image.webp'`
 * Vite resolves the import to an asset URL.
 *
 * Register in `source.config.ts` remarkPlugins.
 */
export function remarkAutoImage() {
  return remarkAutoImageTransform;
}

function remarkAutoImageTransform(
  tree: { children: unknown[] },
  file: { history?: string[]; path?: string },
) {
  const filePath = file.path ?? file.history?.[0];
  if (!filePath) return;

  const dir = dirname(filePath);

  // Check for header image
  for (const name of HEADER_IMAGE_NAMES) {
    if (existsSync(join(dir, name))) {
      tree.children.unshift(createReExportNode("_headerImage", `./${name}`));
      break;
    }
  }

  // Check for OG image
  if (existsSync(join(dir, OG_IMAGE_NAME))) {
    tree.children.unshift(createReExportNode("_ogImage", `./${OG_IMAGE_NAME}`));
  }
}

/** Creates an mdxjsEsm AST node: `export { default as <name> } from '<source>'` */
function createReExportNode(name: string, source: string) {
  return {
    data: {
      estree: {
        body: [
          {
            declaration: null,
            source: {
              raw: JSON.stringify(source),
              type: "Literal" as const,
              value: source,
            },
            specifiers: [
              {
                exported: { name, type: "Identifier" as const },
                local: { name: "default", type: "Identifier" as const },
                type: "ExportSpecifier" as const,
              },
            ],
            type: "ExportNamedDeclaration" as const,
          },
        ],
        sourceType: "module" as const,
        type: "Program" as const,
      },
    },
    type: "mdxjsEsm" as const,
    value: "",
  };
}
