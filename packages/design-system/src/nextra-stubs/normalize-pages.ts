// Stub for nextra/normalize-pages

export interface PageItem {
  name: string;
  route: string;
  title?: string;
  type?: string;
  children?: PageItem[];
}

export interface NormalizedResult {
  activeType?: string;
  activeIndex?: number;
  activeThemeContext?: Record<string, unknown>;
  activePath?: PageItem[];
  directories?: PageItem[];
  flatDirectories?: PageItem[];
  docsDirectories?: PageItem[];
  flatDocsDirectories?: PageItem[];
  topLevelNavbarItems?: PageItem[];
}

export function normalizePages(_opts: { list: PageItem[]; route: string }): NormalizedResult {
  return {
    directories: [],
    flatDirectories: [],
    docsDirectories: [],
    flatDocsDirectories: [],
    topLevelNavbarItems: [],
  };
}
