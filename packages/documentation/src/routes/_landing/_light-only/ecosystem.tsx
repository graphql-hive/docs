import { createFileRoute } from "@tanstack/react-router";

import { components } from "../../../components/ecosystem/components";
import EcosystemPageContent from "../../../components/ecosystem/content.mdx";
import { GotAnIdeaSection } from "../../../components/got-an-idea-section";
import { LandingPageContainer } from "../../../components/landing-page-container";
import { seo } from "../../../lib/seo";

export const Route = createFileRoute("/_landing/_light-only/ecosystem")({
  component: EcosystemPage,
  head: () =>
    seo({
      breadcrumbs: [{ name: "The Ecosystem", pathname: "/ecosystem" }],
      description: "Everything you need to scale your API infrastructure",
      pathname: "/ecosystem",
      title: "The Ecosystem",
    }),
});

function EcosystemPage() {
  return (
    <LandingPageContainer className="text-green-1000 light mx-auto max-w-360 overflow-hidden px-4 [&>:not(header)]:px-4 lg:[&>:not(header)]:px-8 xl:[&>:not(header)]:px-[120px]">
      <EcosystemPageContent components={components} />
      <GotAnIdeaSection className="md:mx-2" />
    </LandingPageContainer>
  );
}
