import { expect, test } from "@playwright/test";

import { appPath, appPathPattern } from "./paths";

const CHANGELOG_SEARCH_TERM =
  process.env["DEPLOYMENT_CHANGELOG_SEARCH_TERM"] ??
  "SUPERTOKENS_ACCESS_TOKEN_KEY";

test("changelog page renders remote markdown with mdx components", async ({
  page,
}) => {
  await page.goto(appPath("/docs/schema-registry/self-hosting/changelog"), {
    waitUntil: "load",
  });

  await expect(page.getByText(CHANGELOG_SEARCH_TERM).first()).toBeVisible();
  await expect(page.locator(".shiki").first()).toBeVisible();
  await expect(page.getByText("SELECT").first()).toBeVisible();

  // I know this looks stupid, because we just called `.goto` but we're ensuring
  // we didn't get redirected.
  await expect(page).toHaveURL(
    appPathPattern("/docs/schema-registry/self-hosting/changelog"),
  );
});

test("client-side navigation keeps changelog content", async ({ page }) => {
  await page.goto(appPath("/docs/schema-registry/self-hosting/get-started"), {
    waitUntil: "load",
  });

  await page
    .getByRole("link", { name: "Self-hosting Changelog" })
    .first()
    .click();

  await expect(page).toHaveURL(
    appPathPattern("/docs/schema-registry/self-hosting/changelog"),
  );
  await expect(page.getByText(CHANGELOG_SEARCH_TERM).first()).toBeVisible();
  await expect(page.locator(".shiki").first()).toBeVisible();
});
