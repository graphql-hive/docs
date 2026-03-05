import { expect, test } from "@playwright/test";

test.describe("Landing Page User Journeys", () => {
  test("new visitor explores Hive and decides to sign up", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    if (!isMobile) {
      const heroList = page.locator("ul").first();
      await expect(heroList.getByRole("listitem").first()).toBeVisible();
    }

    const featureTabs = page.getByRole("tablist").first();
    await featureTabs.scrollIntoViewIfNeeded();
    await expect(featureTabs).toBeVisible();

    const tabs = featureTabs.getByRole("tab");
    await expect(tabs.first()).toBeVisible();

    if (isMobile) {
      // On mobile, tabs render as a dropdown - only active tab is visible.
      // Clicking the active tab opens the dropdown, revealing all tabs.
      await tabs.first().click();
    }
    await tabs.nth(1).click();
    await expect(page.getByRole("tabpanel").first()).toBeVisible();

    const signUpCta = page.getByRole("link", { name: /get started/i }).first();
    await expect(signUpCta).toHaveAttribute("href", /app\.graphql-hive\.com/);
  });

  test("developer navigates to federation page", async ({ page }) => {
    await page.goto("/");

    const federationLink = page
      .locator("p")
      .getByRole("link", { name: /federation/i })
      .first();
    await federationLink.click();
    await page.waitForURL("/federation");

    await expect(page).toHaveURL("/federation");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("developer navigates to gateway page", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "gateway", exact: true }).click();
    await page.waitForURL("/gateway");

    await expect(page).toHaveURL("/gateway");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  test("user navigates to pricing via nav", async ({ page, isMobile }) => {
    await page.goto("/");

    if (isMobile) {
      // On mobile, the nav is hidden — navigate via footer link
      const footerPricing = page.getByRole("contentinfo").getByRole("link", {
        name: /pricing/i,
      });
      await footerPricing.scrollIntoViewIfNeeded();
      await footerPricing.click();
    } else {
      const nav = page.getByRole("navigation", { name: "Navigation Menu" });
      await nav.getByRole("link", { name: /pricing/i }).click();
    }
    await page.waitForURL("/pricing");

    await expect(page).toHaveURL("/pricing");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("FAQ accordion expands on click", async ({ page }) => {
    await page.goto("/");

    const faqHeading = page.getByRole("heading", {
      name: "Frequently Asked Questions",
    });
    await faqHeading.scrollIntoViewIfNeeded();
    await expect(faqHeading).toBeVisible();

    // FAQ items are headings with trigger buttons inside (Base UI Accordion)
    const faqSection = page.locator("section", { has: faqHeading });
    const faqTrigger = faqSection.getByRole("button").first();
    await expect(faqTrigger).toBeVisible();
    await faqTrigger.click();

    // After clicking, a region (panel) should become visible
    await expect(faqSection.getByRole("region").first()).toBeVisible();
  });

  test("testimonials section shows company tabs", async ({ page }) => {
    await page.goto("/");

    const tabLists = page.getByRole("tablist");
    const testimonialTabs = tabLists.nth(1);
    await expect(testimonialTabs).toBeAttached();
    await testimonialTabs.scrollIntoViewIfNeeded();

    const tabs = testimonialTabs.getByRole("tab");
    await expect(tabs.first()).toBeVisible();
    expect(await tabs.count()).toBeGreaterThan(0);
  });

  test("visual regression", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page).toHaveScreenshot("landing-page.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("navigation menu is accessible", async ({ page, isMobile }) => {
    await page.goto("/");

    if (isMobile) {
      // On mobile, the full nav is hidden — verify the compact top bar is present
      const searchButton = page
        .getByRole("button", { name: "Search documentation" })
        .first();
      await expect(searchButton).toBeVisible();

      const sidebarButton = page.getByRole("button", {
        name: "Open Sidebar",
      });
      await expect(sidebarButton).toBeVisible();
    } else {
      const nav = page.getByRole("navigation", { name: "Navigation Menu" });
      await expect(nav).toBeVisible();
      await expect(nav.getByRole("link", { name: /pricing/i })).toBeVisible();
    }
  });
});
