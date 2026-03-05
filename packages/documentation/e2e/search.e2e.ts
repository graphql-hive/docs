import { expect, test } from "@playwright/test";

/**
 * Click the visible search button and wait for the search dialog to appear.
 * Waits for React hydration first, then retries clicking until the dialog opens.
 */
async function openSearch(page: import("@playwright/test").Page) {
  const searchButton = page
    .getByRole("button", { name: "Search documentation" })
    .first();
  const dialog = page.getByRole("dialog");

  await expect(searchButton).toBeVisible();

  // Wait for the SPA to hydrate — SearchTrigger sets this flag in useEffect.
  await page.waitForFunction(() => (window as any).__searchHydrated === true, {
    timeout: 30_000,
  });

  // Retry clicking until the search dialog appears (SearchProvider's keydown
  // listener may register slightly after our hydration marker).
  await expect(async () => {
    await searchButton.click();
    await expect(dialog).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 15_000 });
}

/** Wait for search results or "No results found" to appear in the dialog. */
async function waitForSearchResults(
  page: import("@playwright/test").Page,
  timeout = 30_000,
) {
  const result = page.getByRole("dialog").locator("button[aria-selected]");
  const noResults = page.getByText("No results found");
  await expect(result.first().or(noResults)).toBeVisible({ timeout });
  return result;
}

test.describe("Search User Journeys", () => {
  test("developer uses search to find federation info", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    await openSearch(page);

    const searchInput = page.getByRole("textbox");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("federation");
    await expect(searchInput).toHaveValue("federation");

    await waitForSearchResults(page);
  });

  test("search results navigate to docs", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    await openSearch(page);

    const searchInput = page.getByRole("textbox");
    await searchInput.fill("schema registry");

    const result = await waitForSearchResults(page);
    await result.first().click();

    await expect(page).toHaveURL(/docs/);
  });

  test("search is available on pricing page", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "networkidle" });

    const searchButton = page
      .getByRole("button", { name: "Search documentation" })
      .first();
    await expect(searchButton).toBeVisible();
  });
});
