import { Heading } from "@hive/design-system/heading";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { getChangelogs } from "../../components/get-changelogs";
import { LandingPageContainer } from "../../components/landing-page-container";
import { ProductUpdatesPage } from "../../components/product-updates";

const serverGetChangelogs = createServerFn({ method: "GET" }).handler(
  async () => getChangelogs(),
);

export const Route = createFileRoute("/_landing/product-updates")({
  component: ProductUpdatesRoute,
  loader: () => serverGetChangelogs(),
});

function ProductUpdatesRoute() {
  const changelogs = Route.useLoaderData();

  return (
    <LandingPageContainer className="text-green-1000 light mx-auto max-w-360 overflow-hidden">
      <div className="mx-4 max-sm:mt-2 md:mx-6">
        <Heading
          as="h1"
          className="text-green-1000 mx-auto max-w-3xl text-center"
          size="xl"
        >
          Product Updates
        </Heading>
        <p className="mx-auto mt-4 max-w-[80%] text-center leading-6 text-green-800">
          Stay up to date with the latest features and improvements.
        </p>
      </div>
      <div className="mx-4 md:mx-6">
        <ProductUpdatesPage changelogs={changelogs} />
      </div>
    </LandingPageContainer>
  );
}
