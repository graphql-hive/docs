// Stub for nextra/hooks
import { useEffect, useState } from "react";

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard useMounted pattern
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function useFSRoute(): string {
  if (globalThis.window !== undefined) {
    return globalThis.location.pathname;
  }
  return "/";
}
