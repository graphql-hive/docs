import defaultMdxComponents from "fumadocs-ui/mdx";

import { MDXLink } from "../../../design-system/src/mdx-components/mdx-link";

export const mdxComponents = {
  ...defaultMdxComponents,
  a: MDXLink,
};
