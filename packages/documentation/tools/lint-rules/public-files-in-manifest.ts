import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import type { ESLint, Rule } from "eslint";
import { parseStaticFilesManifest } from "../parse-static-files-manifest";

const MANIFEST_FILENAME = "PUBLIC_STATIC_FILES_MANIFEST.md";
const PUBLIC_DIR = "public";

function walkDir(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

let cachedResult: { missing: string[] } | undefined;

function getMissingFiles(cwd: string): string[] {
  if (cachedResult) return cachedResult.missing;

  const manifestPath = join(cwd, MANIFEST_FILENAME);
  const publicDir = join(cwd, PUBLIC_DIR);

  let manifestFiles: Set<string>;
  try {
    manifestFiles = new Set(parseStaticFilesManifest(manifestPath));
  } catch {
    cachedResult = { missing: [] };
    return [];
  }

  let allPublicFiles: string[];
  try {
    allPublicFiles = walkDir(publicDir).map((f) => relative(publicDir, f));
  } catch {
    cachedResult = { missing: [] };
    return [];
  }

  const missing = allPublicFiles.filter((f) => !manifestFiles.has(f));
  cachedResult = { missing };
  return missing;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure all files in public/ are listed in PUBLIC_STATIC_FILES_MANIFEST.md",
    },
    messages: {
      missingFromManifest:
        "Public file(s) not in PUBLIC_STATIC_FILES_MANIFEST.md: {{ files }}",
    },
    schema: [],
  },
  create(context) {
    const cwd =
      context.settings?.["publicFilesManifest.cwd"] ??
      context.cwd ??
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      context.getCwd?.() ??
      process.cwd();

    return {
      Program(node) {
        const missing = getMissingFiles(cwd as string);
        if (missing.length > 0) {
          context.report({
            node,
            messageId: "missingFromManifest",
            data: { files: missing.join(", ") },
          });
        }
      },
    };
  },
};

export const plugin: ESLint.Plugin = {
  rules: {
    "public-files-in-manifest": rule,
  },
};
