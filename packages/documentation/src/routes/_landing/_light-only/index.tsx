import { createFileRoute } from "@tanstack/react-router";

import IndexPage from "../../../components/landing-page";
import { seo } from "../../../lib/seo";

export const Route = createFileRoute("/_landing/_light-only/")({
  component: IndexPage,
  head: () =>
    seo({
      breadcrumbs: [{ name: "Hive", pathname: "/" }],
      pathname: "/",
    }),
});
