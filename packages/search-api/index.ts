import { DurableObject } from "cloudflare:workers";
import { createSearchAPI, SearchAPI } from "fumadocs-core/search/server";

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function getCacheKey(request: Request, searchIndexKey: string) {
  const url = new URL(request.url);

  url.pathname = `/__search-cache/v1/${searchIndexKey}${url.pathname}`;
  url.search = new URLSearchParams(url.searchParams).toString();

  return new Request(url.toString(), {
    method: request.method,
    headers: {
      accept: request.headers.get("accept") ?? "",
    },
  });
}

function cacheableResponse(response: Response) {
  const headers = new Headers(response.headers);

  headers.set(
    "Cache-Control",
    `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}, immutable`,
  );

  headers.set("X-Search-Cache", "MISS");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function markCacheHit(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("X-Search-Cache", "HIT");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function json(data: any, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

function withCors(response: Response) {
  const headers = new Headers(response.headers);

  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function getSearchIndexKey(request: Request): string | null {
  const indexKey = request.headers.get("x-search-index-key");

  return indexKey ? `search/${indexKey}.json` : null;
}

export class SearchIndexObject extends DurableObject {
  private searchServer: SearchAPI | null;
  private searchServerPromise: Promise<SearchAPI> | null;
  private loadedAt: string | null;

  constructor(ctx: any, env: any) {
    super(ctx, env);

    this.searchServer = null;
    this.searchServerPromise = null;
    this.loadedAt = null;
  }

  async getSearchServer(searchIndexKey: string) {
    if (this.searchServer) {
      return this.searchServer;
    }

    if (!this.searchServerPromise) {
      this.searchServerPromise = (this as any).env.SEARCH_INDEX.get(
        searchIndexKey,
      )
        .then(async (blob: any) => {
          if (!blob) {
            throw new Error(`${searchIndexKey} not found in R2`);
          }

          const indexes = await blob.json();

          const server = createSearchAPI("advanced", {
            indexes,
            language: "english",
          });

          this.searchServer = server;
          this.loadedAt = new Date().toISOString();

          return server;
        })
        .catch((error: any) => {
          this.searchServerPromise = null;
          throw error;
        });
    }

    return this.searchServerPromise;
  }

  async fetch(request: Request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    const searchIndexKey = getSearchIndexKey(request);
    if (!searchIndexKey) {
      return json(
        {
          ok: false,
          error: "Missing x-search-index-key header",
        },
        { status: 400 },
      );
    }

    try {
      const server = await this.getSearchServer(searchIndexKey);
      if (!server) {
        throw new Error("Search Server not available");
      }
      const response = await server.GET(request);

      return withCors(response);
    } catch (error) {
      return json(
        {
          ok: false,
          error: error instanceof Error ? error.message : String(error),
          loadedAt: this.loadedAt,
        },
        { status: 500 },
      );
    }
  }
}

export default {
  async fetch(request: Request, env: any, ctx: any) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    const searchIndexKey = getSearchIndexKey(request);
    if (!searchIndexKey) {
      return json(
        {
          ok: false,
          error: "Missing x-search-index-key header",
        },
        { status: 400 },
      );
    }

    const requestURL = new URL(request.url);
    let hasQuery = requestURL.searchParams.has('query');

    const cache = caches.default;
    const cacheKey = getCacheKey(request, searchIndexKey);

    if (hasQuery) {
      const cached = await cache.match(cacheKey);
      if (cached) {
        return markCacheHit(cached);
      }
    }

    const id = env.SEARCH_INDEX_OBJECT.idFromName(searchIndexKey);
    const stub = env.SEARCH_INDEX_OBJECT.get(id);

    const response = await stub.fetch(request);

    if (!hasQuery) {
      return response;
    }

    const responseToReturn = cacheableResponse(response);

    if (responseToReturn.ok) {
      ctx.waitUntil(cache.put(cacheKey, responseToReturn.clone()));
    }

    return responseToReturn;
  },
};
