"use client";

import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Footer, Navigation } from "../components/navigation";

export const Route = createFileRoute("/_landing")({
  component: LandingLayout,
});

/**
 * Pathless layout for landing pages and product updates.
 * Includes HiveNavigation and HiveFooter.
 */
function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-visible">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
