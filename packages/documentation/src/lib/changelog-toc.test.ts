import { describe, expect, test } from "bun:test";

import { extractFilteredChangelogToc } from "./changelog-toc";

const changelog = `# hive

## 9.6.1

### Patch Changes

- fix something

## 9.6.0

### Minor Changes

- add feature

## 9.5.2

### Patch Changes

- fix

## 9.5.1

### Patch Changes

- fix

## 9.5.0

### Minor Changes

- feature

## 9.4.0

### Minor Changes

- feature

## 8.3.1

### Patch Changes

- fix

## 8.3.0

### Minor Changes

- feature

## 8.2.0

### Minor Changes

- feature

## 7.0.0

### Major Changes

- breaking
`;

describe("extractFilteredChangelogToc", () => {
  test("returns empty for empty markdown", () => {
    expect(extractFilteredChangelogToc("")).toEqual([]);
  });

  test("returns empty for markdown without version headings", () => {
    expect(extractFilteredChangelogToc("# Just a title\n\nSome text")).toEqual(
      [],
    );
  });

  test("includes all patches of the latest minor", () => {
    const toc = extractFilteredChangelogToc(changelog);
    const titles = toc.map((e) => e.title);
    expect(titles).toContain("9.6.1");
    expect(titles).toContain("9.6.0");
  });

  test("includes only last patch of other minors in current major", () => {
    const toc = extractFilteredChangelogToc(changelog);
    const titles = toc.map((e) => e.title);
    // 9.5.2 is the latest patch of 9.5.x
    expect(titles).toContain("9.5.2");
    expect(titles).not.toContain("9.5.1");
    expect(titles).not.toContain("9.5.0");
    // 9.4.0 is the only (and thus latest) patch of 9.4.x
    expect(titles).toContain("9.4.0");
  });

  test("includes only last patch of older majors", () => {
    const toc = extractFilteredChangelogToc(changelog);
    const titles = toc.map((e) => e.title);
    // 8.3.1 is the latest in major 8
    expect(titles).toContain("8.3.1");
    expect(titles).not.toContain("8.3.0");
    expect(titles).not.toContain("8.2.0");
    // 7.0.0 is the only version in major 7
    expect(titles).toContain("7.0.0");
  });

  test("URLs use headingSlug from design-system (dots become hyphens)", () => {
    const toc = extractFilteredChangelogToc(changelog);
    const entry = toc.find((e) => e.title === "9.6.1");
    expect(entry?.url).toBe("#9-6-1");
  });

  test("all entries have depth 2", () => {
    const toc = extractFilteredChangelogToc(changelog);
    expect(toc.every((e) => e.depth === 2)).toBe(true);
  });

  test("preserves descending order", () => {
    const toc = extractFilteredChangelogToc(changelog);
    const titles = toc.map((e) => e.title);
    expect(titles).toEqual([
      "9.6.1",
      "9.6.0",
      "9.5.2",
      "9.4.0",
      "8.3.1",
      "7.0.0",
    ]);
  });
});
