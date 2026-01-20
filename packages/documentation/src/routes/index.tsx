import { baseOptions } from "@/lib/layout.shared";
import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-col flex-1 justify-center px-4 py-8 text-center">
        <h1 className="font-medium text-xl mb-4">
          Fumadocs on Tanstack Start.
        </h1>
        <Link
          className="px-3 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm mx-auto"
          params={{
            _splat: "",
          }}
          to="/docs/$"
        >
          Open Docs
        </Link>
      </div>
    </HomeLayout>
  );
}
