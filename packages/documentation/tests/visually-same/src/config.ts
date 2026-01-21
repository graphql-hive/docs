export interface PageConfig {
  name: string;
  path: string;
}

export interface CompareConfig {
  baseUrl: string;
  diffColor: string;
  odiffThreshold: number;
  pages: PageConfig[];
  productionUrl: string;
  screenshotsDir: string;
  viewport: { height: number; width: number };
}

export const config: CompareConfig = {
  baseUrl: "http://localhost:1440",
  diffColor: "#cd2cc9",
  odiffThreshold: 0.1,
  pages: [
    { name: "landing", path: "/" },
  ],
  productionUrl: "https://the-guild.dev/graphql/hive",
  screenshotsDir: new URL("../screenshots", import.meta.url).pathname,
  viewport: { height: 900, width: 1440 },
};
