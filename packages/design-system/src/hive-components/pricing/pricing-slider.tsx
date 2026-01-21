'use client';

import { useRef, useState } from 'react';

import { cn } from '../../guild-components/cn';
import { CallToAction } from '../../guild-components/components/call-to-action';
import { BookIcon } from '../book-icon';
import { Slider } from '../slider';

export function PricingSlider({
  className,
  onChange,
  ...rest
}: {
  className?: string;
  onChange: (value: number) => void;
}) {
  const min = 1;
  const max = 300;

  const [popoverOpen, setPopoverOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        'relative isolate block select-none rounded-3xl border border-green-400 p-4 [counter-set:ops_calc(var(--ops))] sm:p-8',
        className,
      )}
      ref={rootRef}
      // 10$ base price + 10$ per 1M
      style={{ '--ops': min, '--price': 'calc(10 + var(--ops) * 10)' } as React.CSSProperties}
      {...rest}
    >
      <div
        aria-hidden
        className="text-green-1000 flex flex-wrap items-center text-2xl font-medium md:h-12 md:w-[calc(100%-260px)]"
      >
        <div className="relative min-w-[clamp(calc(60.95px+14.47px*round(down,log(max(var(--ops),1),10),1)),(2-var(--ops))*111px,111px)] max-w-[clamp(calc(60.95px+14.47px*round(down,log(max(var(--ops),1),10),1)),(2-var(--ops))*111px,111px)] shrink grow motion-safe:transition-all">
          <div className="flex w-full whitespace-pre rounded-[40px] bg-blue-300 px-3 py-1 tabular-nums leading-8 opacity-[calc(var(--ops)-1)] [transition-duration:calc(clamp(0,var(--ops)-1,1)*350ms)] before:tracking-[-0.12em] before:content-[''_counter(ops)_'_'] motion-safe:transition-all">
            M
          </div>
          <div className="absolute left-0 top-0 whitespace-pre leading-10 opacity-[calc(2-var(--ops))] [transition-duration:calc(clamp(0,2-var(--ops),1)*350ms)] motion-safe:transition">
            How many
          </div>
        </div>
        <div className="shrink-0 whitespace-pre"> operations </div>
        <div className="whitespace-pre [@media(width<900px)]:hidden">per month </div>
        <div className="whitespace-pre opacity-[calc(2-var(--ops))] [transition-duration:350ms] motion-safe:transition">
          do you need?
        </div>
        <div className="grow-[1.5] ease-in motion-safe:transition-all" />
      </div>
      <div className="text-green-1000 flex items-center gap-5 pt-12 text-sm">
        <span className="font-medium">{min}M</span>
        <Slider
          aria-label="How many operations per month do you need?"
          counter="after:content-['$'_counter(price)_'_/_month'] after:[counter-set:price_calc(var(--price))]"
          deadZone="16px"
          defaultValue={min}
          max={max}
          min={min}
          onChange={event => {
            const value = event.currentTarget.valueAsNumber;
            rootRef.current!.style.setProperty('--ops', `${value}`);
            onChange(value);
          }}
          step={1}
        />
        <span className="font-medium">{max}M</span>
      </div>

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
          <div
            className="border-beige-400 bg-beige-100 text-green-1000 absolute bottom-full left-1/2 z-50 mb-2 max-w-[328px] -translate-x-1/2 overflow-visible rounded-2xl border px-4 py-3 shadow-md sm:max-w-[420px]"
          >
            Every GraphQL request that is processed by your GraphQL API and reported to GraphQL Hive.
            If your server receives 1M GraphQL requests, all of them will be reported to Hive
            (assuming no sampling).
          </div>
        )}
      </div>
    </div>
  );
}
