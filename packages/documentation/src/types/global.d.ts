

declare global {
  var $crisp:
    | {
        push: (args: unknown[]) => void;
      }
    | undefined;
}
