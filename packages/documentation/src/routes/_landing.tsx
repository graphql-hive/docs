"use client";

import { baseOptions } from "@/lib/layout.shared";
import { getSerializedPageTree } from "@/lib/source";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { deserializePageTree } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { Footer } from "../components/navigation";

const serverGetPageTree = createServerFn({ method: "GET" }).handler(() =>
  getSerializedPageTree(),
);

export const Route = createFileRoute("/_landing")({
  component: LandingLayout,
  loader: () => serverGetPageTree(),
});

/**
 * Pathless layout for landing pages and product updates.
 * Includes HiveNavigation and HiveFooter.
 */
function LandingLayout() {
  const pageTree = deserializePageTree(Route.useLoaderData());

  return (
    <div className="min-h-screen overflow-visible">
      <DocsLayout {...baseOptions(pageTree)}>
        <Outlet />
      </DocsLayout>
      <Footer />
    </div>
  );
}
