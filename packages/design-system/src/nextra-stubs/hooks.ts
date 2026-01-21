// Stub for nextra/hooks
import { useEffect, useState } from 'react';

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function useFSRoute(): string {
  if (globalThis.window !== undefined) {
    return globalThis.location.pathname;
  }
  return '/';
}
