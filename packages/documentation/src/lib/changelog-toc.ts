import { headingSlug } from "@hive/design-system/heading-slug";

type Version = { major: number; minor: number; patch: number; raw: string };

type TocEntry = { depth: number; title: string; url: string };

function parseVersion(heading: string): Version | null {
  const match = heading.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    raw: heading,
  };
}

/**
 * Extracts version headings from changelog markdown and filters them for the ToC.
 *
 * Filtering rules:
 * - All patches of the current (latest) minor version
 * - Last patch of each other minor within the current major
 * - Last patch of each other major version
 */
export function extractFilteredChangelogToc(markdown: string): TocEntry[] {
  const headingRegex = /^## (.+)$/gm;
  const versions: Version[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const version = parseVersion(match[1]!.trim());
    if (version) {
      versions.push(version);
    }
  }

  if (versions.length === 0) return [];

  // Versions are in descending order (newest first)
  const latest = versions[0]!;
  const latestMajor = latest.major;
  const latestMinor = latest.minor;

  const selectedVersions = new Set<string>();
  const seenMinors = new Set<number>();
  const seenMajors = new Set<number>();

  for (const v of versions) {
    if (v.major === latestMajor && v.minor === latestMinor) {
      selectedVersions.add(v.raw);
    } else if (v.major === latestMajor) {
      // First occurrence is the latest patch (descending order)
      if (!seenMinors.has(v.minor)) {
        seenMinors.add(v.minor);
        selectedVersions.add(v.raw);
      }
    } else {
      if (!seenMajors.has(v.major)) {
        seenMajors.add(v.major);
        selectedVersions.add(v.raw);
      }
    }
  }

  return versions
    .filter((v) => selectedVersions.has(v.raw))
    .map((v) => ({
      depth: 2,
      title: v.raw,
      url: `#${headingSlug(v.raw)}`,
    }));
}
