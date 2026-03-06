/** Defined via `define` in vite.config.ts */
declare const BASE_PATH: string;

declare global {
  var $crisp:
    | {
        push: (args: unknown[]) => void;
      }
    | undefined;
}
