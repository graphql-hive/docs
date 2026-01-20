/**
 * Integration tests for AI/LLM features.
 *
 * Run with: bun test src/routes/docs/-llm.test.ts
 * Requires dev server running: bun run dev
 */
import { describe, expect, test } from "bun:test";

const BASE_URL = process.env["TEST_URL"] || "http://localhost:1440";

describe("llms.txt", () => {
  test("returns index of docs", async () => {
    const res = await fetch(`${BASE_URL}/llms.txt`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/plain");
    const text = await res.text();
    expect(text).toContain("# GraphQL Hive");
    expect(text).toContain(".md)");
  });
});

describe("llms-full.txt", () => {
  test("returns all docs as markdown", async () => {
    const res = await fetch(`${BASE_URL}/llms-full.txt`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("# ");
    expect(text).toContain("(/docs");
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
    const res = await fetch(`${BASE_URL}/docs/test.mdx`, { redirect: "follow" });
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
});
