const ONE_HOUR = 3_600_000;

export type CacheState =
  | { markdown: string; status: "fresh" | "stale" }
  | { status: "missing" };

export type ChangelogState = {
  markdown: string;
  showGitHubCta: boolean;
};

export type ClientRenderState = ChangelogState & {
  shouldRefresh: boolean;
};

type MarkdownCache = {
  markdown: string;
  timestamp: number;
};

let markdownCache: MarkdownCache | null = null;

export function getFallbackState(snapshot: string): ChangelogState {
  return {
    markdown: snapshot,
    showGitHubCta: !snapshot,
  };
}

export function getCachedMarkdownState(now = Date.now()): CacheState {
  if (!markdownCache) {
    return { status: "missing" };
  }

  if (now - markdownCache.timestamp >= ONE_HOUR) {
    return {
      markdown: markdownCache.markdown,
      status: "stale",
    };
  }

  return {
    markdown: markdownCache.markdown,
    status: "fresh",
  };
}

export function getClientRenderState(
  snapshot: string,
  now = Date.now(),
): ClientRenderState {
  const cached = getCachedMarkdownState(now);

  if (cached.status === "fresh") {
    return {
      markdown: cached.markdown,
      shouldRefresh: false,
      showGitHubCta: false,
    };
  }

  if (cached.status === "stale") {
    return {
      markdown: cached.markdown,
      shouldRefresh: true,
      showGitHubCta: false,
    };
  }

  return {
    ...getFallbackState(snapshot),
    shouldRefresh: true,
  };
}

export function resolveStateAfterRefresh(
  previousState: ChangelogState,
  snapshot: string,
  markdown: string,
): ChangelogState {
  if (markdown) {
    return {
      markdown,
      showGitHubCta: false,
    };
  }

  return {
    markdown: previousState.markdown || snapshot,
    showGitHubCta: true,
  };
}

export function seedClientChangelogCache(
  markdown: string,
  timestamp = Date.now(),
) {
  markdownCache = {
    markdown,
    timestamp,
  };
}

export function resetClientChangelogCache() {
  markdownCache = null;
}
