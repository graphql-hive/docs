import { expect, test } from "@playwright/test";

/**
 * Click the visible search button and wait for the search dialog to appear.
 * Retries clicking because the search handler may not be hydrated yet on CI.
 */
async function openSearch(page: import("@playwright/test").Page) {
  const searchButton = page
    .getByRole("button", { name: "Search documentation" })
    .first();
  const dialog = page.getByRole("dialog");

  await expect(searchButton).toBeVisible();

  // The search dialog is mounted by JS — on slow CI the handler may not be
  // attached yet when the button first becomes clickable. Retry the click
  // until the dialog appears.
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
    await page.goto("/");

    await openSearch(page);

    const searchInput = page.getByRole("textbox");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("federation");
    await expect(searchInput).toHaveValue("federation");

    await waitForSearchResults(page);
  });

  test("search results navigate to docs", async ({ page }) => {
    await page.goto("/");

    await openSearch(page);

    const searchInput = page.getByRole("textbox");
    await searchInput.fill("schema registry");

    const result = await waitForSearchResults(page);
    await result.first().click();

    await expect(page).toHaveURL(/docs/);
  });

  test("search is available on pricing page", async ({ page }) => {
    await page.goto("/pricing");

    const searchButton = page
      .getByRole("button", { name: "Search documentation" })
      .first();
    await expect(searchButton).toBeVisible();
  });
});
