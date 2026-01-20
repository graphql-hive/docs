// Runtime shim for next/head
// In TanStack Start, use route head() function instead
import type { ReactNode } from 'react';

interface HeadProps {
  children?: ReactNode;
}

/**
 * No-op replacement for next/head
 * Use TanStack Start route head() option instead:
 *
 * export const Route = createFileRoute('/')({
 *   head: () => ({
 *     meta: [{ title: 'Page Title' }],
 *   }),
 * })
 */
export default function Head(_props: HeadProps) {
  return null;
}

export { Head };
