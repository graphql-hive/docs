import { redirect } from "@tanstack/react-router";
import { createMiddleware, createStart } from "@tanstack/react-start";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";

const { rewrite: rewriteMdx } = rewritePath(
  "/docs{/*path}.mdx",
  "/llms.mdx/docs{/*path}",
);
const { rewrite: rewriteMd } = rewritePath(
  "/docs{/*path}.md",
  "/llms.mdx/docs{/*path}",
);
const { rewrite: rewriteAccept } = rewritePath(
  "/docs{/*path}",
  "/llms.mdx/docs{/*path}",
);

const llmMiddleware = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url);

  const extensionPath = rewriteMdx(url.pathname) ?? rewriteMd(url.pathname);
  if (extensionPath) {
    throw redirect({ href: new URL(extensionPath, url).href });
  }

  if (isMarkdownPreferred(request)) {
    const acceptPath = rewriteAccept(url.pathname);
    if (acceptPath) {
      throw redirect({ href: new URL(acceptPath, url).href });
    }
  }

  return next();
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [llmMiddleware],
  };
});
