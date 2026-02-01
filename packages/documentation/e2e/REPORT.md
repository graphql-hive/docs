# E2E Test Migration Report

Tests migrated from `graphql-hive/packages/web/docs/e2e` to `hive-docs/packages/documentation/e2e`.

## Results: 19 passed, 31 failed, 2 skipped

### Passing (19)

| Test                                             | Project          |
| ------------------------------------------------ | ---------------- |
| user reads case study                            | chromium, mobile |
| user checks product updates                      | chromium         |
| user explores ecosystem and partner pages        | chromium, mobile |
| user checks OSS friends page                     | chromium, mobile |
| new visitor explores Hive and decides to sign up | chromium, mobile |
| developer navigates to federation page           | chromium, mobile |
| developer navigates to gateway page              | chromium, mobile |
| FAQ accordion expands on click                   | chromium, mobile |
| testimonials section shows company tabs          | chromium, mobile |
| navigation menu is accessible                    | chromium         |
| user navigates to pricing via nav                | chromium         |

### Failing (31) — grouped by root cause

#### 1. Docs pages not fully built (docs-navigation.e2e.ts, docs.spec.ts) — 22 failures

`/docs`, `/docs/schema-registry`, `/docs/api-reference/cli` return 404 or have different content than expected.

- `docs.spec.ts` tests expect "Hello World" heading and fumadocs sidebar (`aside`) — placeholder content not matching real docs.
- `docs-navigation.e2e.ts` tests skip when `/docs` returns non-ok, but pages return 200 with wrong content.

**Fix**: Migrate real docs content, remove `docs.spec.ts` as we'll no longer need it.

#### 2. Search selectors outdated (search.e2e.ts) — 5 failures

Search combobox (`role="combobox"` with name "Search documentation…") not found. Search IS implemented (Orama), but the selectors target the old nextra/pagefind markup.

**Fix**: After docs content is migrated, update search test selectors to match Orama's actual roles/names.

#### 3. Mobile nav differences (landing-page.e2e.ts) — 2 failures

- `user navigates to pricing via nav (mobile)`: Mobile menu button ("Menu") or `complementary` role sidebar not found.
- `navigation menu is accessible (mobile)`: Same issue.

**Fix**: Ensure mobile nav uses `role="complementary"` or update selectors to match actual mobile nav implementation.

#### 4. Product updates mobile (blog.e2e.ts) — 1 failure

`user checks product updates (mobile)`: list items found but test timed out on mobile webkit.

**Fix**: Debug webkit-specific rendering issue.

### Skipped (2)

- `search results navigate to docs` — skipped outside CI (search index not available locally).

### Changes Made

- **playwright.config.ts**: Added `mobile` project (iPhone 13 / webkit), added `testMatch` for `.e2e.ts` files.
- **landing-page.e2e.ts**: Cleaned up Next.js prefetch workarounds, replaced `evaluate` clicks with `.click()`.
- **blog.e2e.ts**: Removed `/blog` tests (no blog in new docs), kept case studies, product updates, ecosystem, partners, oss-friends.
- **docs-navigation.e2e.ts**: Cleaned up Next.js-specific comments, kept same structure.
- **search.e2e.ts**: Removed blog search test, cleaned up formatting.
