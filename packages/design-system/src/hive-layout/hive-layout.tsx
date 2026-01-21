'use client';

import { ReactElement, ReactNode } from 'react';

import { cn } from '../cn';

export interface HiveLayoutProps {
  children: ReactNode;
  className?: string;
  footer: ReactElement;
  navbar: ReactElement;
}

/**
 * Simplified HiveLayout for TanStack Start/Router based applications.
 *
 * The original HiveLayout in guild-components/server/ is Nextra-specific.
 * This version provides a simpler wrapper that works with any React framework.
 */
export function HiveLayout({
  children,
  className,
  footer,
  navbar,
}: HiveLayoutProps) {
  return (
    <div className={cn('flex min-h-screen flex-col', className)}>
      {navbar}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
}
