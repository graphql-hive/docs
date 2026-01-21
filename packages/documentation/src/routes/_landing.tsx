'use client';

import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Navigation, Footer } from '../components/navigation';

export const Route = createFileRoute('/_landing')({
  component: LandingLayout,
});

/**
 * Pathless layout for landing pages (/, /pricing, /federation, etc.)
 * Includes HiveNavigation and HiveFooter with white background
 */
function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white light">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
