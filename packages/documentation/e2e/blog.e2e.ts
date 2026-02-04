import { expect, test } from "@playwright/test";

test.describe("Content User Journeys", () => {
  test("user reads case study to evaluate Hive for their company", async ({
    page,
  }) => {
    await page.goto("/case-studies");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Target the "Explore customer stories" section which contains case study cards
    // FeaturedCaseStudiesGrid is hidden on mobile (max-xl:hidden) so we use AllCaseStudiesList
    const storiesSection = page.locator("section", {
      has: page.getByRole("heading", { name: "Explore customer stories" }),
    });
    const caseStudyLinks = storiesSection.locator('a[href^="/case-studies/"]');
    await caseStudyLinks.first().scrollIntoViewIfNeeded();
    await expect(caseStudyLinks.first()).toBeVisible();
  });

  test("user checks product updates to see recent improvements", async ({
    page,
  }) => {
    await page.goto("/product-updates");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Sees list of updates
    const updates = page.locator("li");
    await expect(updates.first()).toBeVisible();
  });

  test("user explores ecosystem and partner pages", async ({ page }) => {
    await page.goto("/ecosystem");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.goto("/partners");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await expect(page.locator("p").first()).toBeVisible();
  });

  test("user checks OSS friends page and discovers related projects", async ({
    page,
  }) => {
    await page.goto("/oss-friends");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const projectLinks = page.locator('dl a[href^="http"]');

    await projectLinks.first().scrollIntoViewIfNeeded();
    await expect(projectLinks.first()).toBeVisible();
  });
});
