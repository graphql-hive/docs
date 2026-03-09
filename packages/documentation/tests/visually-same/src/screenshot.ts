import {
  type Browser,
  type BrowserContext,
  chromium,
  type Page,
} from "playwright";

import { config } from "./config.js";

export async function captureScreenshot(
  page: Page,
  path: string,
): Promise<void> {
  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path,
  });
}

export async function setupBrowser(): Promise<{
  browser: Browser;
  context: BrowserContext;
  page: Page;
}> {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: config.viewport,
  });
  const page = await context.newPage();

  return { browser, context, page };
}

async function isPageBlank(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const body = document.body;
    if (!body) return true;
    // Blank if body has no visible content (just whitespace or empty)
    return (
      body.innerText.trim().length < 50 &&
      body.querySelectorAll("img, svg, canvas").length === 0
    );
  });
}

export async function navigateAndScreenshot(
  page: Page,
  url: string,
  outputPath: string,
  waitMs = 2000,
  retries = 3,
): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await page.goto(url, {
        timeout: 30_000,
        waitUntil: "load",
      });

      // Wait for dynamic content to settle
      await page.waitForTimeout(waitMs);

      // Retry if page rendered blank (SSR timeout / hydration not done)
      if (attempt < retries && (await isPageBlank(page))) {
        await page.waitForTimeout(3000);
        continue;
      }

      await captureScreenshot(page, outputPath);
      return;
    } catch (error: unknown) {
      if (attempt === retries) throw error;
      await page.waitForTimeout(5000);
    }
  }
}

export async function takeScreenshot(
  url: string,
  outputPath: string,
  waitMs = 2000,
): Promise<void> {
  const { browser, context, page } = await setupBrowser();

  try {
    await navigateAndScreenshot(page, url, outputPath, waitMs);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message?.includes("net::ERR_CONNECTION_REFUSED")
    ) {
      throw new Error(
        `Cannot connect to ${url}\n\nPlease start the preview server first:\n  bun run preview`,
      );
    }
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export async function takeAllScreenshots(
  suffix: "baseline" | "local" | "production",
  onProgress?: (current: number, total: number, page: string) => void,
): Promise<void> {
  const { baseUrl, pages, productionUrl, screenshotsDir } = config;
  const { browser, context, page } = await setupBrowser();

  // Determine which URL to use
  const useProduction = suffix === "production";
  const baseUrlToUse = useProduction ? productionUrl : baseUrl;

  try {
    for (let i = 0; i < pages.length; i++) {
      const pageConfig = pages[i];
      const url = `${baseUrlToUse}${pageConfig.path}`;
      const outputPath = `${screenshotsDir}/${pageConfig.name}-${suffix}.png`;

      if (onProgress) {
        onProgress(i + 1, pages.length, pageConfig.name);
      }

      try {
        await navigateAndScreenshot(page, url, outputPath);
      } catch (error: unknown) {
        process.stderr.write(
          `  ⚠ Failed to screenshot ${pageConfig.name}: ${error instanceof Error ? error.message.split("\n")[0] : error}\n`,
        );
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }
}
