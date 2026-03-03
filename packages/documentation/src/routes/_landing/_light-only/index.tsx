import { createFileRoute } from "@tanstack/react-router";

import IndexPage from "../../../components/landing-page";

export const Route = createFileRoute("/_landing/_light-only/")({
  component: IndexPage,
});
