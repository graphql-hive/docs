// Guild components (reusable across Hive-branded sites)
import { Anchor } from "@hive/design-system/anchor";
import { CallToAction } from "@hive/design-system/call-to-action";
import { cn } from "@hive/design-system/cn";
import {
  ArchDecoration,
  DecorationIsolation,
  HighlightDecoration,
  LargeHiveIconDecoration,
} from "@hive/design-system/decorations";
import { GetYourAPIGameRightSection } from "@hive/design-system/get-your-api-game-right-section";
import { Heading } from "@hive/design-system/heading";
import { InfoCard } from "@hive/design-system/info-card";
import { ToolsAndLibrariesCards } from "@hive/design-system/tools-and-libraries-cards";
import { ReactElement } from "react";

// Hive landing page specific components
import { CheckIcon } from "./check-icon";
import { CommunitySection } from "./community-section";
import { CompanyTestimonialsSection } from "./company-testimonials";
import { EcosystemManagementSection } from "./ecosystem-management";
import { FrequentlyAskedQuestions } from "./frequently-asked-questions";
import { Hero, HeroFeatures, HeroLinks } from "./hero";
import { LandingPageContainer } from "./landing-page-container";
import { LandingPageFeatureTabs } from "./landing-page-feature-tabs";
import { StatsItem, StatsList } from "./stats";
import { TeamSection } from "./team-section";
import { TrustedBySection } from "./trusted-by-section";

// TODO: Add proper metadata handling for TanStack Start
export const metadata = {
  description:
    "Fully Open-Source schema registry, analytics and gateway for GraphQL federation and other GraphQL APIs",
  title: "Open-Source GraphQL Federation Platform",
};

export default function IndexPage(): ReactElement {
  return (
    <LandingPageContainer className="text-green-1000 light mx-auto max-w-360 overflow-hidden">
      <Hero className="mx-4 max-sm:mt-2 md:mx-6">
        <Heading
          as="h1"
          className="mx-auto max-w-3xl text-balance text-center text-white"
          size="xl"
        >
          Open-Source GraphQL Federation Platform
        </Heading>
        <p className="mx-auto w-[512px] max-w-[80%] text-center leading-6 text-white/80">
          Fully open-source schema registry, analytics, metrics and{" "}
          <Anchor
            className="underline decoration-white/30 underline-offset-2 hover:decoration-white/80"
            href="/gateway"
            title="Learn more about Hive Gateway"
          >
            gateway
          </Anchor>{" "}
          for{" "}
          <Anchor
            className="underline decoration-white/30 underline-offset-2 hover:decoration-white/80"
            href="/federation"
            title="Visit our guide to learn more about GraphQL federation"
          >
            GraphQL federation
          </Anchor>{" "}
          and other GraphQL APIs.
        </p>
        <HeroFeatures>
          <li>
            <CheckIcon className="text-blue-400" />
            MIT licensed
          </li>
          <li>
            <CheckIcon className="text-blue-400" />
            No vendor-lock
          </li>
          <li>
            <CheckIcon className="text-blue-400" />
            Managed and self-hosted
          </li>
        </HeroFeatures>
        <HeroLinks>
          <CallToAction
            href="https://app.graphql-hive.com"
            variant="primary-inverted"
          >
            Get started for free
          </CallToAction>
          <CallToAction href="/docs" variant="secondary">
            Documentation
          </CallToAction>
        </HeroLinks>
      </Hero>
      <LandingPageFeatureTabs className="relative mt-6 sm:mt-[-72px]" />
      <TrustedBySection className="mx-auto my-8 md:my-16 lg:my-24" />
      <EcosystemManagementSection className="max-sm:rounded-none sm:mx-4 md:mx-6" />
      <StatsList className="mt-6 md:mt-0">
        <StatsItem decimal label="GitHub commits" suffix="K" value={7} />
        <StatsItem decimal label="Active developers" suffix="K" value={9.6} />
        <StatsItem label="Registered schemas" suffix="K" value={730} />
        <StatsItem label="Collected operations" suffix="B" value={350} />
      </StatsList>
      <UltimatePerformanceCards />
      <LearnGraphQLFederationSection className="mx-4 md:mx-6" />
      <CompanyTestimonialsSection className="mx-4 mt-6 md:mx-6" />
      <GetStartedTodaySection className="mx-4 mt-6 md:mx-6" />
      <EnterpriseFocusedCards className="mx-4 my-6 md:mx-6" />
      <TeamSection className="mx-4 md:mx-6" />
      <CommunitySection className="mx-4 mt-6 md:mx-6" />
      <ToolsAndLibrariesCards className="mx-4 mt-6 md:mx-6" isHive />
      <FrequentlyAskedQuestions className="mx-4 md:mx-6" />
      <GetYourAPIGameRightSection className="mx-4 sm:mb-6 md:mx-6" />
    </LandingPageContainer>
  );
}

function GetStartedTodaySection({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "bg-blueish-green relative overflow-hidden rounded-3xl p-12 text-center sm:p-24",
        className,
      )}
    >
      <DecorationIsolation>
        <ArchDecoration className="absolute -left-1/2 -top-1/2 rotate-180 sm:-left-1/4 md:left-[-105px] md:top-[-109px] [&>path]:fill-none" />
        <HighlightDecoration className="absolute -left-1 -top-16 size-[600px] -scale-x-100 overflow-visible" />
        <LargeHiveIconDecoration className="absolute bottom-0 right-8 hidden lg:block" />
      </DecorationIsolation>
      <Heading as="h3" className="text-white" size="md">
        Get Started Today!
      </Heading>
      <p className="relative mt-4 text-white/80">
        Start with a free Hobby plan that fits perfectly most side projects or
        try our Pro plan with 30&nbsp;days trial period.
      </p>
      <CallToAction
        className="mx-auto mt-8"
        href="https://app.graphql-hive.com/"
        variant="primary-inverted"
      >
        Enter Hive
      </CallToAction>
    </section>
  );
}

