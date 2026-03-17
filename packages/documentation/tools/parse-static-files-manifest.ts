import { readFileSync } from "node:fs";

/**
 * Parses PUBLIC_STATIC_FILES_MANIFEST.md and returns all file paths listed in tables.
 * Matches rows like: | `some/file.ext` | Use case |
 */
export function parseStaticFilesManifest(manifestPath: string): string[] {
  const content = readFileSync(manifestPath, "utf8");
  const files: string[] = [];

  for (const line of content.split("\n")) {
    const match = line.match(/^\|\s*`([^`]+)`\s*\|/);
    if (match?.[1]) {
      files.push(match[1]);
    }
  }

  return files;
}
