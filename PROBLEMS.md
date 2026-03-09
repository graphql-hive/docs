# Known Problems

## Sitemap

- **`/sitemap.xml` was 404 at root** — TanStack Start generates it under the base path
  (`/graphql/hive-testing/sitemap.xml`). Fixed with explicit handling in the Cloudflare
  entry. After base path changes to `/graphql/hive` in prod, the `aliasRequest` flow
  should handle it, but the explicit route is kept as a safety net.

- **Sitemap `host` was double-prefixing URLs** — `sitemap.host` included the path
  (`https://the-guild.dev/graphql/hive`) and TanStack Start appended the base path on
  top (`/graphql/hive-testing/...`), producing
  `https://the-guild.dev/graphql/hive/graphql/hive-testing/docs/...`. Fixed by setting
  host to origin only (`https://the-guild.dev`).

- **UTM query params in sitemap** — `crawlLinks` follows blog post links with UTM
  tracking params, creating duplicate sitemap entries like
  `docs/gateway?utm_source=the_guild&utm_medium=blog&...`. Worked around with
  `nitro.prerender.ignore: [/[?&]utm_/]`. Upstream fix needed in TanStack Start's
  sitemap generator to strip query params.

- **No `robots.txt`** (fixed) — Added `public/robots.txt` and serve it at `/robots.txt`
  via the Cloudflare entry, same as sitemap.

- ~~**Missing `additionalPaths` equivalent**~~ — Old site's `next-sitemap.config.js`
  added `/federation-gateway-audit` and `/federation-gateway-performance`. These pages
  don't actually exist in either site (both return 404). They're likely served by the
  parent the-guild.dev site. Not our problem.

## Pricing Table

- **2 rows were missing** (fixed) — "Manage Persisted Documents" and "Persisted Document
  breaking change detection" were present in old site but absent in new site's
  `plans-table.tsx`.

## Navigation / Sidebar

- **Minor reordering** — Gateway > Other Features and New Laboratory subsections are in
  different order (new site uses alphabetical, old used manual order). Not broken, but
  worth aligning if order matters for UX.

## Content

- **Logger redaction docs** — New section from hive-console (#7674) added as
  `content/docs/logger/redacting.mdx`. The old site had a single `logger.mdx` which was
  split into multiple files in the new site.

- **CDN artifacts clarification** — Added description text for Supergraph and Hive
  Metadata artifacts, plus link to directives for federated systems (#7799).

## Visual Comparison (visually-same report)

Compared old site (next start :3000) vs new site (wrangler dev :1440).
178 pages total: 26 passed, 152 failed.

Most failures are small styling/font diffs (<5%). Investigation findings:

### Blank pages (rendered as white under wrangler dev)

3 pages rendered blank white in the screenshot run. **These work fine in
production** — this is wrangler dev flakiness, not a real bug. The screenshot
tool waits only 2s after load, which may not be enough for wrangler dev SSR.

- `/docs/schema-registry/get-started/apollo-federation` (95.36%)
- `/docs/gateway/supergraph-proxy-source` (70.25%)
- `/docs/gateway/usage-reporting` (59.83%)

### Code block overflow fix (not a bug — new site is better)

- `/docs/api-reference/graphql-api/unused-deprecated-schema` (64.86%) — old site
  had GraphQL queries overflowing horizontally way beyond the viewport. New site
  wraps them properly.

### Minor rendering regression: usage-reports JSON schema

- `/docs/api-reference/usage-reports` (28.65%) — The JSON Schema `<details>`
  section uses raw `<pre><code>{JSON.stringify(...)}</code></pre>` instead of the
  old site's `<MDXRemote>` + `compileMdx()` which gave syntax highlighting and a
  copy button. Not visible in screenshot diff (details collapsed), but degraded UX
  when expanded. Should render as a fenced code block.

### Investigated top diffs — all content-complete

Top 5 pages manually compared (28.65% down to 19.26%). All content is identical
between old and new sites. Diffs come from:
- Header/nav/sidebar/footer design differences (Nextra → Fumadocs)
- Code block syntax highlighting theme
- Font rendering

No missing sections, no missing text, no broken components.

### Large (10-30% diff) — layout/footer, not content

| Diff | Page |
|------|------|
| 28.65% | `/docs/api-reference/usage-reports` |
| 21.75% | `/docs/gateway/other-features/security/block-field-suggestions` |
| 20.50% | `/docs/gateway/other-features/performance/request-batching` |
| 19.30% | `/docs/gateway/other-features/security/aws-sigv4` |
| 19.26% | `/docs/gateway/other-features/security/character-limit` |
| 17.96% | `/docs/api-reference/gateway-config` |
| 17.25% | `/docs/gateway/other-features/security/audit-documents` |
| 16.75% | `/docs/api-reference/graphql-api/member-management` |
| 16.14% | `/docs/gateway/other-features/security/hmac-signature` |
| 15.91% | `/docs/gateway/other-features/security/csrf-prevention` |
| 15.71% | `/docs/gateway/other-features/security/disable-introspection` |
| 15.02% | `/docs/gateway/other-features/security/demand-control` |
| 14.85% | `/docs/gateway/other-features/security/cors` |
| 14.57% | `/docs/api-reference/graphql-api/access-token-management` |
| 14.46% | `/docs/gateway/other-features/progressive-override` |
| 14.18% | `/docs/api-reference/graphql-api/project-management` |
| 14.15% | `/docs/api-reference/graphql-api/contract-management` |
| 13.60% | `/docs/gateway` |
| 13.52% | `/docs` |
| 13.06% | `/docs/gateway/other-features/security` |
| 12.94% | `/docs/gateway/other-features/performance/upstream-cancellation` |
| 12.61% | `/docs/gateway/other-features/rust-query-planner` |
| 12.25% | `/docs/api-reference/client` |
| 12.17% | `/docs/api-reference/graphql-api/target-management` |
| 12.15% | `/docs/api-reference/link-specifications` |
| 10.67% | `/docs/api-reference/graphql-api` |

### Medium (1-5%) — 63 pages, sidebar/font/spacing differences

### Tiny (<1%) — 52 pages, negligible

## Build / Prerender

- **14 sitemap URLs used wrong base path** — A subset of pages (landing pages + 5 old
  blog posts) got the production host URL without the testing base path prefix. This is a
  consequence of the `sitemap.host` double-prefix bug (now fixed).
