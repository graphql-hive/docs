# Documentation in Astro

This package is an attempt in converting the existing documentation located at `../documentation` to an astro static page.

The goal is to keep all the content (assets, markdown files) withion the old documentation for now (so it does not go out of sync).

All the pages implemented should follow the existing components within the `../documentation` and `../design-system` folders.

When tasked to migrate a page follow these steps:
- find the corresponding page within the old docs, trace the components
- create the new components as astro components (keep markdown and classes identical if possible)
- implement the new pages
- leverage playwrigth/chromium for visually diffing the pages
- check if components were already created for other pages before creating them

# Action Items

## Pages needing migration

- [x] `/blog`
- [x] `/product-updates`
- [x] `/ecosystem`
- [x] `/gateway`

## Adjustments required for docs

- [x] The docs styles for paragraphs, headings, lists etc are off
- [x] the navigation is in the wrong order, we need a way to order the docs based on the existing `meta.json` files in the old docs
- [x] The stylings of many components is off; create a list of components to review
  - [x] `Callout.astro` only had dark-mode colors ported (dark navy/olive/brown boxes), but the site only renders in light mode — fixed to use the actual light-mode design tokens (`--color-*-100/500/800`) and the real per-type icons instead of a placeholder glyph.
  - [x] Product updates timeline and detail page should use the same styles as the old one — rewrote both to match the old site's exact Tailwind classes (`ProductUpdatesPage`/`ProductUpdateTeaser` timeline, `Heading size="md"` for titles) instead of a from-scratch custom-CSS design; the detail page's byline now reuses `BlogAuthors.astro` instead of duplicating markup.
  - [x] fix the step component to look like the original one (used in GraphQL Federation) — `Step`/`Steps` now match fumadocs' real `.fd-step`/`.fd-steps` classes (muted secondary-token badge instead of a loud brand-accent circle).
  - [x] fix the file component tree component (used in GraphQL Federation) — `File`/`Files`/`Folder` now match fumadocs' real component (bordered card, lucide file/folder icons, open/closed folder state) instead of plain "▾"/"└" text glyphs.
  - [x] fix the tab component — `Tabs`/`Tab` now match the real `@hive/design-system/tabs` component (flat underline-style tab list) instead of a boxed pill-button tab bar.
  - [x] fix the mermaid diagrams — added `mermaid` as a dependency and a small client-side renderer (`MermaidRenderer.astro`, wired into every content layout: docs, blog, product-updates, case studies) that replaces ` ```mermaid ` code blocks with the rendered diagram. Note: the old site rendered these at build time via `rehype-mermaid` + a headless browser; this port renders client-side instead (simpler, no Playwright dependency in this package) — diagrams need JS enabled and briefly show raw code before hydrating.
