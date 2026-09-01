/**
 * Prefixes a site-internal root-absolute path with the configured Astro base
 * (see `base` in astro.config.mjs). No-op for external URLs, anchors, and
 * already-prefixed paths, so it is safe to apply to any href/src value.
 */
const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

export function withBase(path: string): string;
export function withBase(path: string | undefined): string | undefined;
export function withBase(path: string | undefined): string | undefined {
  if (!path || !base || !path.startsWith("/") || path.startsWith("//")) {
    return path;
  }
  if (path === base || path.startsWith(`${base}/`)) return path;
  return `${base}${path}`;
}
