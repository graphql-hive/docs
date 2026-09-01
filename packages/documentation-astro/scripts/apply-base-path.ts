/* eslint-disable no-console */
/**
 * Prefixes root-absolute URLs in the built site with ASTRO_BASE_PATH.
 *
 * The the-guild.dev router mounts this site under a path prefix (e.g.
 * /graphql/hive) and strips it before proxying, so the worker itself serves
 * un-prefixed paths — but everything the *browser* requests (assets, links,
 * redirect targets) must carry the prefix. PR previews run standalone on
 * workers.dev, so they build without ASTRO_BASE_PATH and stay un-prefixed.
 *
 * Rewrites, only when ASTRO_BASE_PATH is set to something other than "/":
 * - .html: href/src/srcset/poster/action/bundle-path/base-url attributes
 * - .css:  url(/...) references (e.g. font files)
 * - _redirects: destination paths (sources stay un-prefixed — the router
 *   strips the prefix before the worker matches them)
 */
import { fileURLToPath } from "node:url";

const rawBase = process.env["ASTRO_BASE_PATH"]?.trim();
if (!rawBase || rawBase === "/") {
  console.log("ASTRO_BASE_PATH not set — leaving root-absolute URLs as-is");
  process.exit(0);
}

const base = `/${rawBase.replace(/^\/+|\/+$/g, "")}`;
const distDirectory = fileURLToPath(new URL("../dist", import.meta.url));

const URL_ATTRIBUTES = [
  "href",
  "src",
  "poster",
  "action",
  "bundle-path",
  "base-url",
];

function prefixPath(path: string) {
  // Root-absolute only: skip protocol-relative (//) and already-prefixed URLs.
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (path === base || path.startsWith(`${base}/`)) return path;
  return `${base}${path}`;
}

function rewriteHtml(content: string) {
  let count = 0;
  const attrPattern = new RegExp(
    `(\\s(?:${URL_ATTRIBUTES.join("|")})=")(/[^"]*)(")`,
    "g",
  );
  let result = content.replace(attrPattern, (match, before, path, after) => {
    const prefixed = prefixPath(path);
    if (prefixed !== path) count++;
    return `${before}${prefixed}${after}`;
  });
  result = result.replace(
    /(\ssrcset=")([^"]+)(")/g,
    (match, before, value, after) =>
      `${before}${value
        .split(",")
        .map((candidate: string) => {
          const trimmed = candidate.trim();
          const [url, ...descriptor] = trimmed.split(/\s+/);
          if (!url) return trimmed;
          const prefixed = prefixPath(url);
          if (prefixed !== url) count++;
          return [prefixed, ...descriptor].join(" ");
        })
        .join(", ")}${after}`,
  );
  return { count, result };
}

function rewriteCss(content: string) {
  let count = 0;
  const result = content.replace(
    /url\((['"]?)(\/[^)'"]+)\1\)/g,
    (match, quote, path) => {
      const prefixed = prefixPath(path);
      if (prefixed !== path) count++;
      return `url(${quote}${prefixed}${quote})`;
    },
  );
  return { count, result };
}

function rewriteRedirects(content: string) {
  let count = 0;
  const result = content
    .split("\n")
    .map((line) => {
      if (!line || line.startsWith("#")) return line;
      const parts = line.split(/\s+/);
      const destination = parts[1];
      if (destination?.startsWith("/")) {
        const prefixed = prefixPath(destination);
        if (prefixed !== destination) {
          count++;
          parts[1] = prefixed;
        }
      }
      return parts.join(" ");
    })
    .join("\n");
  return { count, result };
}

let files = 0;
let total = 0;

for (const file of new Bun.Glob("**/*.{html,css}").scanSync({
  cwd: distDirectory,
  onlyFiles: true,
})) {
  const path = `${distDirectory}/${file}`;
  const content = await Bun.file(path).text();
  const { count, result } = file.endsWith(".css")
    ? rewriteCss(content)
    : rewriteHtml(content);
  if (count > 0) {
    await Bun.write(path, result);
    files++;
    total += count;
  }
}

const redirectsPath = `${distDirectory}/_redirects`;
if (await Bun.file(redirectsPath).exists()) {
  const { count, result } = rewriteRedirects(
    await Bun.file(redirectsPath).text(),
  );
  if (count > 0) {
    await Bun.write(redirectsPath, result);
    files++;
    total += count;
  }
}

console.log(`Applied base path ${base}: ${total} URLs across ${files} files`);
