import { describe, expect, test } from "bun:test";

import { getAssetPathname } from "./cloudflare-routing";

const baseURL = "/graphql/hive";

describe("getAssetPathname", () => {
  test("maps no-slash doc routes to index.html", () => {
    expect(
      getAssetPathname({
        baseURL,
        isKnownAsset: false,
        method: "GET",
        pathname: "/graphql/hive/docs/gateway",
      }),
    ).toBe("/graphql/hive/docs/gateway/index.html");
  });

  test("preserves trailing slash requests for platform canonicalization", () => {
    expect(
      getAssetPathname({
        baseURL,
        isKnownAsset: false,
        method: "GET",
        pathname: "/graphql/hive/docs/gateway/",
      }),
    ).toBe("/graphql/hive/docs/gateway/");
  });

  test("serves generated files with extensions directly", () => {
    expect(
      getAssetPathname({
        baseURL,
        isKnownAsset: false,
        method: "GET",
        pathname: "/graphql/hive/sitemap.xml",
      }),
    ).toBe("/graphql/hive/sitemap.xml");
  });

  test("serves known public assets directly", () => {
    expect(
      getAssetPathname({
        baseURL,
        isKnownAsset: true,
        method: "GET",
        pathname: "/graphql/hive/assets/app",
      }),
    ).toBe("/graphql/hive/assets/app");
  });

  test("skips api and server function routes", () => {
    expect(
      getAssetPathname({
        baseURL,
        isKnownAsset: false,
        method: "GET",
        pathname: "/graphql/hive/api/search",
      }),
    ).toBeUndefined();

    expect(
      getAssetPathname({
        baseURL,
        isKnownAsset: false,
        method: "GET",
        pathname: "/graphql/hive/_serverFn/test",
      }),
    ).toBeUndefined();
  });
});
