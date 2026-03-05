import { type Locator, expect, test } from "@playwright/test";

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
    const response = await page.goto("/docs");
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
      await page.goto("/docs/schema-registry");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      return;
    }

    const sidebar = page.locator("#nd-sidebar");

    // Click the "Hive Console" tab and wait for the section to expand.
    // Retry because sidebar tab handlers may not be hydrated yet on CI.
    const schemaRegistryLink = sidebar.locator(
      'a[href="/docs/schema-registry"]',
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
      await page.goto("/docs/gateway");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      return;
    }

    const sidebar = page.locator("#nd-sidebar");

    // Click the "Hive Gateway" tab and wait for the section to expand.
    const gatewayLink = sidebar.locator('a[href="/docs/gateway"]');
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

  test("documentation shows code examples", async ({ page }) => {
    await page.goto("/docs/api-reference/cli");

    const codeBlock = page.locator("pre").first();
    await expect(codeBlock).toBeVisible({ timeout: 10_000 });
  });

  test("sidebar shows active tab for current section", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/docs/schema-registry");

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
    const response = await page.goto("/docs/api-reference/cli");
    if (!response?.ok()) {
      test.skip(true, "Page not available");
    }

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
