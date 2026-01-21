'use client';

import { HTMLAttributes, ReactElement, ReactNode, useRef, useState } from 'react';

import { cn } from '@hive/design-system/guild-components/cn';
import { CallToAction } from '@hive/design-system/guild-components/components/call-to-action';
import { ContactButton, ContactTextLink } from '@hive/design-system/guild-components/components/contact-us';
import { Heading } from '@hive/design-system/guild-components/components/heading';
import { ShieldFlashIcon } from '@hive/design-system/guild-components/components/icons';
import { TextLink } from '@hive/design-system/guild-components/components/text-link';
import { Tooltip } from '../tooltip';
import {
  AvailabilityIcon,
  BillingIcon,
  EnterpriseSupportIcon,
  FeaturesIcon,
  OperationsIcon,
  RetentionIcon,
  ShortCheckmarkIcon,
  SSOIcon,
  UsageIcon,
} from './icons';
import { PlanCard } from './plan-card';
import { PricingSlider } from './pricing-slider';

interface PlanFeaturesListItemProps extends HTMLAttributes<HTMLLIElement> {
  category: string;
  features: ReactNode[];
  icon: ReactNode;
  tooltip?: string;
}

function PlanFeaturesListItem({
  category,
  features,
  icon,
  tooltip,
  ...rest
}: PlanFeaturesListItemProps) {
  const content = (
    <>
      <strong className="flex h-6 items-center gap-2 font-bold [&>svg]:size-4 [&>svg]:text-green-600">
        {icon}
        {category}
      </strong>
      {features.map((feature, index) => (
        <span className="mt-2 flex gap-2 leading-6" key={index}>
          <ShortCheckmarkIcon className="my-1 size-4 text-green-600" />
          {feature}
        </span>
      ))}
    </>
  );
  return (
    <li
      className="border-beige-200 flex flex-col px-1 py-2 text-sm text-[#4F6C6A] [&:not(:last-child)]:border-b"
      {...rest}
    >
      {tooltip ? <Tooltip content={tooltip}>{content}</Tooltip> : content}
    </li>
  );
}

const USAGE_DATA_RETENTION_EXPLAINER = 'How long your GraphQL operations are stored on Hive';
const OPERATIONS_EXPLAINER = 'GraphQL operations reported to Hive Console';

