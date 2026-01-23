import { ComponentType } from "react";

/**
 * MDX component overrides.
 * Maps element names to React components that render them.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- MDX components have arbitrary props
export type MDXComponents = Record<string, ComponentType<any>>;
