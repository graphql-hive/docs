import { expect, test } from "@playwright/test";

test.describe("Search User Journeys", () => {
  test("developer uses search to find federation info", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Search documentation" }).click();

    const searchInput = page.getByRole("textbox");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("federation");
    await expect(searchInput).toHaveValue("federation");

    const result = page.getByRole("dialog").locator("button[aria-selected]");
    const noResults = page.getByText("No results found");
    await expect(result.first().or(noResults)).toBeVisible({
      timeout: 30_000,
    });
  });

  test("search results navigate to docs", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Search documentation" }).click();

    const searchInput = page.getByRole("textbox");
    await searchInput.fill("schema registry");

    const firstResult = page
      .getByRole("dialog")
      .locator("button[aria-selected]")
      .first();
    await expect(firstResult).toBeVisible({ timeout: 10_000 });
    await firstResult.click();

    await expect(page).toHaveURL(/docs/);
  });

  test("search is available on pricing page", async ({ page }) => {
    await page.goto("/pricing");

    const searchButton = page.getByRole("button", {
      name: "Search documentation",
    });
    await expect(searchButton).toBeVisible();
  });
});
