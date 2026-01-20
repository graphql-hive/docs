/**
 * Integration test for markdown content negotiation.
 *
 * Run with: bun test src/routes/docs/-$.test.ts
 * Requires dev server running: bun run dev
 */
import { describe, expect, test } from "bun:test";

const BASE_URL = process.env["TEST_URL"] || "http://localhost:1440";

describe("markdown content negotiation", () => {
  test("returns markdown when Accept: text/markdown", async () => {
    const res = await fetch(`${BASE_URL}/docs`, {
      headers: { Accept: "text/markdown" },
    });
    expect(res.headers.get("content-type")).toBe("text/markdown");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("---"); // frontmatter
    expect(text).toContain("title:"); // has frontmatter field
  });

  test("returns markdown when Accept: text/plain", async () => {
    const res = await fetch(`${BASE_URL}/docs`, {
      headers: { Accept: "text/plain" },
    });
    expect(res.headers.get("content-type")).toBe("text/markdown");
    expect(res.status).toBe(200);
  });

  test("returns 404 for non-existent page with markdown accept", async () => {
    const res = await fetch(`${BASE_URL}/docs/non-existent-page-xyz`, {
      headers: { Accept: "text/markdown" },
    });
    expect(res.status).toBe(404);
  });

  test("does not intercept requests without markdown Accept header", async () => {
    const res = await fetch(`${BASE_URL}/docs`);
    // Should NOT return text/markdown (falls through to normal page render)
    expect(res.headers.get("content-type")).not.toBe("text/markdown");
    expect(res.status).toBe(200);
  });
});
