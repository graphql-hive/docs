// Re-exports from the flattened structure
export { cn } from "../cn";
export * from "../index";
export * from "../logos";
export * from "../next-types";
export { PRODUCTS } from "../products";
export * from "../types/components";

declare module "react" {
  interface CSSProperties extends Record<
    `--${string}`,
    number | string | undefined
  > {}
}
