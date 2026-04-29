import type {
  DocCollectionEntry,
  MetaCollectionEntry,
} from "fumadocs-mdx/runtime/server";

import {
  HiveGatewayIcon,
  HiveIcon,
  HiveRouterIcon,
} from "@hive/design-system/icons";
import {
  loader,
  type LoaderPlugin,
  type MetaData,
  type PageData,
  type Source,
} from "fumadocs-core/source";
import { icons } from "lucide-react";
import { createElement, type ReactNode } from "react";

const hiveIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Hive: HiveIcon,
  HiveGateway: HiveGatewayIcon,
  HiveRouter: HiveRouterIcon,
};

function resolveIcon(icon: string | undefined): ReactNode | undefined {
  if (!icon) return undefined;
  if (icon in hiveIcons) {
    return createElement(hiveIcons[icon]!, { height: 16, width: 16 });
  }
  if (icon in icons) {
    return createElement(icons[icon as keyof typeof icons]);
  }
  return undefined;
}

function replaceIcon<T extends { icon?: ReactNode }>(node: T): T {
  if (node.icon === undefined || typeof node.icon === "string") {
    node.icon = resolveIcon(node.icon as string | undefined);
  }
  return node;
}

function hiveIconsPlugin(): LoaderPlugin {
  return {
    name: "hive:icons",
    transformPageTree: {
      file: replaceIcon,
      folder: replaceIcon,
      separator: replaceIcon,
    },
  };
}

/**
  * This plugin allows to change the label of the page visible in the sidebar navigation,
  * without changing the page title displayed on the tab.
  *
  * @example
  * ```
  * ---
  * title: "Title displayed on the page and the tab"
  * sidebarTitle: "Title displayed in the sidebar navigation"
  * ---
  * ```
**/
function sidebarTitlePlugin(): LoaderPlugin {
  return {
    name: "hive:sidebarTitle",
    transformStorage: ({ storage }) => {
      for (const path of storage.getFiles()) {
        const file = storage.read(path);
        if (!file || file.format !== "page") continue;

        const pageData = file.data as PageData & { sidebarTitle?: unknown };
        if (typeof pageData.sidebarTitle === "string" && pageData.sidebarTitle.length > 0) {
          pageData.title = pageData.sidebarTitle;
        }
      }
    }
  };
}

function createSource(docs: { toFumadocsSource(): unknown }) {
  const docsSource = docs.toFumadocsSource() as Source<{
    metaData: MetaCollectionEntry<MetaData>;
    pageData: DocCollectionEntry<"docs", PageData>;
  }>;
  return loader({
    baseUrl: "/docs",
    plugins: [hiveIconsPlugin(), sidebarTitlePlugin()],
    source: docsSource,
  });
}

export type DocsSource = ReturnType<typeof createSource>;

let _source: DocsSource | undefined;

export async function getSource(): Promise<DocsSource> {
  if (!_source) {
    const { docs } = await import("fumadocs-mdx:collections/server");
    _source = createSource(docs);
  }
  return _source;
}

export async function getSerializedPageTree() {
  const source = await getSource();
  return source.serializePageTree(source.getPageTree());
}