function EnterpriseFocusedCards({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "px-4 py-6 sm:py-12 md:px-6 lg:py-16 xl:px-[120px]",
        className,
      )}
    >
      <Heading
        as="h2"
        className="text-balance sm:px-6 sm:text-center"
        size="md"
      >
        Enterprise-Focused Tools Tailored for You
      </Heading>
      <ul className="mt-6 flex flex-row flex-wrap justify-center gap-2 md:mt-16 md:gap-6">
        <InfoCard
          as="li"
          className="flex-1 rounded-2xl md:rounded-3xl"
          heading="Cloud and Self-Hosted"
          icon={<PerformanceListItemIcon />}
        >
          Hive is completely open source, MIT licensed. You can host it on your
          own infrastructure.
        </InfoCard>
        <InfoCard
          as="li"
          className="flex-1 basis-full rounded-2xl md:basis-0 md:rounded-3xl"
          heading="Single Sign-On"
          icon={<PerformanceListItemIcon />}
        >
          Integrated with popular providers like Okta, to enable OpenID Connect
          login for maximum security.
        </InfoCard>
        <InfoCard
          as="li"
          className="flex-1 basis-full rounded-2xl md:rounded-3xl lg:basis-0"
          heading="RBAC"
          icon={<PerformanceListItemIcon />}
        >
          Control user access with detailed, role-based permissions for enhanced
          security and flexibility.
        </InfoCard>
      </ul>
    </section>
  );
}

function UltimatePerformanceCards() {
  return (
    <section className="px-4 py-6 sm:py-12 md:px-6 xl:px-[120px]">
      <Heading as="h2" className="text-balance text-center" size="md">
        GraphQL Federation for the Ultimate Performance
      </Heading>
      <ul className="mt-6 flex flex-row flex-wrap justify-center gap-2 md:mt-16 md:gap-6">
        <InfoCard
          as="li"
          className="flex-1 rounded-2xl md:rounded-3xl"
          heading="Team Autonomy"
          icon={<PerformanceListItemIcon />}
        >
          Perfect for domain-driven design, allowing teams to work contribute
          individual graphs in any language to a cohesive GraphQL API.
        </InfoCard>
        <InfoCard
          as="li"
          className="flex-1 basis-full rounded-2xl md:basis-0 md:rounded-3xl"
          heading="Scalability"
          icon={<PerformanceListItemIcon />}
        >
          Individual graphs can be scaled independently based on their specific
          requirements.
        </InfoCard>
        <InfoCard
          as="li"
          className="flex-1 basis-full rounded-2xl md:rounded-3xl lg:basis-0"
          heading="Unified API"
          icon={<PerformanceListItemIcon />}
        >
          Clients get a seamless, unified experience. The complexity is hidden
          behind a single endpoint.
        </InfoCard>
      </ul>
    </section>
  );
}

function LearnGraphQLFederationSection(props: { className?: string }) {
  return (
    <section
      className={cn(
        "to-green-1000 from-blueish-green relative rounded-3xl bg-linear-to-br p-8 sm:py-12 md:px-6 md:text-center lg:p-24",
        props.className,
      )}
    >
      <DecorationIsolation className="opacity-80">
        <ArchDecoration className="absolute -right-1/2 top-1/2 sm:-right-1/4 md:right-[-105px] md:top-[120px] [&>path]:fill-none [&>path]:stroke-white/30" />
        <HighlightDecoration className="absolute -bottom-16 -right-1 size-[600px] rotate-180 -scale-x-100 overflow-visible" />
      </DecorationIsolation>
      <Heading
        as="h2"
        className="flex items-center justify-center gap-4 text-pretty text-white"
        size="md"
      >
        What Is GraphQL Federation?
      </Heading>

      <p className="mt-4 text-pretty font-medium text-white/80">
        Understand what federated GraphQL API is, how it works, and why it may
        be the right choice for your API.
      </p>
      <CallToAction
        className="mx-auto mt-6 md:mt-8"
        href="/federation"
        title="Introduction to federated GraphQL APIs"
        variant="secondary"
      >
        Introduction to Federation
      </CallToAction>
    </section>
  );
}

function PerformanceListItemIcon() {
  return (
    <svg fill="currentColor" height="24" width="24">
      <path d="M5.25 7.5a2.25 2.25 0 1 1 3 2.122v4.756a2.251 2.251 0 1 1-1.5 0V9.622A2.25 2.25 0 0 1 5.25 7.5Zm9.22-2.03a.75.75 0 0 1 1.06 0l.97.97.97-.97a.75.75 0 1 1 1.06 1.06l-.97.97.97.97a.75.75 0 0 1-1.06 1.06l-.97-.97-.97.97a.75.75 0 1 1-1.06-1.06l.97-.97-.97-.97a.75.75 0 0 1 0-1.06Zm2.03 5.03a.75.75 0 0 1 .75.75v3.128a2.251 2.251 0 1 1-1.5 0V11.25a.75.75 0 0 1 .75-.75Z" />
    </svg>
  );
}
