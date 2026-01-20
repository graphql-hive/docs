import { redirect } from "@tanstack/react-router";
import { createMiddleware, createStart } from "@tanstack/react-start";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";

const extensionRewrites = [
  rewritePath("/docs.:ext", "/llms.mdx/docs"),
  rewritePath("/docs/*path.:ext", "/llms.mdx/docs/*path"),
];

const acceptRewrites = [
  rewritePath("/docs", "/llms.mdx/docs"),
  rewritePath("/docs{/*path}", "/llms.mdx/docs{/*path}"),
];

function tryRewrite(
  pathname: string,
  configs: { rewrite: (path: string) => false | string }[],
): false | string {
  for (const { rewrite } of configs) {
    const result = rewrite(pathname);
    if (result) return result;
  }
  return false;
}

const llmMiddleware = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url);

  const extensionPath = tryRewrite(url.pathname, extensionRewrites);
  if (extensionPath) {
    throw redirect({ href: new URL(extensionPath, url).href });
  }

  if (isMarkdownPreferred(request)) {
    const acceptPath = tryRewrite(url.pathname, acceptRewrites);
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
