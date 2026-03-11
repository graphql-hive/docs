export interface PageConfig {
  name: string;
  path: string;
}

export interface CompareConfig {
  baseUrl: string;
  diffColor: string;
  odiffThreshold: number;
  pages: PageConfig[];
  productionUrl: string;
  screenshotsDir: string;
  viewport: { height: number; width: number };
}

export const config: CompareConfig = {
  baseUrl: "http://localhost:1440",
  diffColor: "#cd2cc9",
  odiffThreshold: 0.1,
  pages: [
    // All 171 /docs pages from old site
    { name: "docs-index", path: "/docs" },
    { name: "api-reference-cli", path: "/docs/api-reference/cli" },
    { name: "api-reference-client", path: "/docs/api-reference/client" },
    {
      name: "api-reference-gateway-cli",
      path: "/docs/api-reference/gateway-cli",
    },
    {
      name: "api-reference-gateway-config",
      path: "/docs/api-reference/gateway-config",
    },
    {
      name: "api-reference-graphql-api",
      path: "/docs/api-reference/graphql-api",
    },
    {
      name: "api-reference-graphql-api-access-token-management",
      path: "/docs/api-reference/graphql-api/access-token-management",
    },
    {
      name: "api-reference-graphql-api-contract-management",
      path: "/docs/api-reference/graphql-api/contract-management",
    },
    {
      name: "api-reference-graphql-api-member-management",
      path: "/docs/api-reference/graphql-api/member-management",
    },
    {
      name: "api-reference-graphql-api-project-management",
      path: "/docs/api-reference/graphql-api/project-management",
    },
    {
      name: "api-reference-graphql-api-target-management",
      path: "/docs/api-reference/graphql-api/target-management",
    },
    {
      name: "api-reference-graphql-api-unused-deprecated-schema",
      path: "/docs/api-reference/graphql-api/unused-deprecated-schema",
    },
    {
      name: "api-reference-link-specifications",
      path: "/docs/api-reference/link-specifications",
    },
    {
      name: "api-reference-php-client",
      path: "/docs/api-reference/php-client",
    },
    {
      name: "api-reference-ruby-client",
      path: "/docs/api-reference/ruby-client",
    },
    {
      name: "api-reference-rust-client",
      path: "/docs/api-reference/rust-client",
    },
    {
      name: "api-reference-usage-reports",
      path: "/docs/api-reference/usage-reports",
    },
    { name: "gateway", path: "/docs/gateway" },
    {
      name: "gateway-authorization-authentication",
      path: "/docs/gateway/authorization-authentication",
    },
    { name: "gateway-defer-stream", path: "/docs/gateway/defer-stream" },
    { name: "gateway-deployment", path: "/docs/gateway/deployment" },
    {
      name: "gateway-deployment-docker",
      path: "/docs/gateway/deployment/docker",
    },
    {
      name: "gateway-deployment-node-frameworks-express",
      path: "/docs/gateway/deployment/node-frameworks/express",
    },
    {
      name: "gateway-deployment-node-frameworks-fastify",
      path: "/docs/gateway/deployment/node-frameworks/fastify",
    },
    {
      name: "gateway-deployment-node-frameworks-hapi",
      path: "/docs/gateway/deployment/node-frameworks/hapi",
    },
    {
      name: "gateway-deployment-node-frameworks-koa",
      path: "/docs/gateway/deployment/node-frameworks/koa",
    },
    {
      name: "gateway-deployment-node-frameworks-nestjs",
      path: "/docs/gateway/deployment/node-frameworks/nestjs",
    },
    {
      name: "gateway-deployment-node-frameworks-nextjs",
      path: "/docs/gateway/deployment/node-frameworks/nextjs",
    },
    {
      name: "gateway-deployment-node-frameworks-sveltekit",
      path: "/docs/gateway/deployment/node-frameworks/sveltekit",
    },
    {
      name: "gateway-deployment-node-frameworks-uwebsockets",
      path: "/docs/gateway/deployment/node-frameworks/uwebsockets",
    },
    {
      name: "gateway-deployment-resources-requirements",
      path: "/docs/gateway/deployment/resources-requirements",
    },
    {
      name: "gateway-deployment-runtimes-bun",
      path: "/docs/gateway/deployment/runtimes/bun",
    },
    {
      name: "gateway-deployment-runtimes-deno",
      path: "/docs/gateway/deployment/runtimes/deno",
    },
    {
      name: "gateway-deployment-runtimes-nodejs",
      path: "/docs/gateway/deployment/runtimes/nodejs",
    },
    {
      name: "gateway-deployment-serverless",
      path: "/docs/gateway/deployment/serverless",
    },
    {
      name: "gateway-deployment-serverless-aws-lambda",
      path: "/docs/gateway/deployment/serverless/aws-lambda",
    },
    {
      name: "gateway-deployment-serverless-azure-functions",
      path: "/docs/gateway/deployment/serverless/azure-functions",
    },
    {
      name: "gateway-deployment-serverless-cloudflare-workers",
      path: "/docs/gateway/deployment/serverless/cloudflare-workers",
    },
    {
      name: "gateway-deployment-serverless-google-cloud-platform",
      path: "/docs/gateway/deployment/serverless/google-cloud-platform",
    },
    {
      name: "gateway-logging-and-error-handling",
      path: "/docs/gateway/logging-and-error-handling",
    },
    {
      name: "gateway-monitoring-tracing",
      path: "/docs/gateway/monitoring-tracing",
    },
    { name: "gateway-other-features", path: "/docs/gateway/other-features" },
    {
      name: "gateway-other-features-custom-plugins",
      path: "/docs/gateway/other-features/custom-plugins",
    },
    {
      name: "gateway-other-features-header-propagation",
      path: "/docs/gateway/other-features/header-propagation",
    },
    {
      name: "gateway-other-features-performance",
      path: "/docs/gateway/other-features/performance",
    },
    {
      name: "gateway-other-features-performance-automatic-persisted-queries",
      path: "/docs/gateway/other-features/performance/automatic-persisted-queries",
    },
    {
      name: "gateway-other-features-performance-compression",
      path: "/docs/gateway/other-features/performance/compression",
    },
    {
      name: "gateway-other-features-performance-deduplicate-inflight-requests",
      path: "/docs/gateway/other-features/performance/deduplicate-inflight-requests",
    },
    {
      name: "gateway-other-features-performance-execution-cancellation",
      path: "/docs/gateway/other-features/performance/execution-cancellation",
    },
    {
      name: "gateway-other-features-performance-http-caching",
      path: "/docs/gateway/other-features/performance/http-caching",
    },
    {
      name: "gateway-other-features-performance-parsing-and-validation-caching",
      path: "/docs/gateway/other-features/performance/parsing-and-validation-caching",
    },
    {
      name: "gateway-other-features-performance-request-batching",
      path: "/docs/gateway/other-features/performance/request-batching",
    },
    {
      name: "gateway-other-features-performance-response-caching",
      path: "/docs/gateway/other-features/performance/response-caching",
    },
    {
      name: "gateway-other-features-performance-upstream-cancellation",
      path: "/docs/gateway/other-features/performance/upstream-cancellation",
    },
    {
      name: "gateway-other-features-progressive-override",
      path: "/docs/gateway/other-features/progressive-override",
    },
    {
      name: "gateway-other-features-rust-query-planner",
      path: "/docs/gateway/other-features/rust-query-planner",
    },
    {
      name: "gateway-other-features-security",
      path: "/docs/gateway/other-features/security",
    },
    {
      name: "gateway-other-features-security-audit-documents",
      path: "/docs/gateway/other-features/security/audit-documents",
    },
    {
      name: "gateway-other-features-security-aws-sigv4",
      path: "/docs/gateway/other-features/security/aws-sigv4",
    },
    {
      name: "gateway-other-features-security-block-field-suggestions",
      path: "/docs/gateway/other-features/security/block-field-suggestions",
    },
    {
      name: "gateway-other-features-security-character-limit",
      path: "/docs/gateway/other-features/security/character-limit",
    },
    {
      name: "gateway-other-features-security-cors",
      path: "/docs/gateway/other-features/security/cors",
    },
    {
      name: "gateway-other-features-security-csrf-prevention",
      path: "/docs/gateway/other-features/security/csrf-prevention",
    },
    {
      name: "gateway-other-features-security-demand-control",
      path: "/docs/gateway/other-features/security/demand-control",
    },
    {
      name: "gateway-other-features-security-disable-introspection",
      path: "/docs/gateway/other-features/security/disable-introspection",
    },
    {
      name: "gateway-other-features-security-hmac-signature",
      path: "/docs/gateway/other-features/security/hmac-signature",
    },
    {
      name: "gateway-other-features-security-https",
      path: "/docs/gateway/other-features/security/https",
    },
    {
      name: "gateway-other-features-security-max-aliases",
      path: "/docs/gateway/other-features/security/max-aliases",
    },
    {
      name: "gateway-other-features-security-max-depth",
      path: "/docs/gateway/other-features/security/max-depth",
    },
    {
      name: "gateway-other-features-security-max-directives",
      path: "/docs/gateway/other-features/security/max-directives",
    },
    {
      name: "gateway-other-features-security-max-tokens",
      path: "/docs/gateway/other-features/security/max-tokens",
    },
    {
      name: "gateway-other-features-security-rate-limiting",
      path: "/docs/gateway/other-features/security/rate-limiting",
    },
    {
      name: "gateway-other-features-testing",
      path: "/docs/gateway/other-features/testing",
    },
    {
      name: "gateway-other-features-testing-debugging",
      path: "/docs/gateway/other-features/testing/debugging",
    },
    {
      name: "gateway-other-features-testing-gateway-tester",
      path: "/docs/gateway/other-features/testing/gateway-tester",
    },
    {
      name: "gateway-other-features-testing-mocking",
      path: "/docs/gateway/other-features/testing/mocking",
    },
    {
      name: "gateway-other-features-testing-snapshot",
      path: "/docs/gateway/other-features/testing/snapshot",
    },
    {
      name: "gateway-other-features-upstream-reliability",
      path: "/docs/gateway/other-features/upstream-reliability",
    },
    {
      name: "gateway-persisted-documents",
      path: "/docs/gateway/persisted-documents",
    },
    { name: "gateway-subscriptions", path: "/docs/gateway/subscriptions" },
    {
      name: "gateway-supergraph-proxy-source",
      path: "/docs/gateway/supergraph-proxy-source",
    },
    { name: "gateway-usage-reporting", path: "/docs/gateway/usage-reporting" },
    { name: "logger", path: "/docs/logger" },
    {
      name: "migration-guides-gateway-v1-v2",
      path: "/docs/migration-guides/gateway-v1-v2",
    },
    {
      name: "migration-guides-organization-access-tokens",
      path: "/docs/migration-guides/organization-access-tokens",
    },
    { name: "new-laboratory", path: "/docs/new-laboratory" },
    {
      name: "new-laboratory-collections",
      path: "/docs/new-laboratory/collections",
    },
    {
      name: "new-laboratory-environment-variables",
      path: "/docs/new-laboratory/environment-variables",
    },
    { name: "new-laboratory-history", path: "/docs/new-laboratory/history" },
    {
      name: "new-laboratory-operations",
      path: "/docs/new-laboratory/operations",
    },
    {
      name: "new-laboratory-preflight",
      path: "/docs/new-laboratory/preflight",
    },
    {
      name: "new-laboratory-schema-support",
      path: "/docs/new-laboratory/schema-support",
    },
    { name: "other-integrations", path: "/docs/other-integrations" },
    {
      name: "other-integrations-apollo-gateway",
      path: "/docs/other-integrations/apollo-gateway",
    },
    {
      name: "other-integrations-apollo-router",
      path: "/docs/other-integrations/apollo-router",
    },
    {
      name: "other-integrations-apollo-server",
      path: "/docs/other-integrations/apollo-server",
    },
    {
      name: "other-integrations-ci-cd",
      path: "/docs/other-integrations/ci-cd",
    },
    {
      name: "other-integrations-code-first",
      path: "/docs/other-integrations/code-first",
    },
    {
      name: "other-integrations-envelop",
      path: "/docs/other-integrations/envelop",
    },
    {
      name: "other-integrations-gqlgen-go",
      path: "/docs/other-integrations/gqlgen-go",
    },
    {
      name: "other-integrations-grafbase-gateway",
      path: "/docs/other-integrations/grafbase-gateway",
    },
    {
      name: "other-integrations-graphql-code-generator",
      path: "/docs/other-integrations/graphql-code-generator",
    },
    {
      name: "other-integrations-graphql-ruby",
      path: "/docs/other-integrations/graphql-ruby",
    },
    {
      name: "other-integrations-graphql-yoga",
      path: "/docs/other-integrations/graphql-yoga",
    },
    {
      name: "other-integrations-lighthouse",
      path: "/docs/other-integrations/lighthouse",
    },
    {
      name: "other-integrations-schema-stitching",
      path: "/docs/other-integrations/schema-stitching",
    },
    { name: "router", path: "/docs/router" },
    { name: "router-configuration", path: "/docs/router/configuration" },
    {
      name: "router-configuration-authorization",
      path: "/docs/router/configuration/authorization",
    },
    {
      name: "router-configuration-cors",
      path: "/docs/router/configuration/cors",
    },
    {
      name: "router-configuration-csrf",
      path: "/docs/router/configuration/csrf",
    },
    {
      name: "router-configuration-environment-variables",
      path: "/docs/router/configuration/environment-variables",
    },
    {
      name: "router-configuration-expressions",
      path: "/docs/router/configuration/expressions",
    },
    {
      name: "router-configuration-graphiql",
      path: "/docs/router/configuration/graphiql",
    },
    {
      name: "router-configuration-headers",
      path: "/docs/router/configuration/headers",
    },
    {
      name: "router-configuration-http",
      path: "/docs/router/configuration/http",
    },
    {
      name: "router-configuration-introspection",
      path: "/docs/router/configuration/introspection",
    },
    {
      name: "router-configuration-jwt",
      path: "/docs/router/configuration/jwt",
    },
    {
      name: "router-configuration-limits",
      path: "/docs/router/configuration/limits",
    },
    {
      name: "router-configuration-log",
      path: "/docs/router/configuration/log",
    },
    {
      name: "router-configuration-override_labels",
      path: "/docs/router/configuration/override_labels",
    },
    {
      name: "router-configuration-override_subgraph_urls",
      path: "/docs/router/configuration/override_subgraph_urls",
    },
    {
      name: "router-configuration-query_planner",
      path: "/docs/router/configuration/query_planner",
    },
    {
      name: "router-configuration-supergraph",
      path: "/docs/router/configuration/supergraph",
    },
    {
      name: "router-configuration-traffic_shaping",
      path: "/docs/router/configuration/traffic_shaping",
    },
    {
      name: "router-configuration-usage_reporting",
      path: "/docs/router/configuration/usage_reporting",
    },
    { name: "router-getting-started", path: "/docs/router/getting-started" },
    {
      name: "router-guides-dynamic-subgraph-routing",
      path: "/docs/router/guides/dynamic-subgraph-routing",
    },
    {
      name: "router-guides-header-manipulation",
      path: "/docs/router/guides/header-manipulation",
    },
    {
      name: "router-guides-performance-tuning",
      path: "/docs/router/guides/performance-tuning",
    },
    {
      name: "router-observability-probes",
      path: "/docs/router/observability/probes",
    },
    {
      name: "router-observability-usage_reporting",
      path: "/docs/router/observability/usage_reporting",
    },
    {
      name: "router-security-authorization",
      path: "/docs/router/security/authorization",
    },
    { name: "router-security-cors", path: "/docs/router/security/cors" },
    { name: "router-security-csrf", path: "/docs/router/security/csrf" },
    {
      name: "router-security-introspection",
      path: "/docs/router/security/introspection",
    },
    {
      name: "router-security-jwt-authentication",
      path: "/docs/router/security/jwt-authentication",
    },
    {
      name: "router-security-operation-complexity",
      path: "/docs/router/security/operation-complexity",
    },
    { name: "router-supergraph", path: "/docs/router/supergraph" },
    { name: "schema-registry", path: "/docs/schema-registry" },
    {
      name: "schema-registry-app-deployments",
      path: "/docs/schema-registry/app-deployments",
    },
    {
      name: "schema-registry-contracts",
      path: "/docs/schema-registry/contracts",
    },
    {
      name: "schema-registry-explorer",
      path: "/docs/schema-registry/explorer",
    },
    {
      name: "schema-registry-external-schema-composition",
      path: "/docs/schema-registry/external-schema-composition",
    },
    {
      name: "schema-registry-get-started-apollo-federation",
      path: "/docs/schema-registry/get-started/apollo-federation",
    },
    {
      name: "schema-registry-get-started-first-steps",
      path: "/docs/schema-registry/get-started/first-steps",
    },
    {
      name: "schema-registry-get-started-schema-stitching",
      path: "/docs/schema-registry/get-started/schema-stitching",
    },
    {
      name: "schema-registry-get-started-single-project",
      path: "/docs/schema-registry/get-started/single-project",
    },
    {
      name: "schema-registry-high-availability-cdn",
      path: "/docs/schema-registry/high-availability-cdn",
    },
    {
      name: "schema-registry-high-availability-resilience",
      path: "/docs/schema-registry/high-availability-resilience",
    },
    {
      name: "schema-registry-laboratory",
      path: "/docs/schema-registry/laboratory",
    },
    {
      name: "schema-registry-laboratory-preflight-scripts",
      path: "/docs/schema-registry/laboratory/preflight-scripts",
    },
    {
      name: "schema-registry-management-access-tokens",
      path: "/docs/schema-registry/management/access-tokens",
    },
    {
      name: "schema-registry-management-audit-logs",
      path: "/docs/schema-registry/management/audit-logs",
    },
    {
      name: "schema-registry-management-members-roles-permissions",
      path: "/docs/schema-registry/management/members-roles-permissions",
    },
    {
      name: "schema-registry-management-organizations",
      path: "/docs/schema-registry/management/organizations",
    },
    {
      name: "schema-registry-management-projects",
      path: "/docs/schema-registry/management/projects",
    },
    {
      name: "schema-registry-management-sso-oidc-provider",
      path: "/docs/schema-registry/management/sso-oidc-provider",
    },
    {
      name: "schema-registry-management-targets",
      path: "/docs/schema-registry/management/targets",
    },
    {
      name: "schema-registry-schema-policy",
      path: "/docs/schema-registry/schema-policy",
    },
    {
      name: "schema-registry-self-hosting-cdn-artifacts",
      path: "/docs/schema-registry/self-hosting/cdn-artifacts",
    },
    {
      name: "schema-registry-self-hosting-changelog",
      path: "/docs/schema-registry/self-hosting/changelog",
    },
    {
      name: "schema-registry-self-hosting-client-and-cli-configuration",
      path: "/docs/schema-registry/self-hosting/client-and-cli-configuration",
    },
    {
      name: "schema-registry-self-hosting-external-composition",
      path: "/docs/schema-registry/self-hosting/external-composition",
    },
    {
      name: "schema-registry-self-hosting-get-started",
      path: "/docs/schema-registry/self-hosting/get-started",
    },
    {
      name: "schema-registry-self-hosting-oidc-login",
      path: "/docs/schema-registry/self-hosting/oidc-login",
    },
    {
      name: "schema-registry-self-hosting-s3-provider",
      path: "/docs/schema-registry/self-hosting/s3-provider",
    },
    {
      name: "schema-registry-self-hosting-telemetry",
      path: "/docs/schema-registry/self-hosting/telemetry",
    },
    {
      name: "schema-registry-self-hosting-troubleshooting",
      path: "/docs/schema-registry/self-hosting/troubleshooting",
    },
    {
      name: "schema-registry-usage-reporting",
      path: "/docs/schema-registry/usage-reporting",
    },
    {
      name: "use-cases-apollo-graphos",
      path: "/docs/use-cases/apollo-graphos",
    },
    // Landing pages
    { name: "landing-home", path: "/" },
    { name: "landing-pricing", path: "/pricing" },
    { name: "landing-ecosystem", path: "/ecosystem" },
    { name: "landing-federation", path: "/federation" },
    { name: "landing-gateway", path: "/gateway" },
    { name: "landing-oss-friends", path: "/oss-friends" },
    { name: "landing-partners", path: "/partners" },
  ],
  productionUrl: "http://localhost:3000",
  screenshotsDir: new URL("../screenshots", import.meta.url).pathname,
  viewport: { height: 900, width: 1440 },
};
