import { expect, test } from "@playwright/test";
import { appPath } from "./paths";

test.describe("Content User Journeys", () => {
  test("user reads case study to evaluate Hive for their company", async ({
    page,
  }) => {
    await page.goto(appPath("/case-studies"));

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Target the "Explore customer stories" section which contains case study cards
    // FeaturedCaseStudiesGrid is hidden on mobile (max-xl:hidden) so we use AllCaseStudiesList
    const storiesSection = page.locator("section", {
      has: page.getByRole("heading", { name: "Explore customer stories" }),
    });
    const caseStudyLinks = storiesSection.locator(
      `a[href^="${appPath("/case-studies/")}"]`,
    );
    await caseStudyLinks.first().scrollIntoViewIfNeeded();
    await expect(caseStudyLinks.first()).toBeVisible();
  });

  test("user checks product updates to see recent improvements", async ({
    page,
  }) => {
    await page.goto(appPath("/product-updates"));

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Sees list of product update entries
    const updates = page.locator(`a[href^="${appPath("/product-updates/")}"]`);
    await expect(updates.first()).toBeVisible();
  });

  test("user explores ecosystem page and discovers libraries", async ({
    page,
  }) => {
    await page.goto(appPath("/ecosystem"));

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Everything you need to scale your API infrastructure",
      }),
    ).toBeVisible();

    // Verify key section headings exist
    await expect(
      page.getByRole("heading", { level: 2, name: "Schema Evolution" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Gateway" }),
    ).toBeVisible();

    // Product cards are inside grid ul elements, each li has a link
    const productGrid = page.locator("ul.grid");
    await productGrid.first().scrollIntoViewIfNeeded();
    await expect(productGrid.first()).toBeVisible();
    const productLinks = productGrid.locator("a[href]");
    expect(await productLinks.count()).toBeGreaterThan(5);
  });

  test("user checks partner page and sees solutions", async ({ page }) => {
    await page.goto(appPath("/partners"));

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Why partner with us?" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Solution Partners" }),
    ).toBeVisible();

    // Partner links include UTM tracking
    const partnerLinks = page.locator('a[href*="utm_source=hive"]');
    await expect(partnerLinks.first()).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Frequently Asked Questions" }),
    ).toBeVisible();
  });

  test("user checks OSS friends page and discovers related projects", async ({
    page,
  }) => {
    await page.goto(appPath("/oss-friends"));

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Open Source Friends",
      }),
    ).toBeVisible();

    // Each friend card is an <a> with a <dt> for the name
    const friendCards = page.locator("a[href^='http'] dt");
    await expect(friendCards.first()).toBeVisible();
    expect(await friendCards.count()).toBeGreaterThan(5);
  });
});
