"use client";

import { CallToAction } from "@hive/design-system/call-to-action";
import { cn } from "@hive/design-system/cn";
import { useRef, useState } from "react";

import { BookIcon } from "../book-icon";
import { Slider } from "../slider";

export function PricingSlider({
  className,
  onChange,
  showEnterpriseHint = true,
  ...rest
}: {
  className?: string;
  onChange: (value: number) => void;
  showEnterpriseHint: boolean;
}) {
  const min = 1;
  const max = 1000;

  const [popoverOpen, setPopoverOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative isolate block select-none rounded-3xl border border-green-400 p-4 [counter-set:ops_calc(var(--ops))] sm:p-8",
        className,
      )}
      ref={rootRef}
      // 10$ base price + 10$ per 1M
      style={
        {
          "--ops": min,
        } as React.CSSProperties
      }
      {...rest}
    >
      <div
        aria-hidden
        className="text-green-1000 flex flex-wrap items-center font-medium md:h-12 md:w-[calc(100%-260px)]"
      >
        <div className="w-full text-2xl">
          How many operations per month do you need?
        </div>
      </div>
      <div className="text-green-1000 flex flex-wrap items-center font-medium md:h-12 md:w-[calc(100%-260px)] text-lg">
        <div>
          <div className="flex w-full whitespace-pre rounded-[40px] bg-blue-300 px-3 py-1 tabular-nums leading-8 duration-[calc(clamp(0,var(--ops)-1,1)*350ms)] before:tracking-[-0.12em] before:content-[''_counter(ops)_'_'] motion-safe:transition-all">
            M
          </div>
        </div>
        <div className="whitespace-pre [@media(width<900px)]:hidden">
          {" "}
          operations per month{" "}
        </div>
      </div>
      <div className="text-green-1000 flex items-center gap-5 pt-4 text-sm">
        <span className="font-medium">{min}M</span>
        <Slider
          aria-label="How many operations per month do you need?"
          defaultValue={min}
          max={max}
          min={min}
          onChange={(event) => {
            const value = event.currentTarget.valueAsNumber;
            rootRef.current!.style.setProperty("--ops", String(value));
            onChange(value);
          }}
          step={1}
        />
        <span className="font-medium">{formatMillionsOrBillions(max)}</span>
      </div>

      {showEnterpriseHint && (
        <div className="mt-3 max-w-[600px]">
          <div className="font-bold">Consider using our Enterprise plan.</div>
          For volumes over 300M operations per month, our Enterprise plan is
          cheaper, with bulk discounts, dedicated support, and custom SLAs. It
          also makes scaling past 1 billion operations much more cost-effective.
        </div>
      )}

      {/* Native tooltip/popover to replace Radix Tooltip */}
      <div className="relative mt-6 md:absolute md:right-8 md:top-8 md:mt-0">
        <CallToAction
          id="operations-button"
          onClick={() => setPopoverOpen(!popoverOpen)}
          onMouseEnter={() => setPopoverOpen(true)}
          onMouseLeave={() => setPopoverOpen(false)}
          variant="tertiary"
        >
          <BookIcon /> Learn about operations
        </CallToAction>
        {popoverOpen && (
          <div className="border-beige-400 bg-beige-100 text-green-1000 absolute bottom-full left-1/2 z-50 mb-2 md:min-w-[300px] max-w-[328px] -translate-x-1/2 overflow-visible rounded-2xl border px-4 py-3 shadow-md sm:max-w-[420px]">
            Every GraphQL request that is processed by your GraphQL API and
            reported to GraphQL Hive. If your server receives 1M GraphQL
            requests, all of them will be reported to Hive (assuming no
            sampling).
          </div>
        )}
      </div>
    </div>
  );
}

function formatMillionsOrBillions(num: number) {
  if (num % 1000 !== 0) {
    return `${num}M`;
  }
  return `${num / 1000}B`;
}
