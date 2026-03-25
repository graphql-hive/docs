import { describe, expect, test } from "bun:test";

import {
  getAliasedAssetRedirectTarget,
  shouldTryAssetRequest,
} from "./cloudflare-routing";

const baseURL = "/graphql/hive";

describe("shouldTryAssetRequest", () => {
  test("tries extensionless doc routes as exact asset requests", () => {
    expect(
      shouldTryAssetRequest({
        baseURL,
        method: "GET",
        pathname: "/graphql/hive/docs/gateway",
      }),
    ).toBe(true);
  });

  test("tries trailing slash requests too", () => {
    expect(
      shouldTryAssetRequest({
        baseURL,
        method: "GET",
        pathname: "/graphql/hive/docs/gateway/",
      }),
    ).toBe(true);
  });

  test("tries generated files with extensions directly", () => {
    expect(
      shouldTryAssetRequest({
        baseURL,
        method: "GET",
        pathname: "/graphql/hive/sitemap.xml",
      }),
    ).toBe(true);
  });

  test("tries known public assets directly", () => {
    expect(
      shouldTryAssetRequest({
        baseURL,
        method: "HEAD",
        pathname: "/graphql/hive/assets/app.js",
      }),
    ).toBe(true);
  });

  test("skips api and server function routes", () => {
    expect(
      shouldTryAssetRequest({
        baseURL,
        method: "GET",
        pathname: "/graphql/hive/api/search",
      }),
    ).toBe(false);

    expect(
      shouldTryAssetRequest({
        baseURL,
        method: "GET",
        pathname: "/graphql/hive/_serverFn/test",
      }),
    ).toBe(false);
  });

  test("skips unsafe methods", () => {
    expect(
      shouldTryAssetRequest({
        baseURL,
        method: "POST",
        pathname: "/graphql/hive/docs/gateway",
      }),
    ).toBe(false);
  });
});

describe("getAliasedAssetRedirectTarget", () => {
  test("follows same-path trailing slash redirects", () => {
    expect(
      getAliasedAssetRedirectTarget({
        location: "/graphql/hive/docs/gateway/",
        requestURL: new URL("https://the-guild.dev/graphql/hive/docs/gateway"),
      })?.pathname,
    ).toBe("/graphql/hive/docs/gateway/");
  });

  test("rejects redirects that change path semantics", () => {
    expect(
      getAliasedAssetRedirectTarget({
        location: "/graphql/hive/docs",
        requestURL: new URL("https://the-guild.dev/graphql/hive/docs/gateway"),
      }),
    ).toBeUndefined();

    expect(
      getAliasedAssetRedirectTarget({
        location: "/graphql/hive/docs/gateway/?x=1",
        requestURL: new URL("https://the-guild.dev/graphql/hive/docs/gateway"),
      }),
    ).toBeUndefined();
  });

  test("rejects redirects for paths that already end with slash", () => {
    expect(
      getAliasedAssetRedirectTarget({
        location: "/graphql/hive/docs/gateway/",
        requestURL: new URL("https://the-guild.dev/graphql/hive/docs/gateway/"),
      }),
    ).toBeUndefined();
  });
});
