import { expect, test } from "@playwright/test";

test.describe("Documentation", () => {
  test("homepage loads and displays content", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Hive|Docs/i);
  });

  test("docs index page loads and displays content", async ({ page }) => {
    await page.goto("/docs");

    await expect(
      page.getByRole("heading", { name: "Hello World" }),
    ).toBeVisible();
    await expect(page.getByText("Your favourite docs framework")).toBeVisible();
  });

  test("docs page has sidebar", async ({ page }) => {
    await page.goto("/docs");

    // Fumadocs uses aside element for sidebar
    await expect(page.locator("aside")).toBeVisible();
  });

  test("code blocks render correctly", async ({ page }) => {
    await page.goto("/docs");

    // Check that code block with syntax highlighting is rendered
    const codeBlock = page.locator("pre code");
    await expect(codeBlock).toBeVisible();
    await expect(codeBlock).toContainText("console.log");
  });

  test("table renders correctly", async ({ page }) => {
    await page.goto("/docs");

    const table = page.getByRole("table");
    await expect(table).toBeVisible();
    // Check for content that exists in the table
    await expect(table).toContainText("hello");
  });
});
