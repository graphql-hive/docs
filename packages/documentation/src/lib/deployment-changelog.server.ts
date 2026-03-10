import { createServerFn } from "@tanstack/react-start";

import { fetchAndRenderChangelog } from "./deployment-changelog";

export const getChangelogHtml = createServerFn({ method: "GET" }).handler(
  async (): Promise<string> => {
    return fetchAndRenderChangelog();
  },
);
