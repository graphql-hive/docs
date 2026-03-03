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

const nitroNightlyDirs = readdirSync(bunCache).filter((d) =>
  d.startsWith("nitro-nightly@"),
);

if (nitroNightlyDirs.length === 0) {
  console.log("[fix-nitro-nightly] nitro-nightly not found, skipping");
  process.exit(0);
}

for (const nitroNightlyDir of nitroNightlyDirs) {
  const nodeModules = join(bunCache, nitroNightlyDir, "node_modules");
  const nitroSymlink = join(nodeModules, "nitro");
  const nitroNightlyPkg = join(nodeModules, "nitro-nightly");

  try {
    symlinkSync(nitroNightlyPkg, nitroSymlink);
    console.log(`[fix-nitro-nightly] Created symlink for ${nitroNightlyDir}`);
  } catch (err) {
    if (err.code === "EEXIST") {
      const stat = lstatSync(nitroSymlink);
      if (!stat.isSymbolicLink()) {
        console.error(
          "[fix-nitro-nightly] File exists but not a symlink:",
          nitroSymlink,
        );
      }
    } else {
      console.error("[fix-nitro-nightly] Failed:", err.message);
      process.exit(1);
    }
  }
}
