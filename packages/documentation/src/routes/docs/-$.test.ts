/**
 * Integration tests for AI/LLM features.
 *
 * Run with: bun test src/routes/docs/-$.test.ts
 */
import { spawn, type Subprocess } from "bun";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";

const TEST_PORT = 14_401;
const BASE_URL = process.env["TEST_URL"] || `http://localhost:${TEST_PORT}`;

let devServer: Subprocess | null = null;

async function waitForServer(maxAttempts = 30): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(1000) });
      if (res.ok || res.status < 500) return;
    } catch {
      // eslint-disable-next-line no-console
      console.log(`Server not ready after ${i + 1}s, retrying...`);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server not ready after ${maxAttempts}s`);
}

beforeAll(async () => {
  if (process.env["TEST_URL"]) return; // user-provided server

  devServer = spawn(
    ["bun", "--bun", "vite", "dev", "--port", String(TEST_PORT)],
    {
      cwd: import.meta.dir + "/../../..",
      stderr: "ignore",
      stdout: "ignore",
    },
  );

  await waitForServer();
}, 60_000);

afterAll(() => {
  devServer?.kill();
});

describe("llms.txt", () => {
  test("returns index of docs", async () => {
    const res = await fetch(`${BASE_URL}/llms.txt`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/markdown");
    const text = await res.text();
    expect(text).toContain("# GraphQL Hive");
    expect(text).toContain(".md)");
  });

  test("is not rewritten to a doc page", async () => {
    const res = await fetch(`${BASE_URL}/llms.txt`);
    const text = await res.text();
    // llms.txt should NOT start with frontmatter (doc pages do)
    expect(text.startsWith("---")).toBe(false);
  });
});

describe("llms-full.txt", () => {
  test("returns all docs as markdown", async () => {
    const res = await fetch(`${BASE_URL}/llms-full.txt`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/markdown");
    const text = await res.text();
    expect(text).toContain("# ");
    expect(text).toContain("(/docs");
  });

  test("is not rewritten to a doc page", async () => {
    const res = await fetch(`${BASE_URL}/llms-full.txt`);
    expect(res.status).toBe(200);
    // llms-full.txt contains multiple docs concatenated, not a single doc
    const text = await res.text();
    expect(text).toContain("(/docs/");
  });
});

describe(".txt extension", () => {
  test("/docs.txt returns markdown for root docs page", async () => {
    const res = await fetch(`${BASE_URL}/docs.txt`, { redirect: "follow" });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown");
    const text = await res.text();
    expect(text).toContain("---");
    expect(text).toContain("title:");
  });

  test("/docs/test.txt returns markdown for nested page", async () => {
    const res = await fetch(`${BASE_URL}/docs/test.txt`, { redirect: "follow" });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown");
    const text = await res.text();
    expect(text).toContain("---");
    expect(text).toContain("title:");
  });
});

describe(".mdx extension", () => {
  test("/docs.mdx returns markdown for root docs page", async () => {
    const res = await fetch(`${BASE_URL}/docs.mdx`, { redirect: "follow" });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown");
    const text = await res.text();
    expect(text).toContain("---");
    expect(text).toContain("title:");
  });

  test("/docs/test.mdx returns markdown for nested page", async () => {
    const res = await fetch(`${BASE_URL}/docs/test.mdx`, {
      redirect: "follow",
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown");
    const text = await res.text();
    expect(text).toContain("---");
    expect(text).toContain("title:");
  });
});

describe(".md extension", () => {
  test("/docs.md returns markdown for root docs page", async () => {
    const res = await fetch(`${BASE_URL}/docs.md`, { redirect: "follow" });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown");
    const text = await res.text();
    expect(text).toContain("---");
  });

  test("/docs/test.md returns markdown for nested page", async () => {
    const res = await fetch(`${BASE_URL}/docs/test.md`, { redirect: "follow" });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown");
    const text = await res.text();
    expect(text).toContain("---");
  });
});

describe("Accept header negotiation", () => {
  test("Accept: text/markdown returns markdown", async () => {
    const res = await fetch(`${BASE_URL}/docs`, {
      headers: { Accept: "text/markdown" },
      redirect: "follow",
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown");
    const text = await res.text();
    expect(text).toContain("---");
  });

  test("Accept: text/plain returns markdown", async () => {
    const res = await fetch(`${BASE_URL}/docs`, {
      headers: { Accept: "text/plain" },
      redirect: "follow",
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown");
  });

  test("Accept: text/markdown works for nested pages", async () => {
    const res = await fetch(`${BASE_URL}/docs/test`, {
      headers: { Accept: "text/markdown" },
      redirect: "follow",
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown");
  });

  test("regular browser request returns HTML", async () => {
    const res = await fetch(`${BASE_URL}/docs`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).not.toBe("text/markdown");
    const text = await res.text();
    expect(text).toContain("<!DOCTYPE html>");
  });
});

describe("404 handling", () => {
  test(".mdx extension returns notFound for non-existent page", async () => {
    const res = await fetch(`${BASE_URL}/docs/non-existent-xyz.mdx`, {
      redirect: "follow",
    });
    const json = await res.json();
    expect(json).toEqual({ isNotFound: true });
  });

  test("Accept header returns notFound for non-existent page", async () => {
    const res = await fetch(`${BASE_URL}/docs/non-existent-xyz`, {
      headers: { Accept: "text/markdown" },
      redirect: "follow",
    });
    const json = await res.json();
    expect(json).toEqual({ isNotFound: true });
  });

  test("non-text extensions like .png are not rewritten", async () => {
    const res = await fetch(`${BASE_URL}/docs.png`, { redirect: "follow" });
    expect(res.status).toBe(404);
  });
});
