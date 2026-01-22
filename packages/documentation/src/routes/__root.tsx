import appCss from "@/styles/app.css?url";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    links: [{ href: appCss, rel: "stylesheet" }],
    meta: [
      {
        // eslint-disable-next-line unicorn/text-encoding-identifier-case
        charSet: "utf-8",
      },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      {
        title: "Hive - Open-Source GraphQL Federation Platform",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      // todo: investigate if this can be removed
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen antialiased" style={{ fontFamily: "'PP Neue Montreal', system-ui, sans-serif" }}>
        <RootProvider>{children}</RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
