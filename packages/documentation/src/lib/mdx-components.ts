import { MDXLink } from "@hive/design-system/server/mdx-components/mdx-link";
import defaultMdxComponents from "fumadocs-ui/mdx";

export const mdxComponents = {
  ...defaultMdxComponents,
  a: MDXLink,
};
