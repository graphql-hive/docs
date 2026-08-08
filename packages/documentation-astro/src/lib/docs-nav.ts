import { getCollection } from "astro:content";

interface MetaJson {
  icon?: string;
  pages?: string[];
  title?: string;
}

interface DocsNav {
  order: string[];
  sectionMeta: Map<string, { icon?: string; title?: string }>;
  titleOverrides: Map<string, string>;
}

const metaModules = import.meta.glob<{ default: MetaJson }>(
  "../../../documentation/content/docs/**/meta.json",
  { eager: true },
);

function dirOfMetaPath(fullPath: string) {
  const marker = "/content/docs/";
  const rel = fullPath.slice(fullPath.indexOf(marker) + marker.length);
  return rel.replace(/(^|\/)meta\.json$/, "");
}

const metaByDir = new Map<string, MetaJson>();
for (const [path, mod] of Object.entries(metaModules)) {
  metaByDir.set(dirOfMetaPath(path), mod.default);
}

function toSlug(id: string) {
  return id.replace(/(^|\/)index$/, "").replace(/\.(md|mdx)$/, "");
}

function hrefToSlug(href: string) {
  return href.replace(/^\/docs\/?/, "").replace(/\/$/, "");
}

function parseBracket(entry: string) {
  const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(entry);
  if (!match) return undefined;
  return { href: match[2]!, title: match[1]! };
}

function analyzeDir(dir: string, slugs: Set<string>) {
  const prefix = dir ? `${dir}/` : "";
  const folders = new Set<string>();
  const files = new Set<string>();
  let hasOwnIndex = false;

  for (const slug of slugs) {
    if (slug === dir) {
      hasOwnIndex = true;
      continue;
    }
    if (!slug.startsWith(prefix)) continue;
    const rest = slug.slice(prefix.length);
    const slashIndex = rest.indexOf("/");
    if (slashIndex === -1) files.add(rest);
    else folders.add(rest.slice(0, slashIndex));
  }

  return { files, folders, hasOwnIndex };
}

function resolveDir(dir: string, slugs: Set<string>, order: string[], titleOverrides: Map<string, string>) {
  const { files, folders, hasOwnIndex } = analyzeDir(dir, slugs);
  const meta = metaByDir.get(dir);
  const pages = meta?.pages ?? (hasOwnIndex ? ["index", "..."] : ["..."]);

  const referenced = new Set<string>();
  for (const entry of pages) {
    if (entry === "..." || entry === "index") continue;
    const bracket = parseBracket(entry);
    if (bracket) {
      const slug = hrefToSlug(bracket.href);
      if (slug !== dir) {
        const rest = slug.startsWith(dir ? `${dir}/` : "") ? slug.slice(dir ? dir.length + 1 : 0) : undefined;
        const top = rest?.split("/")[0];
        if (top) referenced.add(top);
      }
      continue;
    }
    referenced.add(entry);
  }

  const emitChild = (name: string) => {
    const childDir = dir ? `${dir}/${name}` : name;
    if (folders.has(name)) {
      resolveDir(childDir, slugs, order, titleOverrides);
    } else if (files.has(name)) {
      order.push(childDir);
    }
  };

  for (const entry of pages) {
    if (entry === "...") {
      const remaining = [...folders, ...files].filter((name) => !referenced.has(name)).sort();
      for (const name of remaining) emitChild(name);
      continue;
    }
    if (entry === "index") {
      if (hasOwnIndex) order.push(dir);
      continue;
    }
    const bracket = parseBracket(entry);
    if (bracket) {
      const slug = hrefToSlug(bracket.href);
      titleOverrides.set(slug, bracket.title);
      if (slug !== dir && folders.has(slug.startsWith(dir ? `${dir}/` : "") ? slug.slice(dir ? dir.length + 1 : 0) : "")) {
        resolveDir(slug, slugs, order, titleOverrides);
      } else {
        order.push(slug);
      }
      continue;
    }
    emitChild(entry);
  }
}

function iconRawSvg(iconName: string) {
  const fileName = iconName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return iconModules[`../../../design-system/src/icons/${fileName}.svg`];
}

const iconModules = import.meta.glob<string>("../../../design-system/src/icons/*.svg", {
  eager: true,
  import: "default",
  query: "?raw",
});

let cached: DocsNav | undefined;

export async function getDocsNav(): Promise<DocsNav> {
  if (cached) return cached;

  const entries = await getCollection("docs");
  const slugs = new Set(entries.map((entry) => toSlug(entry.id)));

  const order: string[] = [];
  const titleOverrides = new Map<string, string>();
  resolveDir("", slugs, order, titleOverrides);

  const sectionMeta = new Map<string, { icon?: string; title?: string }>();
  for (const [dir, meta] of metaByDir) {
    if (!dir || dir.includes("/")) continue;
    const section = dir.replaceAll("-", " ");
    sectionMeta.set(section, {
      icon: meta.icon ? iconRawSvg(meta.icon) : undefined,
      title: meta.title ?? section.replace(/\b\w/g, (char) => char.toUpperCase()),
    });
  }

  cached = { order, sectionMeta, titleOverrides };
  return cached;
}
