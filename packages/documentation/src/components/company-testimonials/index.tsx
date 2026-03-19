"use client";

import { Tabs } from "@base-ui-components/react/tabs";
import { CallToAction } from "@hive/design-system/call-to-action";
import { cn } from "@hive/design-system/cn";
import { Heading } from "@hive/design-system/heading";
import { Image } from "@unpic/react";
import React, { Fragment, useRef, useState } from "react";

import { ArrowIcon } from "../arrow-icon";
import {
  HemnetLogo,
  KarrotLogo,
  type LogoProps,
  NacelleLogo,
  ProdigyLogo,
  WealthsimpleLogo,
} from "../company-logos";
import hemnetPicture from "./hemnet-picture.webp";
import karrotPicture from "./karrot-picture.webp";
import nacellePicture from "./nacelle-picture.webp";
import prodigyPicture from "./prodigy-picture.webp";
import wealthsimplePicture from "./wealthsimple-picture.webp";

// Type for static image imports (Vite/webpack)
type StaticImageData = {
  blurDataURL?: string;
  height: number;
  src: string;
  width: number;
};

type Testimonial = {
  caseStudyHref?: string;
  company: string;
  data?: { description: string; numbers: string }[];
  logo: (props: LogoProps) => React.ReactElement;
  person?: { image?: string; name: string; title: string };
  picture?: {
    className?: string;
    img: StaticImageData | string;
  };
  text: React.ReactNode;
};

const testimonials: Testimonial[] = [
  {
    caseStudyHref: "/case-studies/hemnet",
    company: "Hemnet",
    logo: ({ className, ...props }) => (
      <div
        className={cn("flex h-8 w-min items-center justify-center", className)}
      >
        <HemnetLogo {...props} className="" height={37} />
      </div>
    ),
    picture: {
      img: hemnetPicture,
    },
    text: (
      <>
        We expected that moving from Apollo Router to a Hive Gateway would come
        with a measurable performance cost, but found the Hive Gateway running
        with less than 30% resource usage than Apollo Router, and it was holding
        tens of thousands of requests per minute. The resource efficiency
        reflected strong engineering from the Hive team.
      </>
    ),
  },
  {
    caseStudyHref: "/case-studies/wealthsimple",
    company: "Wealthsimple",
    logo: (props) => (
      <WealthsimpleLogo
        {...props}
        className={cn("translate-y-[2px]", props.className)}
        height={26}
      />
    ),
    picture: {
      img: wealthsimplePicture,
    },
    text: "Hive enables Wealthsimple to build flexible and resilient GraphQL APIs. The GitHub integration provides feedback in a format developers are familiar with and conditional breaking changes enable us to focus our discussion on schema design rather than maintenance. Hive empowers us to confidently evolve our schemas by ensuring seamless API updates, detecting potential breaking changes, and guiding developers.",
  },
  {
    company: "nacelle",
    logo: NacelleLogo,
    picture: { img: nacellePicture },
    text: "Our migration from Apollo GraphOS to Hive was incredibly straightforward. In less than a month, we had about 20 subgraphs running on Hive in production. The process was smooth, and the Hive team's friendly demeanor made it even more pleasant. Although we haven't needed direct assistance with our implementation, their openness to feedback and generally nice attitude has fostered a sense of collaboration and partnership.",
    // data: [
    //   { numbers: '65M+', description: 'daily events processed' },
    //   { numbers: '40%', description: 'more resource efficient' },
    // ],
    // caseStudyHref: ""
  },
  {
    company: "Karrot",
    logo: KarrotLogo,
    picture: { img: karrotPicture },
    text: "We use Hive as schema registry and monitoring tool. As a schema registry, we can publish GraphQL Schema with decoupled any application code. As a monitoring tool, we can find useful metrics. For example operation latency, usage of deprecated field. The great thing about GraphQL Hive is that it is easy to use, we have already integrated many tools like Slack or Github.",
  },
  {
    company: "Prodigy",
    data: [{ description: "requests every month", numbers: ">750M" }],
    logo: ({ className, ...props }) => (
      <div
        className={cn("flex h-8 w-min items-center justify-center", className)}
      >
        <ProdigyLogo {...props} className="" height={37} />
      </div>
    ),
    picture: {
      className: "bg-[#a9e7f599]",
      img: prodigyPicture,
    },
    text: (
      <>
        Hive is essential to us handling more than 750M GraphQL requests every
        month. We ship with certainty that schema changes will not break
        clients. The <code>atLeastOnceSampler</code> is crucial to capture
        telemetry from less-often run operations. The schema explorer condenses
        hours of searching through Github for client usage down to minutes.
      </>
    ),
  },
];

