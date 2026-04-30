import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const prerenderedSearchIndexPath =
  "./.output/public/graphql/hive/api/search.json";

async function main() {
  const outputArg = process.argv[2] || "./.output/search/indexes.json";
  const outputPath = resolve(outputArg);

  await mkdir(dirname(outputPath), { recursive: true });
  await copyFile(resolve(prerenderedSearchIndexPath), outputPath);

  process.stdout.write(
    `Exported search indexes from ${resolve(prerenderedSearchIndexPath)} to ${outputPath}\n`,
  );
}

await main();
