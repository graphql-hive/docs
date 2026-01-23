export * from "./body.client.js";
export { HiveLayout } from "./hive-layout.js";

// Must be in `server` folder because can contain server-only components or imports Node.js builtin
export * from "./mdx-components/index.js";
export { fetchPackageInfo } from "./npm.js";
export { remarkLinkRewrite } from "./remark-link-rewrite.js";
export { sharedMetaItems } from "./shared-meta-items.js";
/**
 * Contain `getPageMap` import which imports `metadata` from pages, in case importing from
 * `@theguild/components` will throw:
 *
 * × Error: You are attempting to export "metadata" from a component marked with "use client",
 * which is disallowed. Either remove the export, or the "use client" directive. Read more: https://nextjs.org
 */
export { getDefaultMetadata, GuildLayout } from "./theme-layout.js";
export { compileMdx } from "nextra/compile";
export { evaluate } from "nextra/evaluate";
export { fetchFilePathsFromGitHub } from "nextra/fetch-filepaths-from-github";

// Must be in `server` folder because contains import of `useMDXComponents`
export { MDXRemote } from "nextra/mdx-remote";
export {
  convertToPageMap,
  createIndexPage,
  getPageMap,
  mergeMetaWithPageMap,
  normalizePageMap,
} from "nextra/page-map";
