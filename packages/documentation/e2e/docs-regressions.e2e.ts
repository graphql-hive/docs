import { expect, test } from "@playwright/test";

import { appPath } from "./paths";

async function waitForHydration(page: import("@playwright/test").Page) {
  await page.waitForFunction(() => (window as any).__searchHydrated === true, {
    timeout: 30_000,
  });
}

test.describe("Documentation regressions", () => {
  test("copy markdown uses the base-prefixed markdown endpoint", async ({
    browserName,
    context,
    page,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Clipboard readback is chromium-only",
    );

    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(appPath("/docs"), { waitUntil: "networkidle" });
    await waitForHydration(page);

    const markdownResponse = page.waitForResponse((response) =>
      response.url().includes("/graphql/hive-testing/docs.mdx"),
    );

    await page.getByRole("button", { name: "Copy Markdown" }).click();

    expect((await markdownResponse).ok()).toBe(true);
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toContain("title:");
  });

  test("gateway toc links keep the hash and scroll to the target heading", async ({
    browserName,
    page,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Covers desktop Gateway ToC behavior",
    );

    await page.goto(appPath("/docs/gateway/authorization-authentication"), {
      waitUntil: "networkidle",
    });
    await waitForHydration(page);
    await page.getByRole("link", { name: "Execution Rejection" }).waitFor();

    await page.getByRole("link", { name: "Execution Rejection" }).click();

    await expect(page).toHaveURL(
      /\/graphql\/hive-testing\/docs\/gateway\/authorization-authentication\/?#execution-rejection$/,
    );
    await expect(page.locator("#execution-rejection")).toBeInViewport();
  });

  test("direct hash load scrolls gateway docs to the target heading", async ({
    browserName,
    page,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Covers desktop initial hash navigation behavior",
    );

    await page.goto(
      appPath("/docs/gateway/authorization-authentication#execution-rejection"),
      {
        waitUntil: "networkidle",
      },
    );
    await waitForHydration(page);

    await expect(page).toHaveURL(
      /\/graphql\/hive-testing\/docs\/gateway\/authorization-authentication\/?#execution-rejection$/,
    );
    await expect(page.locator("#execution-rejection")).toBeInViewport();
  });

  test("direct hash load scrolls changelog docs to the target heading", async ({
    browserName,
    page,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Covers desktop initial hash navigation on async changelog docs",
    );

    await page.goto(
      appPath("/docs/schema-registry/self-hosting/changelog#8-14-1"),
      {
        waitUntil: "networkidle",
      },
    );
    await waitForHydration(page);
    await expect(page.locator(".animate-pulse")).toHaveCount(0);

    await expect(page).toHaveURL(
      /\/graphql\/hive-testing\/docs\/schema-registry\/self-hosting\/changelog\/?#8-14-1$/,
    );
    await expect(page.locator('[id="8-14-1"]')).toBeInViewport();
  });
});
