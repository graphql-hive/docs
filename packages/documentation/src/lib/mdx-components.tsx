import { Heading } from "@hive/design-system/heading";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { MDXLink } from "../../../design-system/src/mdx-components/mdx-link";

function createHeading(as: "h2" | "h3" | "h4" | "h5" | "h6") {
  return function MdxHeading(props: React.ComponentProps<"h2">) {
    return <Heading as={as} className="scroll-m-28" {...props} />;
  };
}

export const mdxComponents = {
  ...defaultMdxComponents,
  a: MDXLink,
  h2: createHeading("h2"),
  h3: createHeading("h3"),
  h4: createHeading("h4"),
  h5: createHeading("h5"),
  h6: createHeading("h6"),
};
