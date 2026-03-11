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

  await page.getByRole("button", { name: "Open Sidebar" }).click();
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
  await page
    .getByRole("link", { name: "Self-hosting Changelog" })
    .first()
    .click();

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
