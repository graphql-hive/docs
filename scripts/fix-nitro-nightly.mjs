/**
 * Workaround for nitro-nightly self-reference bug.
 * nitro-nightly imports from "nitro/meta" expecting self-reference,
 * but its package name is "nitro-nightly", not "nitro".
 * This creates a symlink so the import resolves correctly.
 */
import { readdirSync, symlinkSync, existsSync, lstatSync } from "node:fs";
import { join } from "node:path";

const bunCache = join(process.cwd(), "node_modules", ".bun");

if (!existsSync(bunCache)) {
  console.log("[fix-nitro-nightly] No .bun cache found, skipping");
  process.exit(0);
}

const nitroNightlyDir = readdirSync(bunCache).find((d) =>
  d.startsWith("nitro-nightly@")
);

if (!nitroNightlyDir) {
  console.log("[fix-nitro-nightly] nitro-nightly not found, skipping");
  process.exit(0);
}

const nodeModules = join(bunCache, nitroNightlyDir, "node_modules");
const nitroSymlink = join(nodeModules, "nitro");
const nitroNightlyPkg = join(nodeModules, "nitro-nightly");

try {
  symlinkSync(nitroNightlyPkg, nitroSymlink);
} catch (err) {
  if (err.code === "EEXIST") {
    const stat = lstatSync(nitroSymlink);
    if (stat.isSymbolicLink()) {
      //  symlink already exists, we're good
      process.exit(0);
    } else {
      console.error(
        "[fix-nitro-nightly] File exists but it's not a symlink:",
        err.message
      );
    }
  } else {
    console.error("[fix-nitro-nightly] Failed to create symlink:", err.message);
    process.exit(1);
  }
}
