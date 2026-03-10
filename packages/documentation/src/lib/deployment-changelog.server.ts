import { createServerFn } from "@tanstack/react-start";

import { getDeploymentChangelogCode } from "./deployment-changelog";

export const getChangelogCode = createServerFn({ method: "GET" }).handler(
  async (): Promise<string> => {
    return getDeploymentChangelogCode();
  },
);
