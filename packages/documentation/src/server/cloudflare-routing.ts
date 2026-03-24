function isSafeAssetMethod(method: string) {
  return method === "GET" || method === "HEAD";
}

function hasPathExtension(pathname: string) {
  const lastSlash = pathname.lastIndexOf("/");
  const lastSegment =
    lastSlash === -1 ? pathname : pathname.slice(lastSlash + 1);
  return lastSegment.includes(".");
}

function isServerFnPath(pathname: string, baseURL: string) {
  return (
    pathname === "/_serverFn" ||
    pathname.startsWith("/_serverFn/") ||
    (baseURL !== "" &&
      (pathname === `${baseURL}/_serverFn` ||
        pathname.startsWith(`${baseURL}/_serverFn/`)))
  );
}

function isApiPath(pathname: string, baseURL: string) {
  return (
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    (baseURL !== "" &&
      (pathname === `${baseURL}/api` || pathname.startsWith(`${baseURL}/api/`)))
  );
}

export function getAssetPathname({
  baseURL,
  isKnownAsset,
  method,
  pathname,
}: {
  baseURL: string;
  isKnownAsset: boolean;
  method: string;
  pathname: string;
}) {
  if (
    !isSafeAssetMethod(method) ||
    isApiPath(pathname, baseURL) ||
    isServerFnPath(pathname, baseURL)
  ) {
    return;
  }

  if (pathname.endsWith("/")) {
    return pathname;
  }

  if (isKnownAsset || hasPathExtension(pathname)) {
    return pathname;
  }

  return `${pathname}/index.html`;
}
