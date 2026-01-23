import { Anchor, cn, MarqueeRows } from "@hive/design-system";

// todo: a test that checks if none of the links here are 404
const terms = new Map<string[], string /* href */>([
  [["@stream", "@defer", "Incremental Delivery"], "/docs/gateway/defer-stream"],
  [
    ["APQ", "Automatic Persisted Queries"],
    "/docs/gateway/other-features/performance/automatic-persisted-queries",
  ],
  [
    ["authenticated", "requiresScopes", "policy"],
    "/docs/gateway/authorization-authentication#granular-protection-using-auth-directives-authenticated-requiresscopes-and-policy",
  ],
  [
    ["Authorization", "Authentication"],
    "/docs/gateway/authorization-authentication",
  ],
  [
    ["batching", "Request Batching"],
    "https://the-guild.dev/graphql/hive/docs/gateway/other-features/performance/request-batching",
  ],
  [
    ["Content-Encoding"],
    "/docs/gateway/other-features/performance/compression",
  ],
  [["Cost Limit"], "/docs/gateway/other-features/security/cost-limit"],
  [
    ["CSRF Prevention"],
    "/docs/gateway/other-features/security/csrf-prevention",
  ],
  [
    ["documentCache", "errorCache", "validationCache"],
    "/docs/gateway/other-features/performance",
  ],
  [
    ["executionCancellation"],
    "/docs/gateway/other-features/performance/execution-cancellation",
  ],
  [["Header Propagation"], "/docs/gateway/other-features/header-propagation"],
  [["HTTP Caching"], "/docs/gateway/other-features/performance/http-caching"],
  [["maskedErrors"], "/docs/gateway/logging-and-error-handling"],
  [["Monitoring", "Tracing"], "/docs/gateway/monitoring-tracing"],
  [
    ["parserAndValidationCache"],
    "/docs/gateway/other-features/performance/parsing-and-validation-caching",
  ],
  [["Persisted Documents"], "/docs/gateway/persisted-documents"],
  [["Persisted Documents"], "/docs/gateway/persisted-documents"],
  [["Rate Limiting"], "/docs/gateway/other-features/security/rate-limiting"],
  [
    ["Response Caching"],
    "/docs/gateway/other-features/performance/response-caching",
  ],
  [["Security"], "/docs/gateway/other-features/security"],
  [["Snapshots"], "/docs/gateway/other-features/testing/snapshot"],
  [["Subscriptions"], "/docs/gateway/subscriptions"],
  [["Supergraph", "Proxy"], "/docs/gateway/supergraph-proxy-source"],
  [
    ["Upstream Cancellation"],
    "/docs/gateway/other-features/performance/upstream-cancellation",
  ],
  [
    ["Usage Reporting"],
    "https://the-guild.dev/graphql/hive/docs/gateway/usage-reporting",
  ],
  [["useMock", "Mocking"], "/docs/gateway/other-features/testing/mocking"],
  [
    ["useRequestDeduplication"],
    "/docs/gateway/other-features/performance/deduplicate-request",
  ],
]);

export function GatewayMarqueeRows({
  className,
  ...rest
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <MarqueeRows
      className={cn(
        "flex max-w-full flex-col justify-center rounded-2xl p-4 pb-28",
        className,
      )}
      pauseOnHover
      rows={9}
      speed="slow"
      {...rest}
    >
      {inPlaceShuffle(
        [...terms.entries()].flatMap(([labels, href], j) =>
          labels.map((label, i) => (
            <Anchor
              className="hive-focus rounded-lg border border-transparent bg-(--pill-bg) px-2 py-1.5 text-[10px] text-(--pill-text) transition duration-500 hover:border-(--pill-hover-text) hover:bg-(--pill-bg-hover) hover:text-(--pill-text-hover) sm:px-4 sm:py-3 sm:text-sm"
              href={href}
              key={`${j}-${i}`}
            >
              {label}
            </Anchor>
          )),
        ),
      )}
    </MarqueeRows>
  );
}

/**
 * @see https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
function inPlaceShuffle<T>(xs: T[]): T[] {
  for (let i = xs.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = xs[i];
    xs[i] = xs[j];
    xs[j] = temp;
  }

  return xs;
}
