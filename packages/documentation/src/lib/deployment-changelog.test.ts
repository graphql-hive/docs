import { afterEach, describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";

import {
  __resetDeploymentChangelogCacheForTests,
  DEPLOYMENT_CHANGELOG_MARKDOWN_PLUGINS,
  DEPLOYMENT_CHANGELOG_REHYPE_PLUGINS,
  getDeploymentChangelogMarkdown,
} from "./deployment-changelog";
import { mdxComponents } from "./mdx-components";

function renderMarkdown(markdown: string) {
  return renderToStaticMarkup(
    createElement(
      Markdown,
      {
        components: mdxComponents,
        rehypePlugins: [...DEPLOYMENT_CHANGELOG_REHYPE_PLUGINS],
        remarkPlugins: [...DEPLOYMENT_CHANGELOG_MARKDOWN_PLUGINS],
      },
      markdown,
    ),
  );
}

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
    }) as unknown as typeof fetch;

    const first = await getDeploymentChangelogMarkdown();
    const second = await getDeploymentChangelogMarkdown();

    expect(first).toBe("\n## 9.9.9\n\nhello\n");
    expect(second).toBe(first);
    expect(calls).toBe(1);
  });

  test("serves stale markdown when refresh fails after ttl", async () => {
    let now = 1000;
    let shouldFail = false;
    let calls = 0;

    Date.now = () => now;
    globalThis.fetch = (async () => {
      calls++;
      if (shouldFail) {
        throw new Error("boom");
      }
      return new Response("# hive\n\n## 1.0.0\n\nstable\n");
    }) as unknown as typeof fetch;

    const first = await getDeploymentChangelogMarkdown();

    now += 3_600_001;
    shouldFail = true;

    const second = await getDeploymentChangelogMarkdown();

    expect(first).toBe("\n## 1.0.0\n\nstable\n");
    expect(second).toBe(first);
    expect(calls).toBe(2);
  });
});

describe("markdown rendering", () => {
  test("renders supported fenced code blocks with dual-theme shiki markup", () => {
    const html = renderMarkdown("```sh\necho hi\n```\n");

    expect(html).toContain("shiki");
    expect(html).toContain("github-dark");
    expect(html).toContain("--shiki-light");
    expect(html).toContain("--shiki-dark");
    expect(html).toContain("echo");
  });

  test("renders sql fenced code blocks with shiki line spans", () => {
    const html = renderMarkdown("```sql\nSELECT 1;\n```\n");

    expect(html).toContain("shiki");
    expect(html).toContain('class="line"');
    expect(html).not.toContain('class="language-sql"');
  });

  test("trims blank lines around highlighted changelog code blocks", () => {
    const html = renderMarkdown("```sql\n\nSELECT 1;\n\n```\n");

    expect(html.match(/class="line"/g)?.length).toBe(1);
    expect(html).toContain("SELECT");
  });

  test("keeps unknown languages as plain code blocks", () => {
    const html = renderMarkdown("```not-a-real-lang\nhello\n```\n");

    expect(html).not.toContain("shiki-themes");
    expect(html).toContain("language-not-a-real-lang");
    expect(html).toContain("hello");
  });

  test("uses shared mdx link component mapping", () => {
    const html = renderMarkdown("[Schema Registry](https://the-guild.dev)\n");

    expect(html).toContain("underline-offset-2");
    expect(html).toContain('href="https://the-guild.dev"');
  });
});