export function Pricing({ className }: { className?: string }): ReactElement {
  type PlanType = 'Enterprise' | 'Hobby' | 'Pro';

  const [highlightedPlan, setHighlightedPlan] = useState<PlanType>('Hobby');
  const scrollviewRef = useRef<HTMLDivElement>(null);

  return (
    <section className={cn('py-12 sm:py-20', className)}>
      <div className="mx-auto box-border w-full max-w-[1200px]">
        <Heading as="h3" className="max-md:text-[32px]/10 max-sm:tracking-[-.16px]" size="md">
          Operations: learn more about usage-based pricing
        </Heading>
        <p className="mt-6 text-green-800">
          Hive Console is completely free to use. We charge only for operations collected and
          processed.
        </p>

        <PricingSlider
          className="mt-6 lg:mt-12"
          onChange={value => {
            const newPlan = value === 1 ? 'Hobby' : value < 280 ? 'Pro' : 'Enterprise';
            if (newPlan !== highlightedPlan) {
              setHighlightedPlan(newPlan);
              if (!scrollviewRef.current) return;
              const card = scrollviewRef.current.querySelector(
                `[data-plan="${newPlan}"]`,
              ) as HTMLElement;
              if (!card) return;

              const { left, right } = card.getBoundingClientRect();
              const containerRect = scrollviewRef.current.getBoundingClientRect();
              const {scrollLeft} = scrollviewRef.current;
              const containerLeft = containerRect.left;
              const padding = Number.parseInt(globalThis.getComputedStyle(scrollviewRef.current).paddingLeft);

              const cardLeftRelativeToContainer = left - containerLeft;
              const cardRightRelativeToContainer = right - containerLeft;

              if (
                cardLeftRelativeToContainer >= padding &&
                cardRightRelativeToContainer <= containerRect.width - padding
              ) {
                return;
              }

              let targetScrollLeft = scrollLeft;

              if (cardLeftRelativeToContainer < padding) {
                targetScrollLeft = scrollLeft - (padding - cardLeftRelativeToContainer);
              } else if (cardRightRelativeToContainer > containerRect.width - padding) {
                targetScrollLeft =
                  scrollLeft + (cardRightRelativeToContainer - (containerRect.width - padding));
              }

              scrollviewRef.current.scrollTo({
                behavior: 'smooth',
                left: targetScrollLeft,
              });
            }
          }}
        />

        <div
          // the padding is here so `overflow-auto` doesn't cut button hover states
          className="nextra-scrollbar -mx-4 -mb-6 flex flex-col items-stretch gap-6 px-4 py-6 sm:flex-row sm:overflow-auto sm:*:min-w-[380px] md:-mx-6 md:px-6"
          ref={scrollviewRef}
        >
          <PlanCard
            adjustable={false}
            callToAction={
              <CallToAction href="https://app.graphql-hive.com" variant="tertiary">
                Get started for free
              </CallToAction>
            }
            data-plan="Hobby"
            description="For personal or small projects"
            features={
              <>
                <PlanFeaturesListItem
                  category="Operations per month"
                  features={['1M operations per month']}
                  icon={<OperationsIcon />}
                  tooltip={OPERATIONS_EXPLAINER}
                />
                <PlanFeaturesListItem
                  category="Usage data retention"
                  features={['7 days']}
                  icon={<RetentionIcon />}
                  tooltip={USAGE_DATA_RETENTION_EXPLAINER}
                />
                <PlanFeaturesListItem
                  category="Features"
                  features={['Full access to everything!']}
                  icon={<FeaturesIcon />}
                />
                <PlanFeaturesListItem
                  category="Usage"
                  features={[
                    'Unlimited seats, projects and organizations',
                    'GitHub issues and chat support',
                    'Unlimited schema pushes and checks',
                  ]}
                  icon={<UsageIcon />}
                />
                <PlanFeaturesListItem
                  category="Availability"
                  features={['99.95% uptime for operation', '100% uptime for schema registry CDN']}
                  icon={<ShieldFlashIcon />}
                />
                <PlanFeaturesListItem
                  category="SSO"
                  features={['Single sign-on via Open ID provider']}
                  icon={<SSOIcon />}
                />
              </>
            }
            highlighted={highlightedPlan === 'Hobby'}
            name="Hobby"
            price="Free forever"
          />
          <PlanCard
            adjustable
            callToAction={
              <CallToAction href="https://app.graphql-hive.com" variant="primary">
                Try free for 30 days
              </CallToAction>
            }
            data-plan="Pro"
            description="For scaling API and teams"
            features={
              <>
                <PlanFeaturesListItem
                  category="Operations per month"
                  features={[
                    // eslint-disable-next-line react/jsx-key
                    <span>
                      1M operations per month
                      <small className="block text-xs">Then $10 per million operations</small>
                    </span>,
                  ]}
                  icon={<OperationsIcon />}
                  tooltip={OPERATIONS_EXPLAINER}
                />
                <PlanFeaturesListItem
                  category="Usage data retention"
                  features={['90 days']}
                  icon={<RetentionIcon />}
                  tooltip={USAGE_DATA_RETENTION_EXPLAINER}
                />
                <PlanFeaturesListItem
                  category="Features"
                  features={['Everything in Hobby, plus the ability to scale past 1M operations.']}
                  icon={<FeaturesIcon />}
                />
                <PlanFeaturesListItem
                  category="Usage"
                  features={[
                    'Unlimited seats, projects and organizations',
                    'GitHub issues and chat support',
                    'Unlimited schema pushes and checks',
                  ]}
                  icon={<UsageIcon />}
                />
                <PlanFeaturesListItem
                  category="Availability"
                  features={['99.95% uptime for operation', '100% uptime for schema registry CDN']}
                  icon={<AvailabilityIcon />}
                />
                <PlanFeaturesListItem
                  category="SSO"
                  features={['Single sign-on via Open ID provider']}
                  icon={<SSOIcon />}
                />
              </>
            }
            highlighted={highlightedPlan === 'Pro'}
            name="Pro"
            price={
              <Tooltip content="Base price charged monthly">
                $20<span className="text-base leading-normal text-green-800"> / month</span>
              </Tooltip>
            }
            startingFrom
          />
          <PlanCard
            adjustable
            callToAction={
              <ContactButton variant="primary">
                <span>
                  Shape a custom plan <span className="hidden sm:inline">for your business</span>
                </span>
              </ContactButton>
            }
            data-plan="Enterprise"
            description="Custom plan for large companies"
            features={
              <>
                <PlanFeaturesListItem
                  category="Operations per month"
                  features={[
                    'Custom operation limit',
                    'Large request volume discount',
                    'Ability to exceed operation limit without loss of data',
                  ]}
                  icon={<OperationsIcon />}
                  tooltip={OPERATIONS_EXPLAINER}
                />
                <PlanFeaturesListItem
                  category="Usage data retention"
                  features={['One year or more']}
                  icon={<RetentionIcon />}
                  tooltip={USAGE_DATA_RETENTION_EXPLAINER}
                />
                <PlanFeaturesListItem
                  category="Features"
                  features={['Everything in Pro, plus full enterprise support.']}
                  icon={<FeaturesIcon />}
                />
                <PlanFeaturesListItem
                  category="Enterprise support"
                  features={[
                    'Dedicated Slack channel for support',
                    'White-glove onboarding',
                    // eslint-disable-next-line react/jsx-key
                    <span>
                      GraphQL / APIs support and guidance from{' '}
                      <TextLink href="https://theguild.dev">The&nbsp;Guild</TextLink>
                    </span>,
                    '365, 24/7 support, SLA tailored to your needs',
                    'Custom Data Processing Agreements (DPA)',
                  ]}
                  icon={<EnterpriseSupportIcon />}
                />
                <PlanFeaturesListItem
                  category="Availability"
                  features={['99.95% uptime for operation', '100% uptime for schema registry CDN']}
                  icon={<AvailabilityIcon />}
                />
                <PlanFeaturesListItem
                  category="SSO"
                  features={['Single sign-on via Open ID provider']}
                  icon={<SSOIcon />}
                />
                <PlanFeaturesListItem
                  category="Customized Billing"
                  features={[
                    'Flexible billing options tailored to enterprise procurement processes',
                  ]}
                  icon={<BillingIcon />}
                />
              </>
            }
            highlighted={highlightedPlan === 'Enterprise'}
            name="Enterprise"
            price={
              <ContactTextLink className="hover:text-current hover:no-underline">
                Contact us
              </ContactTextLink>
            }
          />
        </div>
      </div>
    </section>
  );
}
