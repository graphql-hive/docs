// MDX module declarations
declare module "*.mdx" {
  import type { MDXComponents } from "mdx/types";

  import { ComponentType, ReactNode } from "react";

  export const frontmatter: Record<string, unknown>;

  interface MDXProps {
    children?: ReactNode;
    components?: MDXComponents;
  }

  const MDXContent: ComponentType<MDXProps>;
  export default MDXContent;
}
