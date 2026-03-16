import { GetYourAPIGameRightSection } from "@hive/design-system";

import { LandingPageContainer } from "../landing-page-container";
import { BlogPageHero } from "./blog-page-hero";
import { CompanyNewsAndPressSection } from "./company-news-and-press-section";

export function BlogPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <LandingPageContainer className="text-green-1000 mx-auto w-360 max-w-full overflow-hidden dark:text-white">
      <BlogPageHero className="mx-4 max-sm:mt-2 md:mx-6" />
      {children}
      <CompanyNewsAndPressSection className="mx-4 md:mx-6" />
      <GetYourAPIGameRightSection className="light text-green-1000 dark:bg-primary/95 mx-4 sm:mb-6 md:mx-6" />
    </LandingPageContainer>
  );
}
