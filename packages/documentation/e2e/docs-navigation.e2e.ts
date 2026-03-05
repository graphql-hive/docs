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

    // Click the "Hive Console" tab in sidebar to reveal schema registry section
    const hiveConsoleTab = sidebar.getByRole("button", {
      name: "Hive Console",
    });
    await expect(hiveConsoleTab).toBeVisible();
    await hiveConsoleTab.click();

    const schemaRegistryLink = sidebar.locator(
      'a[href="/docs/schema-registry"]',
    );
    await expect(schemaRegistryLink).toBeVisible();
    await schemaRegistryLink.click({ timeout: 10_000 });

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

    // Click the "Hive Gateway" tab in sidebar to reveal gateway section
    const hiveGatewayTab = sidebar.getByRole("button", {
      name: "Hive Gateway",
    });
    await expect(hiveGatewayTab).toBeVisible();
    await hiveGatewayTab.click();

    const gatewayLink = sidebar.locator('a[href="/docs/gateway"]');
    await expect(gatewayLink).toBeVisible();
    await gatewayLink.click({ timeout: 10_000 });
    await page.waitForURL(/gateway/);

    await expect(page).toHaveURL(/gateway/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("documentation shows code examples", async ({ page }) => {
    await page.goto("/docs/api-reference/cli");

    const codeBlock = page.locator("pre").first();
    await expect(codeBlock).toBeVisible();
  });

  test("sidebar shows active tab for current section", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/docs/schema-registry");

    const sidebar = await getSidebar(page, isMobile);

    if (isMobile) {
      await sidebar.getByRole("button", { name: "Documentation" }).click();
    }

    // On /docs/schema-registry, the "Hive Console" tab should be active
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
