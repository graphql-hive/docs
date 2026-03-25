import { describe, expect, test } from "bun:test";

import { shouldTryAssetRequest } from "./cloudflare-routing";

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
