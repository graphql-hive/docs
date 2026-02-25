import type { Root } from "fumadocs-core/page-tree";
import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs";

import { DocsSidebar } from "@/components/docs-sidebar";
import { Navigation } from "@/components/navigation";

export function baseOptions(
  tree: Root,
  {
    className,
    style,
  }: { className?: string; style?: React.CSSProperties } = {},
): DocsLayoutProps {
  return {
    containerProps: {
      className,
      style: {
        gridTemplate: `"nav nav nav"
        "sidebar toc-popover toc"
        "sidebar main toc" 1fr / var(--fd-sidebar-col) minmax(0, 1fr) minmax(min-content, var(--fd-toc-width))`,
        ...style,
      },
    },
    nav: {
      component: <Navigation />,
    },
    searchToggle: {
      enabled: false,
    },
    sidebar: {
      component: <DocsSidebar />,
    },
    themeSwitch: {
      enabled: false,
    },
    tree,
  };
}
