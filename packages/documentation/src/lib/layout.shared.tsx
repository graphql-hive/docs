import type { Root } from "fumadocs-core/page-tree";
import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs";

import { Navigation } from "@/components/navigation";

export function baseOptions(tree: Root): DocsLayoutProps {
  return {
    nav: {
      component: <Navigation />,
    },
    searchToggle: {
      components: {
        lg: null,
      },
    },
    themeSwitch: {
      mode: "light-dark-system",
    },
    tree,
  };
}
