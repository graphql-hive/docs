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

## Build / Prerender

- **14 sitemap URLs used wrong base path** — A subset of pages (landing pages + 5 old
  blog posts) got the production host URL without the testing base path prefix. This is a
  consequence of the `sitemap.host` double-prefix bug (now fixed).
