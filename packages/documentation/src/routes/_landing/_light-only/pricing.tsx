import {
  ArchDecoration,
  DecorationIsolation,
  GetYourAPIGameRightSection,
  Heading,
} from "@hive/design-system";
import { cn } from "@hive/design-system/cn";
import { createFileRoute } from "@tanstack/react-router";

import { CompanyTestimonialsSection } from "../../../components/company-testimonials";
import { FrequentlyAskedQuestions } from "../../../components/frequently-asked-questions";
import { LandingPageContainer } from "../../../components/landing-page-container";
import { PlanComparison } from "../../../components/plan-comparison";
import { Pricing } from "../../../components/pricing";
import { PlansTable } from "../../../components/pricing/plans-table";
import { seo } from "../../../lib/seo";

export const Route = createFileRoute("/_landing/_light-only/pricing")({
  component: PricingPage,
  head: ({ match }) =>
    seo({
      breadcrumbs: [{ name: "Pricing", pathname: match.pathname }],
      description:
        "Honest pricing plans for GraphQL Federation and other GraphQL APIs, supporting developers to enterprise with Open-Source schema registry, analytics, and gateway solutions",
      pathname: match.pathname,
      title: "Hive Platform Pricing",
    }),
});

function PricingPage() {
  return (
    <LandingPageContainer className="text-green-1000 light mx-auto max-w-360 overflow-hidden">
      <PricingPageHero className="mx-4 max-sm:mt-2 md:mx-6" />
      <Pricing className="mx-4 md:mx-6" />
      <PlanComparison className="mx-4 md:mx-6" />
      <PlansTable />
      <CompanyTestimonialsSection className="mx-4 mt-6 md:mx-6" />
      <FrequentlyAskedQuestions className="mx-4 md:mx-6" />
      <GetYourAPIGameRightSection className="mx-4 sm:mb-6 md:mx-6" />
    </LandingPageContainer>
  );
}

function PricingPageHero({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-beige-100 relative isolate flex max-w-360 flex-col gap-6 overflow-hidden rounded-3xl px-4 py-6 sm:py-12 md:gap-8 lg:py-24",
        className,
      )}
    >
      <DecorationIsolation>
        <ArchDecoration className="pointer-events-none absolute left-[-46px] top-[-20px] size-[200px] rotate-180 md:left-[-60px] md:top-[-188px] md:size-auto" />
        <ArchDecoration className="pointer-events-none absolute bottom-0 right-[-53px] size-[200px] md:-bottom-32 md:size-auto lg:bottom-[-188px] lg:right-0" />
        <svg
          className="absolute -z-10"
          height="432"
          viewBox="0 0 432 432"
          width="432"
        >
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="arch-decoration-a"
              x1="48.5"
              x2="302.5"
              y1="53.5"
              y2="341"
            >
              <stop stopColor="#fff" stopOpacity="0.3" />
              <stop offset="1" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="arch-decoration-b"
              x1="1"
              x2="431"
              y1="1"
              y2="431"
            >
              <stop stopColor="#fff" stopOpacity="0.1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </DecorationIsolation>
      <Heading
        as="h1"
        className="text-green-1000 z-0 mx-auto max-w-3xl text-center"
        size="xl"
      >
        Honest pricing plans for your API management
      </Heading>
      <p className="z-0 mx-auto max-w-[80%] text-center leading-6 text-green-800">
        From hobbyists to enterprises — enjoy all features and usage-based
        pricing.
      </p>
    </div>
  );
}
