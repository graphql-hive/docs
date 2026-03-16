import { type } from "arktype";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import {
  defineCollections,
  defineConfig,
  defineDocs,
} from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { transformerTwoslash } from "fumadocs-twoslash";
import rehypeMermaid, { type RehypeMermaidOptions } from "rehype-mermaid";

import { autoImage, remarkAutoImage } from "./tools/source-plugins/auto-image";
import { remarkRelativeLinks } from "./tools/source-plugins/remark-relative-links";
import { DOCS_CODE_LANGS, DOCS_CODE_THEMES } from "./src/lib/docs-code-config";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    async: true,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

/** Product updates use shorthand `authors: [laurin]`, case studies use full objects. */
const author = type("string | object").pipe((v) =>
  typeof v === "string" ? { name: v } : (v as { name: string }),
);

/** YAML parses unquoted `date: 2025-01-27` as a Date object. Accept both. */
const dateString = type("string | Date").pipe((v) =>
  typeof v === "string" ? v : v.toISOString().split("T")[0]!,
);

export const caseStudies = defineCollections({
  async: true,
  dir: "content/case-studies",
  schema: type({
    authors: author.array().default(() => []),
    "canonical?": "string",
    category: "string",
    date: dateString,
    excerpt: "string",
    title: "string",
  }),
  type: "doc",
});

export const productUpdates = defineCollections({
  async: true,
  dir: "content/product-updates",
  schema: type({
    authors: author.array().default(() => []),
    "canonical?": "string",
    date: dateString,
    description: "string",
    title: "string",
  }),
  type: "doc",
});

/** Blog posts use shorthand `authors: [kamil]` and `tags: [graphql, hive]`. */
const stringOrStringArray = type("string | string[]").pipe((v) =>
  Array.isArray(v) ? v : [v],
);

export const blog = defineCollections({
  async: true,
  dir: "content/blog",
  schema: type({
    authors: stringOrStringArray,
    "canonical?": "string",
    date: dateString,
    "description?": "string",
    "featured?": "boolean",
    "image?": "string",
    "ogImage?": "string",
    tags: stringOrStringArray,
    title: "string",
  }),
  type: "doc",
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      langs: [...DOCS_CODE_LANGS],
      themes: DOCS_CODE_THEMES,
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash({ explicitTrigger: true }),
      ],
    },
    rehypePlugins: (plugins) => [
      /**
       * Mermaid must run before Shiki to find unprocessed code blocks.
       */
      mermaidConfig(),
      ...plugins,
    ],
    remarkImageOptions: {
      // Allow external images (e.g. GitHub user-attachments) to render without
      // explicit dimensions when fetching their size fails.
      // eslint-disable-next-line no-console -- intentional: surface image-size failures during build
      onError: console.warn,
    },
    remarkPlugins: (plugins) => [
      remarkAutoImage,
      remarkRelativeLinks,
      ...plugins,
    ],
  },
  plugins: [autoImage(), lastModified()],
});

function mermaidConfig(): [typeof rehypeMermaid, RehypeMermaidOptions] {
  return [
    rehypeMermaid,
    {
      mermaidConfig: {
        flowchart: {
          defaultRenderer: "elk",
          padding: 6,
        },
        fontFamily: "var(--font-sans)",
        look: "classic",
        theme: "neutral",
        themeCSS: `
          .node rect, .node circle, .node ellipse, .node polygon, .node path {
            fill: var(--mermaid-node-fill);
            stroke: var(--mermaid-node-stroke);
          }
          .label text, span, .label {
            fill: var(--mermaid-fg);
            color: var(--mermaid-fg);
          }
          .node circle.state-start {
            fill: var(--mermaid-fg-dim);
          }
          .nodeLabel, .statediagram-note .nodeLabel, .label div .edgeLabel  {
            color: var(--mermaid-fg);
          }
          .cluster rect {
            fill: var(--mermaid-cluster-fill);
            stroke: var(--mermaid-cluster-stroke);
          }
          .cluster text, .cluster span {
            fill: var(--mermaid-fg-dim);
            color: var(--mermaid-fg-dim);
          }
          .edgeLabel {
            background-color: var(--mermaid-edge-label-bg);
            color: var(--mermaid-fg);
          }
          .edgeLabel rect {
            fill: var(--mermaid-edge-label-bg);
            opacity: 0.85;
          }
          .edgeLabel p {
            background-color: var(--mermaid-edge-label-bg);
          }
          /* Edges and arrows */
          .flowchart-link {
            stroke: var(--mermaid-arrow);
          }
          .edgePath .path {
            stroke: var(--mermaid-arrow);
          }
          .marker {
            stroke: var(--mermaid-arrow);
            fill: var(--mermaid-arrow);
          }
          .arrowheadPath {
            fill: var(--mermaid-arrow);
          }
          .flowchartTitleText {
            fill: var(--mermaid-fg);
          }
          /* State diagrams */
          g.stateGroup rect {
            fill: var(--mermaid-node-fill);
            stroke: var(--mermaid-node-stroke);
          }
          g.stateGroup text {
            fill: var(--mermaid-fg);
          }
          g.stateGroup .state-title {
            fill: var(--mermaid-fg);
          }
          .transition {
            stroke: var(--mermaid-arrow);
          }
          .stateGroup .composit {
            fill: var(--mermaid-cluster-fill);
          }
          defs #statediagram-barbEnd {
            fill: var(--mermaid-arrow);
            stroke: var(--mermaid-arrow);
          }
          .actor {
            fill: var(--mermaid-node-fill);
            stroke: var(--mermaid-node-stroke);
          }
          text.actor > tspan {
            fill: var(--mermaid-fg);
          }
          .messageLine0, .messageLine1 {
            stroke: var(--mermaid-arrow);
          }
          defs marker#arrowhead path {
            fill: var(--mermaid-arrow);
            stroke: var(--mermaid-arrow);
          }
          defs marker#crosshead path {
            fill: var(--mermaid-arrow);
            stroke: var(--mermaid-arrow);
          }
          .messageText {
            fill: var(--mermaid-fg);
          }
          .labelBox {
            fill: var(--mermaid-edge-label-bg);
            stroke: var(--mermaid-node-stroke);
          }
          .labelText, .labelText > tspan {
            fill: var(--mermaid-fg);
          }
          .loopText, .loopText > tspan {
            fill: var(--mermaid-fg);
          }
          .loopLine {
            stroke: var(--mermaid-arrow);
          }
          line[id*="actor"] {
            stroke: var(--mermaid-arrow);
          }
          .note {
            fill: var(--mermaid-note-fill);
            stroke: var(--mermaid-note-stroke);
          }
          .noteText, .noteText > tspan {
            fill: var(--mermaid-note-fg);
          }
          .activation0 {
            fill: var(--mermaid-cluster-fill);
            stroke: var(--mermaid-node-stroke);
          }
        `,
      },
    },
  ];
}

declare module "fumadocs-core/source" {
  interface PageData {
    lastModified: Date | undefined;
  }
}
