import { SoundYXZLogo, ToastLogo, WealthsimpleLogo } from "../company-logos";

/**
 * Take note that these logos may have different dimensions than logos used elsewhere.
 */
export const companyLogos = {
  "sound-xyz": <SoundYXZLogo height={64} width={193} />,
  toast: <ToastLogo height={64} width={158} />,
  wealthsimple: <WealthsimpleLogo height={64} width={212} />,
};

export function getCompanyLogo(company: string) {
  if (company in companyLogos) {
    return companyLogos[company as keyof typeof companyLogos];
  }

  throw new Error(
    `No logo found for ${company}. We have the following: (${Object.keys(companyLogos).join(", ")})`,
  );
}
