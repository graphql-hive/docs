import { createMiddleware, createStart } from "@tanstack/react-start";
import { rewritePath } from "fumadocs-core/negotiation";
import { redirect } from "@tanstack/react-router";

const { rewrite: rewriteMdx } = rewritePath(
  "/docs{/*path}.mdx",
  "llms.mdx/docs{/*path}",
);
const { rewrite: rewriteMd } = rewritePath(
  "/docs{/*path}.md",
  "llms.mdx/docs{/*path}",
);

const llmMiddleware = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url);
  const path = rewriteMdx(url.pathname) ?? rewriteMd(url.pathname);

  if (path) {
    throw redirect(new URL(path, url));
  }

  return next();
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [llmMiddleware],
  };
});
