#!/usr/bin/env node
/**
 * Fix relative links in router docs that break with TanStack Router's splat route.
 * Converts ../X links to absolute /docs/router/X paths.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, resolve, relative } from "node:path";

const docsDir = new URL("../content/docs", import.meta.url).pathname;

// Get all MDX files in the docs directory
const files = execSync(`find ${docsDir} -name '*.mdx'`, {
  encoding: "utf8",
})
  .trim()
  .split("\n");

let filesChanged = 0;

for (const file of files) {
  const original = readFileSync(file, "utf8");
  let content = original;

  // Replace relative links (](../ and ](../../) with absolute /docs/ paths
  content = content.replace(
    /\]\((\.\.\/.+?)([\)#])/g,
    (match, relPath, suffix) => {
      const fileDir = dirname(file);
      // Resolve the relative path from the file's directory
      const resolvedPath = resolve(fileDir, relPath);
      // Get path relative to docs root
      const docsRelative = relative(docsDir, resolvedPath);
      const absPath = "/docs/" + docsRelative.replace(/\.mdx$/, "");
      return `](${absPath}${suffix}`;
    },
  );

  if (content !== original) {
    writeFileSync(file, content);
    filesChanged++;
    console.log(`  Fixed: ${file.replace(docsDir, "")}`);
  }
}

console.log(`\nDone: ${filesChanged} files changed.`);
