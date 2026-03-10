import { afterEach, describe, expect, test } from "bun:test";

import {
  __resetDeploymentChangelogCacheForTests,
  getDeploymentChangelogMarkdown,
} from "./deployment-changelog";

const originalFetch = globalThis.fetch;
const originalDateNow = Date.now;

afterEach(() => {
  globalThis.fetch = originalFetch;
  Date.now = originalDateNow;
  delete process.env["DEPLOYMENT_CHANGELOG_URL"];
  __resetDeploymentChangelogCacheForTests();
});

describe("getDeploymentChangelogMarkdown", () => {
  test("strips top-level heading and caches successful responses", async () => {
    let calls = 0;

    globalThis.fetch = (async () => {
      calls++;
      return new Response("# hive\n\n## 9.9.9\n\nhello\n");
    }) as typeof fetch;

    const first = await getDeploymentChangelogMarkdown();
    const second = await getDeploymentChangelogMarkdown();

    expect(first).toBe("\n## 9.9.9\n\nhello\n");
    expect(second).toBe(first);
    expect(calls).toBe(1);
  });

  test("serves stale markdown when refresh fails after ttl", async () => {
    let now = 1_000;
    let shouldFail = false;
    let calls = 0;

    Date.now = () => now;
    globalThis.fetch = (async () => {
      calls++;
      if (shouldFail) {
        throw new Error("boom");
      }
      return new Response("# hive\n\n## 1.0.0\n\nstable\n");
    }) as typeof fetch;

    const first = await getDeploymentChangelogMarkdown();

    now += 3_600_001;
    shouldFail = true;

    const second = await getDeploymentChangelogMarkdown();

    expect(first).toBe("\n## 1.0.0\n\nstable\n");
    expect(second).toBe(first);
    expect(calls).toBe(2);
  });
});
