declare module "virtual:deployment-changelog-snapshot" {
  export const deploymentChangelogSnapshot: string;
}

declare module "virtual:deployment-changelog-toc" {
  export const deploymentChangelogToc: Array<{
    depth: number;
    title: string;
    url: string;
  }>;
}
