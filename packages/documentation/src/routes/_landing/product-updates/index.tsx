import { Heading } from "@hive/design-system/heading";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { getChangelogs } from "../../../components/get-changelogs";
import { LandingPageContainer } from "../../../components/landing-page-container";
import { ProductUpdatesPage } from "../../../components/product-updates";

const serverGetChangelogs = createServerFn({ method: "GET" }).handler(
  async () => getChangelogs(),
);

export const Route = createFileRoute("/_landing/product-updates/")({
  component: ProductUpdatesRoute,
  loader: () => serverGetChangelogs(),
});

function ProductUpdatesRoute() {
  const changelogs = Route.useLoaderData();

  return (
    <LandingPageContainer className="text-green-1000 mx-auto max-w-360 overflow-hidden dark:text-neutral-200">
      <div className="mx-auto w-[872px] max-w-full pt-16 max-sm:mt-2">
        <Heading as="h1" className="text-green-1000 dark:text-white" size="md">
          Product Updates
        </Heading>
        <p className="leading-6 text-green-800 dark:text-neutral-400 mt-2">
          The most recent developments from GraphQL Hive.
        </p>
        <ProductUpdatesPage changelogs={changelogs} />
      </div>
    </LandingPageContainer>
  );
}
