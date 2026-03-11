import { createServerFn } from "@tanstack/react-start";

import { getDeploymentChangelogMarkdown } from "./deployment-changelog";

export const getChangelogMarkdown = createServerFn({ method: "GET" }).handler(
  async (): Promise<string> => {
    return (await getDeploymentChangelogMarkdown()) ?? "";
  },
);
