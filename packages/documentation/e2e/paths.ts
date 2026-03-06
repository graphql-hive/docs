const BASE_PATH = "/graphql/hive-testing";

export function appPath(path: string) {
  return `${BASE_PATH}${path}`;
}

export function appPathPattern(path: string) {
  const escaped = appPath(path).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`${escaped}/?$`);
}

export function appPathPrefixPattern(path: string) {
  const escaped = appPath(path).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`${escaped}(?:/|$)`);
}
