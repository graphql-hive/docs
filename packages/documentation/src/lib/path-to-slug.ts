/**
 * Convert a collection entry's file path to a URL-friendly slug.
 * Strips an optional `/index` suffix and the `.mdx` / `.md` extension.
 */
export function pathToSlug(path: string): string {
  return path.replace(/(?:\/index)?\.mdx?$/, "");
}
