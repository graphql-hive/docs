import { createFileRoute } from "@tanstack/react-router";
import IndexPage from "./_landing/page";

export const Route = createFileRoute("/")({
  component: IndexPage,
});
