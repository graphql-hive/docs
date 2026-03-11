import { afterEach, describe, expect, test } from "bun:test";

import {
  getClientRenderState,
  resetClientChangelogCache,
  resolveStateAfterRefresh,
  seedClientChangelogCache,
} from "../lib/deployment-changelog-client-cache";

afterEach(() => {
  resetClientChangelogCache();
});

describe("deployment changelog client cache", () => {
  test("preserves stale live markdown when refresh fails", () => {
    seedClientChangelogCache("live markdown", 1000);

    const initial = getClientRenderState("bundled snapshot", 1000 + 3_600_001);
    const next = resolveStateAfterRefresh(initial, "bundled snapshot", "");

    expect(initial).toEqual({
      markdown: "live markdown",
      shouldRefresh: true,
      showGitHubCta: false,
    });
    expect(next).toEqual({
      markdown: "live markdown",
      showGitHubCta: true,
    });
  });

  test("falls back to bundled snapshot when refresh fails without cached live markdown", () => {
    const initial = getClientRenderState("bundled snapshot");
    const next = resolveStateAfterRefresh(initial, "bundled snapshot", "");

    expect(initial).toEqual({
      markdown: "bundled snapshot",
      shouldRefresh: true,
      showGitHubCta: false,
    });
    expect(next).toEqual({
      markdown: "bundled snapshot",
      showGitHubCta: true,
    });
  });

  test("replaces stale live markdown when refresh succeeds", () => {
    seedClientChangelogCache("old live markdown", 1000);

    const initial = getClientRenderState("bundled snapshot", 1000 + 3_600_001);
    const next = resolveStateAfterRefresh(
      initial,
      "bundled snapshot",
      "fresh live markdown",
    );

    expect(next).toEqual({
      markdown: "fresh live markdown",
      showGitHubCta: false,
    });
  });
});
