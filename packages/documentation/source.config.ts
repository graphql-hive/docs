import { type } from "arktype";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import {
  defineCollections,
  defineConfig,
  defineDocs,
} from "fumadocs-mdx/config";
import { transformerTwoslash } from "fumadocs-twoslash";
import rehypeMermaid, { type RehypeMermaidOptions } from "rehype-mermaid";

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
    date: dateString,
    description: "string",
    title: "string",
  }),
  type: "doc",
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      langs: [
        "bash",
        "diff",
        "dockerfile",
        "go",
        "graphql",
        "javascript",
        "js",
        "json",
        "json5",
        "jsonc",
        "jsx",
        "php",
        "python",
        "ruby",
        "rust",
        "sh",
        "toml",
        "ts",
        "tsx",
        "typescript",
        "yaml",
      ],
      themes: {
        dark: "github-dark",
        light: "github-light",
      },
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
  },
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
          .node rect {
            fill: var(--mermaid-node-fill);
            stroke: var(--mermaid-node-stroke);
          }
          .label text, span {
            fill: var(--color-neutral-900);
            color: var(--color-neutral-900);
          }
          .flowchart-link {
            stroke: var(--mermaid-arrow);
          }
          .marker {
            stroke: var(--mermaid-arrow);
            fill: var(--mermaid-arrow);
          }
        `,
      },
    },
  ];
}
