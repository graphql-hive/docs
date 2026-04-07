/** @source https://github.com/mantinedev/mantine/blob/master/packages/@mantine/hooks/src/use-debounced-state/use-debounced-state.ts#L1 */
import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export interface UseDebouncedStateOptions {
  leading?: boolean;
}

export type UseDebouncedStateReturnValue<T> = [
  T,
  (newValue: SetStateAction<T>) => void,
];

export function useDebouncedState<T>(
  defaultValue: T,
  wait: number,
  options?: UseDebouncedStateOptions
): UseDebouncedStateReturnValue<T> {
  const leading = options?.leading ?? false;
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<ReturnType<typeof globalThis.setTimeout>>(null);
  const leadingRef = useRef(true);

  const clearTimeout = useCallback(() => timeoutRef.current && globalThis.clearTimeout(timeoutRef.current), []);
  useEffect(() => clearTimeout, [clearTimeout]);

  const debouncedSetValue = useCallback(
    (newValue: SetStateAction<T>) => {
      clearTimeout();
      if (leadingRef.current && leading) {
        setValue(newValue);
      } else {
        timeoutRef.current = globalThis.setTimeout(() => {
          leadingRef.current = true;
          setValue(newValue);
        }, wait);
      }
      leadingRef.current = false;
    },
    [leading, clearTimeout, wait],
  );

  return [value, debouncedSetValue] as const;
}

export type Options = UseDebouncedStateOptions;
export type ReturnValue<T> = UseDebouncedStateReturnValue<T>;
