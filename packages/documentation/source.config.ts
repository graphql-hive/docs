import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { transformerTwoslash } from "fumadocs-twoslash";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
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
    // mermaid must run before shiki (rehypeCode) to find raw code blocks
    rehypePlugins: (plugins) => [mermaidConfig(), ...plugins],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash(),
      ],
      langs: ["js", "jsx", "ts", "tsx"],
    },
  },
});

function mermaidConfig(): [typeof rehypeMermaid, RehypeMermaidOptions] {
  return [
    rehypeMermaid,
    {
      mermaidConfig: {
        fontFamily: "var(--font-sans)",
        theme: "neutral",
        look: "classic",
        flowchart: {
          defaultRenderer: "elk",
          padding: 6,
        },
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
