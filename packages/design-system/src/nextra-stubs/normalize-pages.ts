// Stub for nextra/normalize-pages

export interface PageItem {
  children?: PageItem[];
  name: string;
  route: string;
  title?: string;
  type?: string;
}

export interface NormalizedResult {
  activeIndex?: number;
  activePath?: PageItem[];
  activeThemeContext?: Record<string, unknown>;
  activeType?: string;
  directories?: PageItem[];
  docsDirectories?: PageItem[];
  flatDirectories?: PageItem[];
  flatDocsDirectories?: PageItem[];
  topLevelNavbarItems?: PageItem[];
}

export function normalizePages(_opts: { list: PageItem[]; route: string }): NormalizedResult {
  return {
    directories: [],
    docsDirectories: [],
    flatDirectories: [],
    flatDocsDirectories: [],
    topLevelNavbarItems: [],
  };
}
