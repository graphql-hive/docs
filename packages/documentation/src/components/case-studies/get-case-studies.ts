import { CaseStudyFile } from './case-study-types';

// TODO: Migrate case studies MDX content and implement proper data fetching
// For now, return an empty array as placeholder
export async function getCaseStudies(): Promise<CaseStudyFile[]> {
  // When case studies are migrated, implement the data fetching here
  // You could use:
  // - Static JSON file with case study metadata
  // - CMS integration
  // - MDX file parsing with fumadocs
  return [];
}
