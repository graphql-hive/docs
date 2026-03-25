import { describe, expect, test } from "bun:test";

import { decodeCssLiteral } from "./tanstack-dev-styles-base-path";

describe("decodeCssLiteral", () => {
  test("keeps double-escaped newline and tab sequences literal", () => {
    expect(decodeCssLiteral(String.raw`hello\\nworld\\tstill-literal`)).toBe(
      String.raw`hello\nworld\tstill-literal`,
    );
  });

  test("decodes single-escaped control characters", () => {
    expect(decodeCssLiteral(String.raw`line-1\nline-2\tindent\rreturn`)).toBe(
      "line-1\nline-2\tindent\rreturn",
    );
  });

  test("decodes escaped quotes and backslashes in one pass", () => {
    expect(
      decodeCssLiteral(String.raw`url(\"/graphql\/hive\")\\\"quoted\\\"`),
    ).toBe(String.raw`url("/graphql\/hive")\"quoted\"`);
  });
});
