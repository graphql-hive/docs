import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { transformerTwoslash } from "fumadocs-twoslash";
import rehypeMermaid, { type RehypeMermaidOptions } from "rehype-mermaid";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      langs: ["js", "jsx", "ts", "tsx"],
      themes: {
        dark: "github-dark",
        light: "github-light",
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash(),
      ],
    },
    rehypePlugins: (plugins) => [
      /**
       * Mermaid must run before Shiki to find unprocessed code blocks.
       */
      mermaidConfig(),
      ...plugins,
    ],
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
