import { cn } from '@hive/design-system/cn';
import css from './ecosystem-management.module.css';

export interface DashedLineProps extends React.SVGProps<SVGSVGElement> {
  short?: boolean;
}

export function DashedLine({ className, short, ...rest }: DashedLineProps) {
  const commonProps: React.SVGProps<SVGSVGElement> = {
    fill: 'none',
    preserveAspectRatio: 'none',
    stroke: 'currentColor',
    vectorEffect: 'non-scaling-stroke',
    ...rest,
  };

  if (short) {
    return (
      <svg
        {...commonProps}
        className={cn('h-full overflow-visible', css['animate-dash-reverse'], className)}
        viewBox="0 0 111 114"
        width="111"
      >
        <path
          d="M0 112.5H31.3352C44.59 112.5 55.3351 101.755 55.3352 88.5001L55.3355 25.4999C55.3356 12.2451 66.0807 1.50001 79.3355 1.5L111 1.5"
          strokeDasharray="3 6"
          strokeWidth="3"
        />
      </svg>
    );
  }

  return (
    <svg
      {...commonProps}
      className={cn('h-full overflow-visible', css['animate-dash'], className)}
      viewBox="0 0 107 326"
      width="107"
    >
      <path
        d="M 150 0 H 77.659 c -13.255 0 -24 10.745 -24 24 V 303.5 c 0 13.255 -10.746 24 -24 24 H 0"
        strokeDasharray="3 6"
        strokeWidth={3}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
