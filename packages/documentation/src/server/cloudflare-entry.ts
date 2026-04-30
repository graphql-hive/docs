/* eslint-disable react-hooks/rules-of-hooks */
import "#nitro/virtual/polyfills";

import wsAdapter from "crossws/adapters/cloudflare";
import { useNitroApp, useNitroHooks } from "nitro/app";
import { runTask } from "nitro/task";

import { scheduledTasks } from "#nitro/virtual/tasks";

import { shouldTryAssetRequest } from "./cloudflare-routing";

type AssetFetcher = {
  fetch(request: Request): Promise<Response>;
};

type CloudflareEnv = Record<string, unknown> & {
  ASSETS?: AssetFetcher;
  SEARCH_API?: AssetFetcher;
  SEARCH_INDEX_KEY?: string;
};

type CloudflareContext = {
  waitUntil(promise: Promise<unknown>): void;
};

type RuntimeCloudflareContext = {
  context: CloudflareContext;
  env: CloudflareEnv;
};

type AugmentedRequest = Request & {
  ip?: string;
  runtime?: {
    cloudflare?: RuntimeCloudflareContext;
    name?: string;
  };
  waitUntil?: CloudflareContext["waitUntil"];
};

type ScheduledEvent = {
  cron: string;
};

type HandlerHooks = {
  fetch?: (
    request: Request,
    env: CloudflareEnv,
    context: CloudflareContext,
    url: URL,
    ctxExt: Record<string, unknown>,
  ) => Promise<Response | undefined> | Response | undefined;
};

type WebSocketHandler = {
  handleUpgrade(
    request: Request,
    env: CloudflareEnv,
    context: CloudflareContext,
  ): Promise<Response> | Response;
};

const LOCATION_HEADER = "location";
const SERVER_FN_ACCEPT =
  "application/x-tss-framed, application/x-ndjson, application/json";
const SERVER_FN_HEADER = "x-tsr-serverfn";
const SEARCH_WARM_PATH = "/__warm-search-index";
const nitroApp = useNitroApp();
const nitroHooks = useNitroHooks();
const importMeta = import.meta as ImportMeta & {
  _tasks?: boolean;
  _websocket?: boolean;
  baseURL?: string;
};
const baseURL = normalizeBaseURL(
  (typeof BASE_PATH === "string" && BASE_PATH) || importMeta.baseURL || "/",
);

let websocketHandlerPromise: Promise<WebSocketHandler | undefined> | undefined;

