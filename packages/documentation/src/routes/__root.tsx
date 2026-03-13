import { FumadocsLink } from "@/components/fumadocs-link";
import { seo } from "@/lib/seo";
import { withBasePath } from "@/lib/with-base-path";
import appCss from "@/styles/app.css?url";
import {
  createRootRoute,
  type ErrorComponentProps,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: RootErrorComponent,
  head: () => {
    const tags = seo();
    return {
      links: [{ href: appCss, rel: "stylesheet" }, ...tags.links],
      meta: [
        {
          // eslint-disable-next-line unicorn/text-encoding-identifier-case
          charSet: "utf-8",
        },
        {
          content: "width=device-width, initial-scale=1",
          name: "viewport",
        },
        ...tags.meta,
      ],
      scripts: tags.scripts,
    };
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <RootDocument>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="max-w-md text-gray-600">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          className="rounded-lg bg-green-800 px-4 py-2 text-sm text-white hover:bg-green-900"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </div>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const isLightOnlyPage = useRouterState({
    select: (s) => s.matches.some((m) => m.routeId.includes("/_light-only")),
  });
  const themeConfig = {
    attribute: "class",
    defaultTheme: "system",
    enableSystem: true,
  } as const;

  return (
    <html
      className={isLightOnlyPage ? "light" : undefined}
      lang="en"
      // todo: investigate if this can be removed
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body
        className="flex flex-col min-h-screen antialiased"
        style={{ fontFamily: "'PP Neue Montreal', system-ui, sans-serif" }}
      >
        <RootProvider
          components={{ Link: FumadocsLink }}
          search={{
            options: {
              api: withBasePath("/api/search"),
              type: "static",
            },
          }}
          theme={
            isLightOnlyPage
              ? { ...themeConfig, forcedTheme: "light" }
              : themeConfig
          }
        >
          {children}
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
