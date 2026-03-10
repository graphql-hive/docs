/**
 * Integration tests for AI/LLM features.
 *
 * Run with: bun test src/routes/docs/-$.test.ts
 */
import { spawn, type Subprocess } from "bun";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

const TEST_PORT = 14_401;
const CHANGELOG_STUB_PORT = 14_402;
const BASE_URL = process.env["TEST_URL"] || `http://localhost:${TEST_PORT}`;
const CHANGELOG_STUB_URL =
  process.env["DEPLOYMENT_CHANGELOG_URL"] ||
  `http://127.0.0.1:${CHANGELOG_STUB_PORT}/CHANGELOG.md`;
const CHANGELOG_UNIQUE_TERM = "changelog-octopus-token";
const CHANGELOG_FIXTURE = `# hive

## 9.9.9

### Patch Changes

- Added ${CHANGELOG_UNIQUE_TERM} for deterministic search coverage.

\`\`\`sh
echo "${CHANGELOG_UNIQUE_TERM}"
\`\`\`
`;

let devServer: Subprocess | null = null;
let changelogStub: ReturnType<typeof Bun.serve> | null = null;

// TODO: Move to a util file
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

  const cwd = join(import.meta.dir, "../../..");
  const wranglerConfig = join(cwd, ".output/server/wrangler.json");

  changelogStub = Bun.serve({
    fetch() {
      return new Response(CHANGELOG_FIXTURE, {
        headers: { "content-type": "text/markdown; charset=utf-8" },
      });
    },
    hostname: "127.0.0.1",
    port: CHANGELOG_STUB_PORT,
  });

  if (!existsSync(wranglerConfig)) {
    const build = spawn(["bun", "run", "build"], {
      cwd,
      env: {
        ...process.env,
        DEPLOYMENT_CHANGELOG_URL: CHANGELOG_STUB_URL,
      },
      stderr: "inherit",
      stdout: "inherit",
    });

    const exitCode = await build.exited;
    if (exitCode !== 0) {
      throw new Error(`Build failed with exit code ${exitCode}`);
    }
  }

  devServer = spawn(
    [
      "bunx",
      "wrangler",
      "dev",
      "-c",
      ".output/server/wrangler.json",
      "--port",
      String(TEST_PORT),
    ],
    {
      cwd,
      env: {
        ...process.env,
        DEPLOYMENT_CHANGELOG_URL: CHANGELOG_STUB_URL,
        PORT: String(TEST_PORT),
      },
      stderr: "ignore",
      stdout: "ignore",
    },
  );

  await waitForServer();
}, 60_000 * 10);

afterAll(() => {
  devServer?.kill();
  changelogStub?.stop(true);
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
  }, 30_000);

  test("is not rewritten to a doc page", async () => {
    const res = await fetch(`${BASE_URL}/llms-full.txt`);
    expect(res.status).toBe(200);
    // llms-full.txt contains multiple docs concatenated, not a single doc
    const text = await res.text();
    expect(text).toContain("(/docs/");
  }, 30_000);
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

  test("/docs/schema-registry.txt returns markdown for nested page", async () => {
    const res = await fetch(`${BASE_URL}/docs/schema-registry.txt`, {
      redirect: "follow",
    });
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

  test("/docs/schema-registry.mdx returns markdown for nested page", async () => {
    const res = await fetch(`${BASE_URL}/docs/schema-registry.mdx`, {
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

  test("/docs/schema-registry.md returns markdown for nested page", async () => {
    const res = await fetch(`${BASE_URL}/docs/schema-registry.md`, {
      redirect: "follow",
    });
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
    const res = await fetch(`${BASE_URL}/docs/schema-registry`, {
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

describe("deployment changelog", () => {
  test("renders changelog html with mdx code-block chrome", async () => {
    const res = await fetch(
      `${BASE_URL}/docs/schema-registry/self-hosting/changelog`,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");

    const text = await res.text();
    expect(text).toContain(CHANGELOG_UNIQUE_TERM);
    expect(text).toContain("Copy Text");
    expect(text).toContain("echo");
  });

  test("api search indexes the changelog source", async () => {
    const res = await fetch(
      `${BASE_URL}/api/search?query=${CHANGELOG_UNIQUE_TERM}`,
      { redirect: "follow" },
    );
    expect(res.status).toBe(200);

    const json = (await res.json()) as Array<{ url: string }>;
    expect(
      json.some(
        (entry) => entry.url === "/docs/schema-registry/self-hosting/changelog",
      ),
    ).toBe(true);
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
