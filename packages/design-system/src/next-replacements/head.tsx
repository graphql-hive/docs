import { useEffect, type ReactNode } from 'react';

interface HeadProps {
  children?: ReactNode;
}

/**
 * Replacement for next/head
 * In TanStack Start, use route meta/head options instead
 * This is a no-op placeholder for compatibility
 */
function Head({ children: _children }: HeadProps) {
  useEffect(() => {
    // Log warning in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Head] next/head replacement is a no-op. Use TanStack Start route meta options instead.'
      );
    }
  }, []);

  // Render nothing - head management should be done at route level
  return null;
}

export default Head;
export { Head };
