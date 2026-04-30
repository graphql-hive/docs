import { DurableObject } from "cloudflare:workers";
import { createSearchAPI, SearchAPI } from "fumadocs-core/search/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: any, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

function withCors(response: Response) {
  const headers = new Headers(response.headers);

  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
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

  async getSearchServer() {
    if (this.searchServer) {
      return this.searchServer;
    }

    if (!this.searchServerPromise) {
      this.searchServerPromise = (this as any).env.SEARCH_INDEX.get("search.json")
        .then(async (blob: any) => {
          if (!blob) {
            throw new Error("search.json not found in R2");
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
        headers: corsHeaders,
      });
    }

    try {
      const server = await this.getSearchServer();
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
  async fetch(request: Request, env: any) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const id = env.SEARCH_INDEX_OBJECT.idFromName("latest");
    const stub = env.SEARCH_INDEX_OBJECT.get(id);

    return stub.fetch(request);
  },
};