export function CompanyTestimonialsSection({
  className,
}: {
  className?: string;
}) {
  const [currentTab, setCurrentTab] = useState(testimonials[0]?.company);
  const scrollviewRef = React.useRef<HTMLDivElement>(null);
  const updateTabOnScroll = useRef<() => void>(undefined);
  updateTabOnScroll.current ||= debounce(() => {
    const scrollview = scrollviewRef.current;
    if (!scrollview) return;
    const { scrollLeft, scrollWidth } = scrollview;
    const index = Math.round((scrollLeft / scrollWidth) * testimonials.length);
    const company = testimonials[index]?.company;
    if (company) setCurrentTab(company);
  }, 50);

  return (
    <section
      className={cn(
        "bg-beige-100 text-green-1000 relative rounded-3xl px-4 py-6 md:p-10 lg:p-18",
        className,
      )}
    >
      <Heading as="h2" size="md">
        Loved by Developers, Trusted by Businesses
      </Heading>
      <Tabs.Root
        className="flex flex-col overflow-hidden"
        // we need scrolling for mobile, so this can't be changed to a state-driven opacity transition
        onValueChange={(value) => {
          setCurrentTab(value as string);
          const id = getTestimonialId(value as string);
          const element = document.getElementById(id)?.parentElement;
          const scrollview = scrollviewRef.current;

          if (!scrollview || !element) return;

          // we don't use scrollIntoView because it will also scroll vertically
          scrollview.scrollTo({
            behavior: "instant",
            left: element.offsetLeft,
          });
        }}
        value={currentTab}
      >
        <Tabs.List
          activateOnFocus
          className="lg:bg-beige-200 z-10 order-1 mt-4 flex flex-row justify-center rounded-2xl px-1 -mx-1 lg:order-first lg:my-16"
        >
          {testimonials.map((testimonial) => {
            const Logo = testimonial.logo;
            return (
              <Tabs.Tab
                className="hive-focus lg:aria-selected:bg-white aria-selected:text-green-1000 lg:aria-selected:border-beige-600 flex flex-1 grow-0 items-center justify-center rounded-[15px] border-transparent p-0.5 font-medium leading-6 text-green-800 lg:grow lg:border lg:bg-transparent lg:p-4 [&[aria-selected=true]>:first-child]:bg-blue-400"
                key={testimonial.company}
                value={testimonial.company}
              >
                <div className="size-2 rounded-full bg-blue-200 transition-colors lg:hidden" />
                <Logo
                  className="max-lg:sr-only"
                  height={32}
                  title={testimonial.company}
                />
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        <div
          className="no-scrollbar -m-2 -mb-10 flex snap-x snap-mandatory gap-4 overflow-auto p-2 lg:pb-10"
          onScroll={updateTabOnScroll.current}
          /* mobile scrollview */
          ref={scrollviewRef}
        >
          {testimonials.map(
            ({
              caseStudyHref,
              company,
              data,
              logo: Logo,
              person,
              picture,
              text,
            }) => {
              return (
                <Tabs.Panel
                  className={cn(
                    "relative flex w-full shrink-0 snap-center flex-col outline-hidden",
                    "gap-6 md:flex-row lg:gap-12",
                    "lg:data-hidden:hidden",
                    caseStudyHref
                      ? "not-data-hidden:pb-[72px] lg:not-data-hidden:pb-0"
                      : "max-lg:pb-8",
                  )}
                  keepMounted // we mount everything, as we scroll through tabs on mobile
                  key={company}
                  tabIndex={-1}
                  value={company}
                >
                  {picture && (
                    <Image
                      alt=""
                      className={cn(
                        "hidden size-[300px] shrink-0 rounded-3xl object-cover mix-blend-multiply max-lg:mt-6 md:block",
                        picture.className,
                      )}
                      height={300}
                      role="presentation"
                      src={
                        typeof picture.img === "string"
                          ? picture.img
                          : picture.img.src
                      }
                      width={300}
                    />
                  )}
                  <article
                    className="max-lg:mt-6 lg:relative"
                    id={getTestimonialId(company)}
                  >
                    <Logo
                      className="text-blue-1000 mb-6 lg:hidden"
                      height={32}
                      title={company}
                    />
                    <blockquote
                      className={cn(
                        "sm:blockquote-beige-500 lg:text-xl xl:text-2xl xl:leading-[32px] [&_code]:font-mono [&_code]:text-[0.9em]",
                        data && "lg:text-lg",
                      )}
                    >
                      {text}
                    </blockquote>
                    {person && (
                      <TestimonialPerson className="mt-6" person={person} />
                    )}
                    {caseStudyHref && (
                      <CallToAction
                        className="absolute bottom-0 w-full md:w-fit"
                        href={caseStudyHref}
                        variant="primary"
                      >
                        Read the case study
                        <ArrowIcon />
                      </CallToAction>
                    )}
                  </article>
                  {data && (
                    <>
                      <div
                        /* divider */ className="bg-beige-600 hidden w-px md:block"
                      />
                      <ul className="flex gap-6 md:flex-col md:gap-12">
                        {data.map(({ description, numbers }, i) => (
                          <Fragment key={i}>
                            <li>
                              <span className="block text-[40px] leading-[1.2] tracking-[-0.2px] md:text-6xl md:leading-[1.1875] md:tracking-[-0.64px]">
                                {numbers}
                              </span>
                              <span className="mt-2">{description}</span>
                            </li>

                            {i < data.length - 1 && (
                              <div
                                /* divider */ className="bg-beige-600 w-px md:hidden"
                              />
                            )}
                          </Fragment>
                        ))}
                      </ul>
                    </>
                  )}
                </Tabs.Panel>
              );
            },
          )}
        </div>
      </Tabs.Root>
    </section>
  );
}

function getTestimonialId(company: string) {
  return encodeURIComponent(company.toLowerCase()) + "-testimonial";
}

function TestimonialPerson({
  className,
  person,
}: {
  className?: string;
  person: Testimonial["person"];
}) {
  if (!person) return null;

  return (
    <div className={className}>
      {person.image && (
        <Image
          alt=""
          className="bg-beige-200 float-left mr-4 size-[42px] shrink-0 translate-y-[.5px] rounded-full xl:hidden"
          height={42}
          role="presentation"
          src={person.image}
          width={42}
        />
      )}
      <p className="text-sm/5 font-medium">{person.name}</p>
      <p className="mt-1 text-xs text-green-800 md:text-sm">{person.title}</p>
    </div>
  );
}

function debounce<T extends (...args: never[]) => void>(fn: T, delay = 100) {
  let timeout: NodeJS.Timeout;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  } as T;
}
