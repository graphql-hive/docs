import { expect, test } from "@playwright/test";
import { appPath, appPathPattern } from "./paths";

test.describe("Relative link resolution", () => {
  test("bare relative link resolves to absolute /docs/ URL", async ({
    page,
  }) => {
    const response = await page.goto(
      appPath("/docs/router/plugin-system/execution-and-lifecycle"),
      { waitUntil: "networkidle" },
    );
    if (!response?.ok()) {
      test.skip(true, "Page not available (needs build)");
    }

    const link = page.getByRole("link", {
      name: "supports OpenTelemetry at its core",
    });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      "href",
      appPath("/docs/router/observability/tracing"),
    );
  });

  test("relative .mdx link resolves to absolute /docs/ URL", async ({
    page,
  }) => {
    const response = await page.goto(
      appPath("/docs/router/guides/extending-the-router"),
      {
        waitUntil: "networkidle",
      },
    );
    if (!response?.ok()) {
      test.skip(true, "Page not available (needs build)");
    }

    const link = page.getByRole("link", {
      name: "custom plugins written in Rust",
    });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      "href",
      appPath("/docs/router/plugin-system"),
    );
  });

  test("clicking resolved relative link navigates successfully", async ({
    page,
  }) => {
    const response = await page.goto(
      appPath("/docs/router/guides/extending-the-router"),
      {
        waitUntil: "networkidle",
      },
    );
    if (!response?.ok()) {
      test.skip(true, "Page not available (needs build)");
    }

    await page
      .getByRole("link", { name: "custom plugins written in Rust" })
      .click();
    await expect(page).toHaveURL(appPathPattern("/docs/router/plugin-system"));
    await expect(
      page.getByRole("heading", { level: 1, name: "Plugin System" }),
    ).toBeVisible({ timeout: 10_000 });
  });
});
