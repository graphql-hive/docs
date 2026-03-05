import { defineConfig, devices } from "@playwright/test";

const PORT = 1440;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  expect: {
    timeout: process.env["CI"] ? 15_000 : 5000,
    toHaveScreenshot: {
      // Strip platform from snapshot path — font rendering diffs are handled by maxDiffPixelRatio
      pathTemplate: "{snapshotDir}/{arg}-{projectName}{ext}",
    },
  },
  forbidOnly: !!process.env["CI"],
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "webkit" },
    },
  ],
  reporter: "html",
  retries: process.env["CI"] ? 2 : 0,
  testDir: "./e2e",
  testMatch: "**/*.{spec,e2e}.ts",
  timeout: process.env["CI"] ? 60_000 : 30_000,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: process.env["CI"] ? `bun run start` : "bun run dev",
    env: { PORT: String(PORT) },
    reuseExistingServer: !process.env["CI"],
    timeout: 120_000,
    url: baseURL,
  },
  workers: process.env["CI"] ? 1 : undefined,
});
