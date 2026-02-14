#!/usr/bin/env node
/**
 * Fix broken internal links from old Nextra path structure.
 * Based on redirect mappings from .context/hive-console/packages/web/docs/next.config.js
 */
import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";
import { execSync } from "node:child_process";

const pkgDir = new URL("..", import.meta.url).pathname;

// Get all MDX and TSX files in content/ and src/
const files = execSync(
  `find ${pkgDir}/content ${pkgDir}/src \\( -name '*.mdx' -o -name '*.tsx' -o -name '*.ts' \\) | grep -v node_modules`,
  { encoding: "utf8" },
)
  .trim()
  .split("\n");

// Ordered replacement rules (most specific first)
const rules = [
  // Specific redirects
  ["/docs/access-tokens", "/docs/schema-registry/management/access-tokens"],
  ["/docs/dashboard/insights", "/docs/schema-registry/usage-reporting"],
  ["/docs/dashboard/explorer", "/docs/schema-registry/explorer"],
  ["/docs/dashboard/laboratory", "/docs/schema-registry/laboratory"],
  ["/docs/high-availability-cdn", "/docs/schema-registry/high-availability-cdn"],
  ["/docs/graphql-api", "/docs/api-reference/graphql-api"],
  ["/docs/schema-registry/link-specifications", "/docs/api-reference/link-specifications"],
  ["/docs/api-reference)", "/docs/api-reference/cli)"], // bare /docs/api-reference link

  // Path prefix mappings (order matters — more specific first)
  ["/docs/get-started/", "/docs/schema-registry/get-started/"],
  ["/docs/management/", "/docs/schema-registry/management/"],
  ["/docs/self-hosting/", "/docs/schema-registry/self-hosting/"],
  ["/docs/configuration/", "/docs/router/configuration/"],
  ["/docs/guides/", "/docs/router/guides/"],
  ["/docs/security/", "/docs/router/security/"],
  ["/docs/supergraph", "/docs/router/supergraph"],

  // Renamed pages
  ["/docs/gateway/other-features/performance/deduplicate-request", "/docs/gateway/other-features/performance/deduplicate-inflight-requests"],
  ["/docs/gateway/other-features/security/cost-limit", "/docs/gateway/other-features/security/demand-control"],
  ["/docs/router/configuration/usage_reporting", "/docs/router/observability/usage_reporting"],

  // Missing /docs prefix
  ["(/schema-registry", "(/docs/schema-registry"],

  // Full URLs with old paths (the-guild.dev and graphql-hive.com)
  ["the-guild.dev/graphql/hive/docs/management/", "the-guild.dev/graphql/hive/docs/schema-registry/management/"],
  ["the-guild.dev/graphql/hive/docs/get-started/", "the-guild.dev/graphql/hive/docs/schema-registry/get-started/"],
  ["the-guild.dev/graphql/hive/docs/graphql-api", "the-guild.dev/graphql/hive/docs/api-reference/graphql-api"],
  ["the-guild.dev/graphql/hive/docs/high-availability-cdn", "the-guild.dev/graphql/hive/docs/schema-registry/high-availability-cdn"],
  ["graphql-hive.com/docs/management/", "graphql-hive.com/docs/schema-registry/management/"],
];

let totalReplacements = 0;
let filesChanged = 0;

for (const file of files) {
  const original = readFileSync(file, "utf8");
  let content = original;

  for (const [from, to] of rules) {
    content = content.replaceAll(from, to);
  }

  if (content !== original) {
    writeFileSync(file, content);
    filesChanged++;
    // Count replacements
    const count =
      original.split("").length - content.split("").length === 0
        ? original.length !== content.length
          ? 1
          : (() => {
              let c = 0;
              for (const [from] of rules) {
                const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
                c += (original.match(re) || []).length - (content.match(re) || []).length;
              }
              return c;
            })()
        : 1;
    console.log(`  Fixed: ${file.replace(pkgDir, "")}`);
    totalReplacements++;
  }
}

console.log(`\nDone: ${filesChanged} files changed.`);