function normalizeBaseURL(pathname: string) {
  if (!/^\/[^/]/.test(pathname)) {
    return "";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function hasBasePath(pathname: string) {
  return pathname === baseURL || pathname.startsWith(`${baseURL}/`);
}

function withBasePath(pathname: string) {
  return pathname === "/" ? baseURL : `${baseURL}${pathname}`;
}

function normalizeDocsPathname(pathname: string) {
  return pathname !== "/docs/" && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

function shouldAliasMarkdownDocs(request: Request, pathname: string) {
  if (
    pathname !== "/docs" &&
    pathname !== "/docs/" &&
    !pathname.startsWith("/docs/")
  ) {
    return false;
  }

  if (/\.(md|mdx|txt)$/.test(pathname)) {
    return false;
  }

  const accept = request.headers.get("accept") || "";
  return accept.includes("text/markdown") || accept.includes("text/plain");
}

function stripBasePath(pathname: string) {
  const stripped = pathname.slice(baseURL.length);
  return stripped === "" ? "/" : stripped;
}

function isServerFnPath(pathname: string) {
  return (
    pathname === "/_serverFn" ||
    pathname.startsWith("/_serverFn/") ||
    (baseURL !== "" &&
      (pathname === `${baseURL}/_serverFn` ||
        pathname.startsWith(`${baseURL}/_serverFn/`)))
  );
}

function isSearchAPIPath(pathname: string) {
  const searchPathname = getSearchPathname(pathname);

  return searchPathname === "/api/search" || searchPathname.startsWith("/api/search/");
}

function getSearchPathname(pathname: string) {
  return baseURL !== "" && pathname.startsWith(`${baseURL}/api/search`)
    ? pathname.slice(baseURL.length)
    : pathname;
}

function getSearchAPIPathname(pathname: string) {
  const searchPathname = getSearchPathname(pathname);

  return searchPathname.slice("/api/search".length) || "/";
}

function isHTMLDocumentRequest(request: Request, pathname: string) {
  if (request.method !== "GET") {
    return false;
  }

  if (isSearchAPIPath(pathname) || isServerFnPath(pathname)) {
    return false;
  }

  return (request.headers.get("accept") || "").includes("text/html");
}

function createHandler(hooks: HandlerHooks) {
  return {
    email(message: unknown, env: CloudflareEnv, context: CloudflareContext) {
      (globalThis as { __env__?: CloudflareEnv }).__env__ = env;
      context.waitUntil(
        nitroHooks.callHook("cloudflare:email", {
          context,
          env,
          event: message,
          message,
        }) || Promise.resolve(),
      );
    },
    async fetch(
      request: Request,
      env: CloudflareEnv,
      context: CloudflareContext,
    ) {
      (globalThis as { __env__?: CloudflareEnv }).__env__ = env;
      augmentReq(request, { context, env });
      const url = new URL(request.url);
      const ctxExt = {};

      if (hooks.fetch) {
        const response = await hooks.fetch(request, env, context, url, ctxExt);
        if (response) {
          return response;
        }
      }

      return nitroApp.fetch(request);
    },
    queue(batch: unknown, env: CloudflareEnv, context: CloudflareContext) {
      (globalThis as { __env__?: CloudflareEnv }).__env__ = env;
      context.waitUntil(
        nitroHooks.callHook("cloudflare:queue", {
          batch,
          context,
          env,
          event: batch,
        }) || Promise.resolve(),
      );
    },
    scheduled(
      controller: ScheduledEvent,
      env: CloudflareEnv,
      context: CloudflareContext,
    ) {
      (globalThis as { __env__?: CloudflareEnv }).__env__ = env;
      context.waitUntil(
        nitroHooks.callHook("cloudflare:scheduled", {
          context,
          controller,
          env,
        }) || Promise.resolve(),
      );

      if (importMeta._tasks) {
        context.waitUntil(runCronTasks(controller, env, context));
      }
    },
    tail(traces: unknown, env: CloudflareEnv, context: CloudflareContext) {
      (globalThis as { __env__?: CloudflareEnv }).__env__ = env;
      context.waitUntil(
        nitroHooks.callHook("cloudflare:tail", {
          context,
          env,
          traces: traces as never,
        }) || Promise.resolve(),
      );
    },
    trace(traces: unknown, env: CloudflareEnv, context: CloudflareContext) {
      (globalThis as { __env__?: CloudflareEnv }).__env__ = env;
      context.waitUntil(
        nitroHooks.callHook("cloudflare:trace", {
          context,
          env,
          traces: traces as never,
        }) || Promise.resolve(),
      );
    },
  };
}

function augmentReq(request: Request, ctx: RuntimeCloudflareContext) {
  const req = request as AugmentedRequest;

  req.ip = request.headers.get("cf-connecting-ip") || undefined;
  req.runtime ??= { name: "cloudflare" };
  req.runtime.cloudflare = {
    ...req.runtime.cloudflare,
    ...ctx,
  };
  req.waitUntil = ctx.context.waitUntil.bind(ctx.context);
}

function aliasRequest(
  request: Request,
  url: URL,
  env: CloudflareEnv,
  context: CloudflareContext,
) {
  if (!baseURL || hasBasePath(url.pathname)) {
    return request;
  }

  const nextURL = new URL(request.url);
  nextURL.pathname = shouldAliasMarkdownDocs(request, url.pathname)
    ? withBasePath(`/llms.mdx${normalizeDocsPathname(url.pathname)}`)
    : withBasePath(url.pathname);

  const aliasedRequest = new Request(nextURL, request);
  augmentReq(aliasedRequest, { context, env });
  return aliasedRequest;
}

function ensureServerFnHeaders(
  request: Request,
  env: CloudflareEnv,
  context: CloudflareContext,
) {
  const url = new URL(request.url);

  if (!isServerFnPath(url.pathname)) {
    return request;
  }

  const headers = new Headers(request.headers);
  let changed = false;

  if (!headers.has(SERVER_FN_HEADER)) {
    headers.set(SERVER_FN_HEADER, "true");
    changed = true;
  }

  if (!headers.has("accept")) {
    headers.set("accept", SERVER_FN_ACCEPT);
    changed = true;
  }

  if (!changed) {
    return request;
  }

  const nextRequest = new Request(request, { headers });
  augmentReq(nextRequest, { context, env });
  return nextRequest;
}

function rewriteAliasedResponse(
  response: Response,
  isAliasedRequest: boolean,
  requestURL: URL,
) {
  if (!isAliasedRequest || !baseURL) {
    return response;
  }

  const location = response.headers.get(LOCATION_HEADER);
  if (!location) {
    return response;
  }

  const rewrittenLocation = rewriteLocation(location, requestURL);
  if (rewrittenLocation === location) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set(LOCATION_HEADER, rewrittenLocation);

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

function rewriteLocation(location: string, requestURL: URL) {
  if (!baseURL) {
    return location;
  }

  if (!location.startsWith("http")) {
    return hasBasePath(location) ? stripBasePath(location) : location;
  }

  const targetURL = new URL(location);
  if (
    targetURL.origin !== requestURL.origin ||
    !hasBasePath(targetURL.pathname)
  ) {
    return location;
  }

  targetURL.pathname = stripBasePath(targetURL.pathname);
  return `${targetURL.pathname}${targetURL.search}${targetURL.hash}`;
}

async function tryServeAsset(
  request: Request,
  env: CloudflareEnv,
  context: CloudflareContext,
  requestURL: URL,
  isAliasedRequest: boolean,
): Promise<Response | undefined> {
  if (
    !isAliasedRequest ||
    !env.ASSETS ||
    !shouldTryAssetRequest({
      baseURL,
      method: request.method,
      pathname: requestURL.pathname,
    })
  ) {
    return undefined;
  }

  augmentReq(request, { context, env });

  const assetResponse = await env.ASSETS.fetch(request);
  return assetResponse.status === 404 ? undefined : assetResponse;
}

function proxySearchAPI(request: Request, env: CloudflareEnv) {
  if (!env.SEARCH_API || !env.SEARCH_INDEX_KEY) {
    return;
  }

  const requestURL = new URL(request.url);
  const searchURL = new URL(
    getSearchAPIPathname(requestURL.pathname),
    "https://search-api.internal",
  );
  searchURL.search = requestURL.search;

  const headers = new Headers(request.headers);
  if (env.SEARCH_INDEX_KEY) {
    headers.set("x-search-index-key", env.SEARCH_INDEX_KEY);
  }

  const init: RequestInit & { duplex?: "half" } = {
    headers,
    method: request.method,
    redirect: request.redirect,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }

  return env.SEARCH_API.fetch(new Request(searchURL, init));
}

function warmSearchIndex(env: CloudflareEnv) {
  if (!env.SEARCH_API || !env.SEARCH_INDEX_KEY) {
    return;
  }

  return env.SEARCH_API.fetch(
    new Request(new URL(SEARCH_WARM_PATH, "https://search-api.internal"), {
      headers: {
        "x-search-index-key": env.SEARCH_INDEX_KEY,
      },
      method: "GET",
    }),
  );
}

async function getWebsocketHandler() {
  if (!importMeta._websocket) {
    return;
  }

  websocketHandlerPromise ??= Promise.resolve(
    wsAdapter({ resolve: resolveWebsocketHooks }) as WebSocketHandler,
  );

  return websocketHandlerPromise;
}

async function resolveWebsocketHooks(request: Request) {
  const hooks = (await nitroApp.fetch(request as never)) as {
    crossws?: Record<string, unknown>;
  };

  return hooks.crossws || {};
}

function getCronTasks(cron: string) {
  return scheduledTasks?.find((task) => task.cron === cron)?.tasks || [];
}

async function runCronTasks(
  controller: ScheduledEvent,
  env: CloudflareEnv,
  context: CloudflareContext,
) {
  return Promise.all(
    getCronTasks(controller.cron).map((name) =>
      runTask(name, {
        context: {
          cloudflare: {
            context,
            env,
          },
        },
        payload: {},
      }),
    ),
  );
}

// eslint-disable-next-line import/no-default-export -- Cloudflare worker entry
export default createHandler({
  async fetch(cfRequest, env, context, url) {
    const aliasedRequest = aliasRequest(cfRequest, url, env, context);
    const request = ensureServerFnHeaders(aliasedRequest, env, context);
    const requestURL = new URL(request.url);
    const isAliasedRequest = aliasedRequest !== cfRequest;

    if (isSearchAPIPath(requestURL.pathname)) {
      const searchAPIResponse = proxySearchAPI(request, env);
      if (searchAPIResponse) {
        return searchAPIResponse;
      }
    }

    if (isHTMLDocumentRequest(request, requestURL.pathname)) {
      const searchWarmResponse = warmSearchIndex(env);
      if (searchWarmResponse) {
        context.waitUntil(
          searchWarmResponse.catch(() => {
            // Non-critical warmup.
          }),
        );
      }
    }

    const assetResponse = await tryServeAsset(
      request,
      env,
      context,
      requestURL,
      isAliasedRequest,
    );
    if (assetResponse) {
      return rewriteAliasedResponse(
        assetResponse,
        isAliasedRequest,
        requestURL,
      );
    }

    if (
      importMeta._websocket &&
      request.headers.get("upgrade") === "websocket"
    ) {
      const websocketHandler = await getWebsocketHandler();
      if (websocketHandler) {
        return websocketHandler.handleUpgrade(request, env, context);
      }
    }

    return rewriteAliasedResponse(
      await nitroApp.fetch(request),
      isAliasedRequest,
      requestURL,
    );
  },
});
