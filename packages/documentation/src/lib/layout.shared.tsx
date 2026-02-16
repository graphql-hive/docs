import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { DocsSubnav } from "@/components/docs-subnav";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      component: <DocsSubnav />,
    },
    searchToggle: {
      components: {
        lg: null,
      },
    },
    themeSwitch: {
      mode: "light-dark-system",
    },
  };
}
