// MDX module declarations
declare module "*.mdx" {
  import { ComponentType, ReactNode } from "react";

  export const frontmatter: Record<string, unknown>;

  interface MDXProps {
    children?: ReactNode;
    components?: Record<string, ComponentType>;
  }

  const MDXContent: ComponentType<MDXProps>;
  export default MDXContent;
}
