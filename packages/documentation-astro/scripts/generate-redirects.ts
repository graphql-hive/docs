import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { routeRules } from "../../documentation/redirects.ts";

const outputDirectory = fileURLToPath(new URL("../dist", import.meta.url));
const outputFile = fileURLToPath(
  new URL("../dist/_redirects", import.meta.url),
);

const redirects = Object.entries(routeRules)
  .map(([source, rule]) => {
    if (!rule.redirect || typeof rule.redirect === "string") {
      throw new Error(`Expected ${source} to contain a redirect object`);
    }

    return {
      source: source.replace(/\/\*\*$/, "/*"),
      destination: rule.redirect.to,
      status: rule.redirect.status,
    };
  })
  .sort(
    (a, b) => Number(a.source.endsWith("/*")) - Number(b.source.endsWith("/*")),
  );

const contents = [
  "# Generated from packages/documentation/redirects.ts. Do not edit manually.",
  ...redirects.map(
    ({ source, destination, status }) => `${source} ${destination} ${status}`,
  ),
  "",
].join("\n");

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, contents);

console.log(`Generated ${redirects.length} redirects in ${outputFile}`);
