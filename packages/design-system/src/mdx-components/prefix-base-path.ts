declare const BASE_PATH: string;

/**
 * Prefix absolute paths with BASE_PATH (defined via Vite `define`).
 * Falls back to no-op when BASE_PATH is not defined (e.g. outside Vite).
 */
export function prefixBasePath(src: string | undefined): string | undefined {
  if (!src || !src.startsWith("/")) return src;
  const base = typeof BASE_PATH === "string" ? BASE_PATH : "";
  if (base && !src.startsWith(base)) {
    return `${base}${src}`;
  }
  return src;
}
