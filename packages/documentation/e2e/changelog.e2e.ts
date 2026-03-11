import { expect, test } from "@playwright/test";

import { appPath, appPathPattern } from "./paths";

const CHANGELOG_SEARCH_TERM =
  process.env["DEPLOYMENT_CHANGELOG_SEARCH_TERM"] ??
  "SUPERTOKENS_ACCESS_TOKEN_KEY";

async function openSidebarIfNeeded(
  page: import("@playwright/test").Page,
  isMobile: boolean,
) {
  if (!isMobile) return;

  const openSidebarButton = page
    .locator("#hive-navigation")
    .getByRole("button", { name: "Open Sidebar" });
  const mobileSidebar = page.locator("#nd-sidebar-mobile");

  await expect(openSidebarButton).toBeVisible();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await openSidebarButton.click();

    try {
      await expect(
        mobileSidebar.getByRole("button", { name: "Documentation" }),
      ).toBeVisible({ timeout: 2000 });
      return;
    } catch {}
  }

  await expect(
    mobileSidebar.getByRole("button", { name: "Documentation" }),
  ).toBeVisible();
}

async function clickChangelogSidebarLink(
  page: import("@playwright/test").Page,
  isMobile: boolean,
) {
  const changelogHref = appPath("/docs/schema-registry/self-hosting/changelog");
  const mobileSidebar = page.locator("#nd-sidebar-mobile");

  if (isMobile) {
    const documentationButton = mobileSidebar.getByRole("button", {
      name: "Documentation",
    });

    if ((await documentationButton.getAttribute("data-state")) !== "open") {
      await documentationButton.click();
    }
  }

  await (isMobile ? mobileSidebar : page)
    .locator(`a[href="${changelogHref}"]`)
    .click();
}

test("changelog page renders remote markdown with mdx components", async ({
  page,
}) => {
  await page.goto(appPath("/docs/schema-registry/self-hosting/changelog"), {
    waitUntil: "load",
  });

  await expect(page.getByText(CHANGELOG_SEARCH_TERM).first()).toBeVisible();
  await expect(page.locator(".shiki").first()).toBeVisible();
  await expect(page.locator(".animate-pulse")).toHaveCount(0);
  await expect(
    page
      .locator("figure.shiki")
      .filter({ hasText: "supertokens_key_value" })
      .locator(".line")
      .first(),
  ).toBeVisible();

  // I know this looks stupid, because we just called `.goto` but we're ensuring
  // we didn't get redirected.
  await expect(page).toHaveURL(
    appPathPattern("/docs/schema-registry/self-hosting/changelog"),
  );
});

test("client-side navigation keeps changelog content", async ({
  isMobile,
  page,
}) => {
  await page.goto(appPath("/docs/schema-registry/self-hosting/get-started"), {
    waitUntil: "load",
  });

  await openSidebarIfNeeded(page, isMobile);
  await clickChangelogSidebarLink(page, isMobile);

  await expect(page).toHaveURL(
    appPathPattern("/docs/schema-registry/self-hosting/changelog"),
  );
  await expect(page.getByText(CHANGELOG_SEARCH_TERM).first()).toBeVisible();
  await expect(page.locator(".animate-pulse")).toHaveCount(0);
  await expect(page.locator(".shiki").first()).toBeVisible();
});

test("changelog code blocks respect dark theme", async ({ isMobile, page }) => {
  await page.goto(appPath("/docs/schema-registry/self-hosting/changelog"), {
    waitUntil: "load",
  });

  if (isMobile) {
    await openSidebarIfNeeded(page, isMobile);
  }
  await page.locator("html").evaluate((element) => {
    element.classList.remove("light");
    element.classList.add("dark");
  });

  await expect(
    page
      .locator("figure.shiki")
      .filter({ hasText: "supertokens_key_value" })
      .locator(".line span")
      .first(),
  ).toHaveCSS("color", "rgb(249, 117, 131)");
});
