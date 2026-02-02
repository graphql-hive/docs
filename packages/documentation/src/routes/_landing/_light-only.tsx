"use client";

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/_light-only")({
  component: LightOnlyLayout,
});

/**
 * Pathless layout that forces light mode styling (white background).
 * Light mode is also forced via .light class on <html> in __root.tsx.
 */
function LightOnlyLayout() {
  return (
    <div
      className="flex-1 bg-white"
      style={{ "--nextra-bg": "255 255 255" } as React.CSSProperties}
    >
      <Outlet />
    </div>
  );
}
