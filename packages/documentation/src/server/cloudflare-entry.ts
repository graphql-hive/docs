/* eslint-disable react-hooks/rules-of-hooks */
import "#nitro/virtual/polyfills";

import wsAdapter from "crossws/adapters/cloudflare";
import { useNitroApp, useNitroHooks } from "nitro/app";
import { runTask } from "nitro/task";

import { isPublicAssetURL } from "#nitro/virtual/public-assets";
import { scheduledTasks } from "#nitro/virtual/tasks";

type AssetFetcher = {
  fetch(request: Request): Promise<Response>;
};

type CloudflareEnv = Record<string, unknown> & {
  ASSETS?: AssetFetcher;
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
  return pathname === "/" ? `${baseURL}/` : `${baseURL}${pathname}`;
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
    // Serve /sitemap.xml from the base-prefixed path where TanStack Start generates it
    if (url.pathname === "/sitemap.xml" && env.ASSETS) {
      const sitemapUrl = new URL(cfRequest.url);
      sitemapUrl.pathname = withBasePath("/sitemap.xml");
      return env.ASSETS.fetch(new Request(sitemapUrl, cfRequest));
    }

    const aliasedRequest = aliasRequest(cfRequest, url, env, context);
    const request = ensureServerFnHeaders(aliasedRequest, env, context);
    const requestURL = new URL(request.url);
    const isAliasedRequest = aliasedRequest !== cfRequest;

    if (env.ASSETS && isPublicAssetURL(requestURL.pathname)) {
      return rewriteAliasedResponse(
        await env.ASSETS.fetch(request),
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
