import { CallToAction } from "@hive/design-system/call-to-action";
import { DecorationIsolation } from "@hive/design-system/decorations";
import { ExploreMainProductCards } from "@hive/design-system/explore-main-product-cards";
import { FrequentlyAskedQuestions } from "@hive/design-system/faq";
import { Hero, HeroLogo } from "@hive/design-system/hero";
import { HiveGatewayIcon } from "@hive/design-system/icons";
import { createFileRoute } from "@tanstack/react-router";

import { ErrorBoundary } from "../../../components/error-boundary";
import { CloudNativeSection } from "../../../components/gateway/cloud-native-section";
import { FederationCompatibleBenchmarksSection } from "../../../components/gateway/federation-compatible-benchmarks";
import { GatewayFeatureTabs } from "../../../components/gateway/gateway-feature-tabs";
import GatewayLandingFAQ from "../../../components/gateway/gateway-landing-faq.mdx";
import { LetsGetAdvancedSection } from "../../../components/gateway/lets-get-advanced-section";
import { OrchestrateYourWay } from "../../../components/gateway/orchestrate-your-way";
import { GetYourAPIGameRightList } from "../../../components/get-your-api-game-right-list";
import { LandingPageContainer } from "../../../components/landing-page-container";
import { seo } from "../../../lib/seo";

export const Route = createFileRoute("/_landing/_light-only/gateway")({
  component: HiveGatewayPage,
  head: seo({
    description:
      "Unify and accelerate your data graph with Hive Gateway, which seamlessly integrates with Apollo Federation.",
    title: "Hive Gateway",
  }),
});

function HiveGatewayPage() {
  return (
    <LandingPageContainer className="text-green-1000 light mx-auto max-w-360 overflow-hidden">
      <Hero
        checkmarks={[
          "Fully open source",
          "No vendor lock-in",
          "Can be self-hosted!",
        ]}
        className="mx-4 sm:pb-28! md:mx-6 lg:pb-[168px]!"
        heading="Hive Gateway"
        text="Unify and accelerate your data graph across diverse services with Hive Gateway, which seamlessly integrates with Apollo Federation."
        top={
          <HeroLogo>
            <HiveGatewayIcon />
          </HeroLogo>
        }
      >
        <CallToAction href="/docs/gateway" variant="primary-inverted">
          Get Started
        </CallToAction>
        <CallToAction
          href="https://github.com/graphql-hive/gateway"
          variant="secondary-inverted"
        >
          GitHub
        </CallToAction>
        <GatewayHeroDecoration />
      </Hero>
      <GatewayFeatureTabs className="relative mt-6 sm:mt-[-72px] sm:bg-blue-100" />
      <OrchestrateYourWay className="mx-4 mt-6 sm:mx-8" />
      <ErrorBoundary fallback={null}>
        <FederationCompatibleBenchmarksSection />
      </ErrorBoundary>
      <LetsGetAdvancedSection />
      <CloudNativeSection className="mx-4 mt-6 md:mx-6" />
      <ExploreMainProductCards className="max-lg:mx-4 max-lg:my-8" />
      <FrequentlyAskedQuestions faqPages={["/gateway"]}>
        <GatewayLandingFAQ />
      </FrequentlyAskedQuestions>
      <GetYourAPIGameRightList className="mx-4 sm:mb-6 md:mx-6" />
    </LandingPageContainer>
  );
}

function GatewayHeroDecoration() {
  return (
    <DecorationIsolation className="-z-10">
      <HiveGatewayIcon className="absolute left-[-268px] top-[-8px] size-[520px] fill-[url(#gateway-hero-gradient)] max-lg:hidden" />
      <HiveGatewayIcon className="absolute right-[-144px] top-[-64px] size-[320px] fill-[url(#gateway-hero-gradient-mobile)] md:bottom-[-64px] md:right-[-268px] md:top-auto md:size-[520px] md:fill-[url(#gateway-hero-gradient)] lg:bottom-[-8px]" />
      <svg
        className="pointer-events-none -z-50 size-0"
        height="296"
        viewBox="0 0 192 296"
        width="192"
      >
        <defs>
          <linearGradient
            gradientTransform="rotate(139)"
            id="gateway-hero-gradient"
          >
            <stop offset="11.66%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="74.87%" stopColor="rgba(255, 255, 255, 0.3)" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="gateway-hero-gradient-mobile"
            x1="35.3488"
            x2="224.372"
            y1="15.0697"
            y2="229.023"
          >
            <stop stopColor="white" stopOpacity="0.2" />
            <stop offset="80%" stopColor="white" />
          </linearGradient>
        </defs>
      </svg>
    </DecorationIsolation>
  );
}
