import type { ESLint, Rule } from "eslint";

import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

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

let cachedResult: { error?: string; missing: string[] } | undefined;

function getMissingFiles(cwd: string): { error?: string; missing: string[] } {
  if (cachedResult) return cachedResult;

  const manifestPath = join(cwd, MANIFEST_FILENAME);
  const publicDir = join(cwd, PUBLIC_DIR);

  let manifestFiles: Set<string>;
  try {
    manifestFiles = new Set(parseStaticFilesManifest(manifestPath));
  } catch {
    cachedResult = {
      error: `Cannot read ${MANIFEST_FILENAME}`,
      missing: [],
    };
    return cachedResult;
  }

  let allPublicFiles: string[];
  try {
    allPublicFiles = walkDir(publicDir).map((f) => relative(publicDir, f));
  } catch {
    cachedResult = {
      error: `Cannot read ${PUBLIC_DIR}/ directory`,
      missing: [],
    };
    return cachedResult;
  }

  const missing = allPublicFiles.filter((f) => !manifestFiles.has(f));
  cachedResult = { missing };
  return cachedResult;
}

const rule: Rule.RuleModule = {
  create(context) {
    const cwd =
      context.settings?.["publicFilesManifest.cwd"] ??
      context.cwd ??
      context.getCwd?.() ??
      process.cwd();

    return {
      Program(node) {
        const result = getMissingFiles(cwd as string);
        if (result.error) {
          context.report({
            data: { error: result.error },
            messageId: "readError",
            node,
          });
        }
        if (result.missing.length > 0) {
          context.report({
            data: { files: result.missing.join(", ") },
            messageId: "missingFromManifest",
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        "Ensure all files in public/ are listed in PUBLIC_STATIC_FILES_MANIFEST.md",
    },
    messages: {
      missingFromManifest:
        "Public file(s) not in PUBLIC_STATIC_FILES_MANIFEST.md: {{ files }}",
      readError: "{{ error }}",
    },
    schema: [],
    type: "problem",
  },
};

export const plugin: ESLint.Plugin = {
  rules: {
    "public-files-in-manifest": rule,
  },
};
