import { Anchor } from "@hive/design-system";
import { cn } from "@hive/design-system/cn";

import {
  AligentLogo,
  HemnetLogo,
  KarrotLogo,
  LinktreeLogo,
  MeetupLogo,
  SoundYXZLogo,
} from "./company-logos";

export function TrustedBySection(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <div {...props} className={cn("max-w-[80%] text-center", props.className)}>
      <p className="text-base text-blue-800 dark:text-white/80">
        Trusted by global enterprises and fast-moving startups
      </p>
      <div className="text-blue-1000 mt-6 flex flex-row flex-wrap items-center justify-center gap-x-16 gap-y-6 dark:text-white">
        <MeetupLogo className="translate-y-[5px]" height={32} title="Meetup" />
        <LinktreeLogo height={22} title="Linktree" />
        <KarrotLogo height={28} title="Karrot" />
        <AligentLogo height={32} title="Aligent" />
        <Anchor
          className="hover:bg-beige-100 dark:bg-neutral-800 px-3 py-2 -my-2 -mx-3 rounded-lg"
          href="/case-studies/hemnet"
        >
          <HemnetLogo height={32} title="Hemnet" />
        </Anchor>
        <SoundYXZLogo height={32} title="SoundXYZ" />
      </div>
    </div>
  );
}
