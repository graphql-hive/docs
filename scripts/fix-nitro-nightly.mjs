/**
 * Workaround for nitro-nightly self-reference bug.
 * nitro-nightly imports from "nitro/meta" expecting self-reference,
 * but its package name is "nitro-nightly", not "nitro".
 * This creates a symlink so the import resolves correctly.
 *
 * Also patches a bug in nitro's cloudflare-module preset where
 * `"..".repeat(n)` produces `"...."`  instead of `"../.."` when
 * generating the wrangler assets directory for baseURL with multiple
 * path segments. We replace the broken expression with a simple
 * `relative(configDir, publicDir)`.
 * See: https://github.com/unjs/nitro/issues/XXXX
 */
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
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

  // Patch the wrangler assets.directory bug in cloudflare-module preset.
  // `"..".repeat(n)` produces `"...."`  instead of `"../.."`.
  const presetsPath = join(nitroNightlyPkg, "dist", "_presets.mjs");
  if (existsSync(presetsPath)) {
    const buggy =
      'resolve$1(nitro.options.output.publicDir, "..".repeat(nitro.options.baseURL.split("/").filter(Boolean).length))';
    const fixed = "nitro.options.output.publicDir";
    const content = readFileSync(presetsPath, "utf8");
    if (content.includes(buggy)) {
      writeFileSync(presetsPath, content.replace(buggy, fixed));
      console.log(
        `[fix-nitro-nightly] Patched wrangler assets.directory bug in ${nitroNightlyDir}`,
      );
    }
  }
}
