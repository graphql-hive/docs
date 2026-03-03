import { serverGetPageTree } from "@/lib/get-page-tree";
import { baseOptions } from "@/lib/layout.shared";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { deserializePageTree } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { Footer } from "../components/navigation";

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
    <>
      <DocsLayout
        {...baseOptions(pageTree, {
          className: "md:[&_[data-sidebar-placeholder]]:hidden",
          style: {
            display: "flex",
            flexDirection: "column",
          } as React.CSSProperties,
        })}
      >
        <Outlet />
      </DocsLayout>
      <Footer />
    </>
  );
}
