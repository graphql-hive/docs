import { createMiddleware, createStart } from "@tanstack/react-start";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";

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

  if (isMarkdownPreferred(request)) {
    const acceptPath = tryRewrite(url.pathname, acceptRewrites);
    if (acceptPath) {
      const nextUrl = new URL(acceptPath, url);
      const nextRequest = new Request(nextUrl, request);
      return fetch(nextRequest);
    }
  }

  return next();
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [llmMiddleware],
  };
});
