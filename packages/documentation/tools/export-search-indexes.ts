import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { buildIndexes } from "../src/lib/search-indexes";

async function main() {
  const outputArg = process.argv[2] || "./.output/search/indexes.json";
  const outputPath = resolve(outputArg);
  const indexes = await buildIndexes();

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(indexes));

  process.stdout.write(
    `Exported ${indexes.length} indexes to ${outputPath}\n`,
  );
}

await main();
