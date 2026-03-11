export function withBasePath(path: string) {
  if (!path.startsWith("/")) return path;

  const base = typeof BASE_PATH === "string" ? BASE_PATH : "";
  if (base && !path.startsWith(base)) {
    return `${base}${path}`;
  }

  return path;
}
