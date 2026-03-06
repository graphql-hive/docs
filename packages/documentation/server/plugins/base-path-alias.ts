import { definePlugin } from "nitro";

const BASE_PATH = "/graphql/hive-testing";
const LOCATION_HEADER = "location";

function hasBasePath(pathname: string) {
  return pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/`);
}

function withBasePath(pathname: string) {
  return `${BASE_PATH}${pathname}`;
}

function stripBasePath(pathname: string) {
  const stripped = pathname.slice(BASE_PATH.length);
  return stripped === "" ? "/" : stripped;
}

export default definePlugin((nitroApp) => {
  nitroApp.hooks?.hook("request", (event) => {
    const { pathname } = event.url;

    if (hasBasePath(pathname)) {
      return;
    }

    event.context.docsBasePathAlias = true;
    event.url.pathname = withBasePath(pathname);
  });

  nitroApp.hooks?.hook("response", (response, event) => {
    if (!event.context.docsBasePathAlias) {
      return;
    }

    const location = response.headers.get(LOCATION_HEADER);
    if (!location || location.startsWith("http")) {
      return;
    }

    if (hasBasePath(location)) {
      response.headers.set(LOCATION_HEADER, stripBasePath(location));
    }
  });
});
