import type { AdvancedIndex } from "fumadocs-core/search/server";

import { createFileRoute } from "@tanstack/react-router";
import { createSearchAPI } from "fumadocs-core/search/server";

type R2BucketLike = {
  get(key: string): Promise<{ text(): Promise<string> } | null>;
};

type CloudflareEnvLike = {
  SEARCH_INDEXES?: R2BucketLike;
  SEARCH_INDEX_KEY?: string;
};

type CloudflareRuntimeRequest = Request & {
  runtime?: {
    cloudflare?: {
      env?: CloudflareEnvLike;
    };
  };
};

function getCloudflareEnv(request: Request): CloudflareEnvLike {
  const runtimeRequest = request as CloudflareRuntimeRequest;
  const runtimeEnv = runtimeRequest.runtime?.cloudflare?.env;
  const globalEnv = (globalThis as { __env__?: CloudflareEnvLike }).__env__;

  return runtimeEnv ?? globalEnv ?? {};
}

async function loadIndexesFromR2(request: Request): Promise<AdvancedIndex[]> {
  const env = getCloudflareEnv(request);
  const bucket = env.SEARCH_INDEXES;
  const indexKey = env.SEARCH_INDEX_KEY;

  if (!bucket) {
    throw new Error("SEARCH_INDEXES R2 binding is not configured");
  }

  if (!indexKey) {
    throw new Error("SEARCH_INDEX_KEY is not configured");
  }

  const objectKey = `search/${indexKey}.json`;

  const object = await bucket.get(objectKey);
  if (!object) {
    throw new Error(`R2 object not found: ${objectKey}`);
  }

  const raw = await object.text();
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error(`Invalid search index payload in R2 key: ${objectKey}`);
  }

  return parsed as AdvancedIndex[];
}

let searchAPIPromise: ReturnType<typeof createSearchAPI> | undefined;

async function getSearchAPI(request: Request) {
  if (!searchAPIPromise) {
    searchAPIPromise = createSearchAPI("advanced", {
      indexes: await loadIndexesFromR2(request),
      language: "english",
    });
  }

  return searchAPIPromise;
}

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const server = await getSearchAPI(request);
          return server.GET(request);
        } catch (error) {
          return Response.json(
            {
              error: "Search index unavailable",
              message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 503 },
          );
        }
      },
    },
  },
});
