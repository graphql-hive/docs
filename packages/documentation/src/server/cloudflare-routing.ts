function isSafeAssetMethod(method: string) {
  return method === "GET" || method === "HEAD";
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

export function getAliasedAssetRedirectTarget({
  location,
  requestURL,
}: {
  location: string | null;
  requestURL: URL;
}) {
  if (!location || requestURL.pathname.endsWith("/")) {
    return;
  }

  const targetURL = new URL(location, requestURL);
  if (
    targetURL.origin !== requestURL.origin ||
    targetURL.pathname !== `${requestURL.pathname}/` ||
    targetURL.search !== requestURL.search ||
    targetURL.hash !== requestURL.hash
  ) {
    return;
  }

  return targetURL;
}

export function shouldTryAssetRequest({
  baseURL,
  method,
  pathname,
}: {
  baseURL: string;
  method: string;
  pathname: string;
}) {
  if (
    !isSafeAssetMethod(method) ||
    isApiPath(pathname, baseURL) ||
    isServerFnPath(pathname, baseURL)
  ) {
    return false;
  }
  return true;
}
