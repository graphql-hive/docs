import { cn, Heading } from "@hive/design-system";

import {
  CaseStudiesArchDecoration,
  CaseStudiesGradientDefs,
} from "./case-studies-arch-decoration";
import { CaseStudyCard } from "./case-study-card";
import { CaseStudyFile } from "./case-study-types";
import { getCompanyLogo } from "./company-logos";

export function FeaturedCaseStudiesGrid({
  caseStudies,
  className,
}: {
  caseStudies: CaseStudyFile[];
  className?: string;
}) {
  if (process.env.NODE_ENV === "development" && caseStudies.length < 6) {
    while (caseStudies.length < 6) {
      caseStudies = [...caseStudies, ...caseStudies, ...caseStudies];
    }
  }

  return (
    <section
      className={cn("grid gap-6", className)}
      style={{
        gridTemplateAreas:
          "'a1 a1 a1 a2 a2 a2' 'a3 a3 ac ac a4 a4' 'a5 a5 a5 a6 a6 a6'",
      }}
    >
      <header
        className="relative flex h-[508px] w-[448px] items-center overflow-hidden"
        style={{ gridArea: "ac" }}
      >
        <Heading as="h2" className="text-center" size="md">
          What teams say about Hive
        </Heading>
        <CaseStudiesArchDecoration
          className="absolute -right-8 top-0 w-full rotate-180 overflow-visible"
          gradientId="featured-studies-gradient"
        />
        <CaseStudiesArchDecoration
          className="absolute -left-8 bottom-0 w-full overflow-visible"
          gradientId="featured-studies-gradient"
        />
        <CaseStudiesGradientDefs
          gradientId="featured-studies-gradient"
          stops={
            <>
              <stop offset="0%" stopColor="#F1EEE4" stopOpacity={0} />
              <stop
                className="dark:[stop-opacity:0.1]"
                offset="100%"
                stopColor="#F1EEE4"
                stopOpacity={1}
              />
            </>
          }
        />
      </header>
      {caseStudies.slice(0, 6).map((caseStudy, i) => (
        <CaseStudyCard
          excerpt={caseStudy.frontMatter.excerpt}
          href={caseStudy.route}
          key={i}
          logo={getCompanyLogo(caseStudy.name)}
          style={{ gridArea: `a${i + 1}` }}
        />
      ))}
    </section>
  );
}
