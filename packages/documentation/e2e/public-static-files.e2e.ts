import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

import { parseStaticFilesManifest } from "../tools/parse-static-files-manifest";
import { appPath } from "./paths";

const MANIFEST_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../PUBLIC_STATIC_FILES_MANIFEST.md",
);
const manifestFiles = parseStaticFilesManifest(MANIFEST_PATH);

test.describe("Public static files from manifest", () => {
  for (const file of manifestFiles) {
    test(`${file} is fetchable`, async ({ request }) => {
      const response = await request.head(appPath(`/${file}`));
      expect(
        response.status(),
        `Expected ${file} to be served, got ${response.status()}`,
      ).toBe(200);
    });
  }
});
