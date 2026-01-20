'use client';

import { ReactNode, useState } from 'react';

// Native Tooltip component to replace @radix-ui/react-tooltip
// TODO: Migrate to Base UI Tooltip when available

export function Tooltip({ content, children }: { content: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <span className="hive-focus -mx-1 -my-0.5 rounded px-1 py-0.5 text-left cursor-help">
        {children}
      </span>
      {isOpen && (
        <span
          role="tooltip"
          className="bg-green-1000 absolute left-0 top-full z-20 mt-1 rounded px-2 py-[3px] text-sm font-normal text-white shadow whitespace-nowrap"
        >
          {content}
          <TooltipArrow className="text-green-1000 absolute -top-1 left-4 rotate-180" />
        </span>
      )}
    </span>
  );
}

function TooltipArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="5" viewBox="0 0 8 4" fill="currentColor" {...props}>
      <path d="M5.06066 2.93934C4.47487 3.52513 3.52513 3.52513 2.93934 2.93934L-6.03983e-07 -6.99382e-07L8 0L5.06066 2.93934Z" />
    </svg>
  );
}
