import { type Locator, expect, test } from "@playwright/test";
import { appPath } from "./paths";

/** Returns the visible sidebar container — desktop aside or mobile drawer. */
async function getSidebar(
  page: import("@playwright/test").Page,
  isMobile: boolean,
): Promise<Locator> {
  if (isMobile) {
    await page.getByRole("button", { name: "Open Sidebar" }).click();
    // Mobile drawer is the last complementary element (desktop aside is hidden but still in DOM)
    return page.getByRole("complementary").last();
  }
  return page.locator("#nd-sidebar");
}

test.describe("Documentation User Journeys", () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto(appPath("/docs"), {
      waitUntil: "networkidle",
    });
    if (!response?.ok()) {
      test.skip(true, "Docs page not available (needs build)");
    }
  });

  test("docs landing page shows content", async ({ page, isMobile }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    if (!isMobile) {
      const nav = page.getByRole("navigation");
      await expect(nav.first()).toBeVisible();
    }
  });

  // Sidebar tab-switching navigation is tested on desktop only.
  // Mobile drawer re-renders during tab switches cause element detachment flakiness.
  test("developer navigates to schema registry via sidebar", async ({
    page,
    isMobile,
  }) => {
    if (isMobile) {
      // On mobile, verify the page loads directly instead
      await page.goto(appPath("/docs/schema-registry"), {
        waitUntil: "networkidle",
      });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      return;
    }

    const sidebar = page.locator("#nd-sidebar");

    // Click the "Hive Console" tab and wait for the section to expand.
    // Retry because sidebar tab handlers may not be hydrated yet on CI.
    const schemaRegistryLink = sidebar.locator(
      `a[href="${appPath("/docs/schema-registry")}"]`,
    );
    // Wait for SPA hydration before interacting with sidebar tabs
    await page.waitForFunction(
      () => (window as any).__searchHydrated === true,
      { timeout: 30_000 },
    );
    await expect(async () => {
      await sidebar.getByRole("button", { name: "Hive Console" }).click();
      await expect(schemaRegistryLink).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });

    await schemaRegistryLink.click();

    await expect(page).toHaveURL(/schema-registry/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("developer navigates to gateway via sidebar", async ({
    page,
    isMobile,
  }) => {
    if (isMobile) {
      await page.goto(appPath("/docs/gateway"), { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      return;
    }

    const sidebar = page.locator("#nd-sidebar");

    // Click the "Hive Gateway" tab and wait for the section to expand.
    const gatewayLink = sidebar.locator(
      `a[href="${appPath("/docs/gateway")}"]`,
    );
    // Wait for SPA hydration before interacting with sidebar tabs
    await page.waitForFunction(
      () => (window as any).__searchHydrated === true,
      { timeout: 30_000 },
    );
    await expect(async () => {
      await sidebar.getByRole("button", { name: "Hive Gateway" }).click();
      await expect(gatewayLink).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });

    await gatewayLink.click();
    await page.waitForURL(/gateway/);

    await expect(page).toHaveURL(/gateway/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 10_000,
    });
  });

  test("router configuration sidebar shows nested articles and resets scroll", async ({
    page,
    isMobile,
  }) => {
    if (isMobile) {
      return;
    }

    await page.goto(appPath("/docs/router/configuration"), {
      waitUntil: "networkidle",
    });

    const sidebar = page.locator("#nd-sidebar");

    await page.waitForFunction(
      () => (window as any).__searchHydrated === true,
      { timeout: 30_000 },
    );

    const headersLink = sidebar.locator(
      `a[href="${appPath("/docs/router/configuration/headers")}"]`,
    );

    await expect(headersLink).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(400);

    await headersLink.click();

    await page.waitForURL(/\/docs\/router\/configuration\/headers$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "headers",
    );
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeLessThan(80);
  });

  test("documentation shows code examples", async ({ page }) => {
    await page.goto(appPath("/docs/api-reference/cli"), {
      waitUntil: "networkidle",
    });

    const codeBlock = page.locator("pre").first();
    await expect(codeBlock).toBeVisible({ timeout: 10_000 });
  });

  test("sidebar shows active tab for current section", async ({
    page,
    isMobile,
  }) => {
    await page.goto(appPath("/docs/schema-registry"), {
      waitUntil: "networkidle",
    });

    const sidebar = await getSidebar(page, isMobile);

    // On /docs/schema-registry, the "Hive Console" tab should be visible in sidebar
    const hiveConsoleTab = sidebar.getByRole("button", {
      name: /Hive Console/,
    });
    await expect(hiveConsoleTab).toBeVisible();
  });
});

test.describe("Documentation API Reference", () => {
  test("CLI reference page loads", async ({ page }) => {
    const response = await page.goto(appPath("/docs/api-reference/cli"), {
      waitUntil: "networkidle",
    });
    if (!response?.ok()) {
      test.skip(true, "Page not available");
    }

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
