import { useMDXComponents } from "./mdx-components";
import { MDXLink } from "./mdx-link";
import { MDXComponents } from "./types";

/**
 * MDX components used in Hive-rebranded websites.
 */
export const useHiveMDXComponents = (
  components?: MDXComponents,
): MDXComponents =>
  useMDXComponents({
    a: MDXLink,
    ...components,
  });
