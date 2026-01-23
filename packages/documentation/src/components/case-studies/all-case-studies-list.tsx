import { Heading } from "@hive/design-system";

import { CaseStudyCard } from "./case-study-card";
import { CaseStudyFile } from "./case-study-types";
import { getCompanyLogo } from "./company-logos";

export function AllCaseStudiesList({
  caseStudies,
}: {
  caseStudies: CaseStudyFile[];
}) {
  return (
    <section className="py-6 sm:pt-24">
      <Heading as="h2" className="text-center" size="md">
        Explore customer stories
      </Heading>
      <ul className="mt-6 flex gap-4 max-lg:flex-col sm:mt-16 sm:gap-6">
        {caseStudies.map((caseStudy) => {
          return (
            <li className="relative basis-1/3" key={caseStudy.name}>
              <CaseStudyCard
                category={caseStudy.frontMatter.category}
                className="h-full"
                excerpt={caseStudy.frontMatter.excerpt}
                href={caseStudy.route}
                logo={getCompanyLogo(caseStudy.name)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
