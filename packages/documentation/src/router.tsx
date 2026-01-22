import { NotFound } from "@/components/not-found";
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

const TEXT_FILE_REGEX = /\.(txt|md|mdx)$/;

export function getRouter() {
  return createRouter({
    defaultNotFoundComponent: NotFound,
    defaultPreload: "intent",
    rewrite: {
      /**
       * Rewrite .txt, .md, and .mdx paths
       * so simple `curl http://localhost:1440/docs/article.txt` works.
       * Content negotiation is handled by the middleware in `src/start.ts`,
       * but we handle paths here to make sure accessing the raw text is foolproof.
       */
      input: ({ url }) => {
        if (TEXT_FILE_REGEX.test(url.pathname)) {
          url.pathname = `/llms.mdx${url.pathname.slice(0, url.pathname.lastIndexOf("."))}`;
        }
        return url;
      },
    },
    routeTree,
    scrollRestoration: true,
  });
}
