"use client";

import { cn } from "@hive/design-system/cn";
import { Heading } from "@hive/design-system/heading";
import { ReactNode } from "react";
import CountUp from "react-countup";

export function StatsItem(props: {
  decimal?: boolean;
  label: string;
  suffix: string;
  value: number;
}) {
  return (
    <div className="flex items-end justify-between gap-4 rounded-3xl border border-green-400 p-8 lg:flex-col lg:items-start lg:p-12">
      <Heading
        as="div"
        className="text-green-1000 min-w-[120px] text-[48px] lg:text-6xl"
        size="xl"
      >
        <CountUp
          decimal="."
          decimals={props.decimal ? 1 : 0}
          duration={2}
          enableScrollSpy
          end={props.value}
          scrollSpyDelay={100}
          scrollSpyOnce
          start={0}
        >
          {({ countUpRef }) => <span aria-live="polite" ref={countUpRef} />}
        </CountUp>
        {props.suffix}
      </Heading>
      <div className="mb-3 font-medium max-md:text-right sm:mb-3 md:mb-2 lg:mb-0">
        {props.label}
      </div>
    </div>
  );
}

export function StatsList(props: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn("p-6 sm:py-20 md:py-24 xl:px-[120px]", props.className)}
    >
      <Heading as="h2" className="text-center" size="md">
        Living and Breathing GraphQL Federation
      </Heading>
      <div className="mx-auto mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-4">
        {props.children}
      </div>
    </section>
  );
}
