"use client";

import { ReactNode, useState } from "react";

/**
 * TODO: Migrate to Base UI Tooltip
 */
export function Tooltip({
  children,
  content,
}: {
  children: ReactNode;
  content: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      className="relative inline-block"
      onBlur={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="hive-focus -mx-1 -my-0.5 rounded px-1 py-0.5 text-left cursor-help">
        {children}
      </span>
      {isOpen && (
        <span
          className="bg-green-1000 absolute left-0 top-full z-20 mt-1 rounded px-2 py-[3px] text-sm font-normal text-white shadow whitespace-nowrap"
          role="tooltip"
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
    <svg fill="currentColor" height="5" viewBox="0 0 8 4" width="10" {...props}>
      <path d="M5.06066 2.93934C4.47487 3.52513 3.52513 3.52513 2.93934 2.93934L-6.03983e-07 -6.99382e-07L8 0L5.06066 2.93934Z" />
    </svg>
  );
}
