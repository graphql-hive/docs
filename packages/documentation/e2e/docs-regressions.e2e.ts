import { type ChildProcess } from "node:child_process";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

import { ensureDevServer } from "./helpers/local-servers";

const DOCS_CWD = join(import.meta.dirname, "..");
const HOST = "127.0.0.1";
const BASE_PATH = "/graphql/hive-testing";
const DEV_PORT = 15_444;

test.describe.configure({ mode: "serial" });

test.describe("docs dev styles", () => {
  let child: ChildProcess | null = null;
  let baseUrl = `http://${HOST}:${DEV_PORT}`;

  test.beforeAll(async () => {
    test.setTimeout(90_000);

    const server = await ensureDevServer({
      cwd: DOCS_CWD,
      port: DEV_PORT,
    });

    baseUrl = server.baseUrl;
    child = server.child;
  });

  test.afterAll(() => {
    child?.kill();
  });

  test("base-prefixed TanStack dev styles load without redirects", async ({
    page,
  }) => {
    const stylesResponse = await fetch(
      `${baseUrl}${BASE_PATH}/@tanstack-start/styles.css?routes=__root__%2C%2Fdocs%2F%24`,
      { redirect: "manual" },
    );

    expect(stylesResponse.status).toBe(200);
    expect(stylesResponse.headers.get("content-type")).toContain("text/css");

    const failedStyleRequests: string[] = [];
    page.on("requestfailed", (request) => {
      if (request.url().includes("@tanstack-start/styles.css")) {
        failedStyleRequests.push(request.url());
      }
    });

    await page.goto(`${baseUrl}${BASE_PATH}/docs`, {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveTitle("Open-Source GraphQL Federation Platform");

    expect(failedStyleRequests).toEqual([]);
  });
});
