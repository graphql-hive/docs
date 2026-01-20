// Stub for nextra/hooks
import { useState, useEffect } from 'react';

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function useFSRoute(): string {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '/';
}
