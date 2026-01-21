'use client';

import { Suspense, use } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { CallToAction } from '@hive/design-system/guild-components/components/call-to-action';
import { ContactButton } from '@hive/design-system/guild-components/components/contact-us';
import { DecorationIsolation } from '@hive/design-system/guild-components/components/decorations';
import { Heading } from '@hive/design-system/guild-components/components/heading';
import {
  CaseStudiesArchDecoration,
  CaseStudiesGradientDefs,
} from '../components/case-studies/case-studies-arch-decoration';
import { AllCaseStudiesList } from '../components/case-studies/all-case-studies-list';
import { FeaturedCaseStudiesGrid } from '../components/case-studies/featured-case-studies-grid';
import { getCaseStudies } from '../components/case-studies/get-case-studies';
import { GetYourAPIGameWhite } from '../components/get-your-api-game-white';
import { HeroLinks } from '../components/hero';
import { LandingPageContainer } from '../components/landing-page-container';
import { TrustedBySection } from '../components/trusted-by-section';

export const Route = createFileRoute('/case-studies')({
  component: CaseStudiesPage,
});

const caseStudiesPromise = getCaseStudies();

function CaseStudiesPage() {
  return (
    <LandingPageContainer className="mx-auto max-w-[90rem] overflow-hidden px-6">
      <header className="bg-primary dark:bg-primary/[0.01] dark:border-primary/5 relative isolate flex flex-col gap-6 overflow-hidden rounded-3xl px-4 py-6 max-sm:mt-2 sm:py-12 md:gap-8 lg:py-24">
        <Heading
          size="xl"
          as="h1"
          className="relative z-10 mx-auto max-w-3xl text-balance text-center max-md:text-5xl"
        >
          Best teams. Hive{'‑' /* non-breaking hyphen */}powered.
        </Heading>
        <p className="relative z-10 text-pretty text-center text-green-800 dark:text-white/80">
          See the results our Customers achieved by switching to Hive.
        </p>
        <HeroLinks>
          <ContactButton variant="secondary-inverted">Talk to us</ContactButton>
          <CallToAction variant="tertiary" href="/pricing">
            Explore Pricing
          </CallToAction>
        </HeroLinks>
        <DecorationIsolation className="max-sm:opacity-75 dark:opacity-10">
          <CaseStudiesGradientDefs
            gradientId="case-studies-hero-gradient"
            stops={
              <>
                <stop stopColor="white" stopOpacity="0.3" />
                <stop offset="1" stopColor="white" />
              </>
            }
          />
          <CaseStudiesArchDecoration
            gradientId="case-studies-hero-gradient"
            className="absolute left-[-180px] top-0 rotate-180 max-md:h-[155px] sm:left-[-100px] xl:left-0"
          />
          <CaseStudiesArchDecoration
            gradientId="case-studies-hero-gradient"
            className="absolute bottom-0 right-[-180px] max-md:h-[155px] sm:right-[-100px] xl:right-0"
          />
        </DecorationIsolation>
      </header>
      <Suspense
        fallback={
          <div className="mt-6 flex animate-pulse items-center justify-center py-24">
            Loading case studies...
          </div>
        }
      >
        <CaseStudiesContent />
      </Suspense>
      <GetYourAPIGameWhite />
    </LandingPageContainer>
  );
}

function CaseStudiesContent() {
  const caseStudies = use(caseStudiesPromise);

  return (
    <>
      {(caseStudies.length >= 6 || process.env.NODE_ENV === 'development') && (
        <>
          <FeaturedCaseStudiesGrid caseStudies={caseStudies} className="mt-6 max-xl:hidden" />
          <TrustedBySection className="mx-auto my-8 md:mt-24" />
        </>
      )}
      <AllCaseStudiesList caseStudies={caseStudies} />
    </>
  );
}
