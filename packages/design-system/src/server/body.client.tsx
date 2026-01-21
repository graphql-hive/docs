'use client';

import { usePathname } from 'next/navigation';
import { DetailedHTMLProps, FC, HtmlHTMLAttributes } from 'react';

import { cn } from '../cn';

export interface BodyProps
  extends DetailedHTMLProps<HtmlHTMLAttributes<HTMLBodyElement>, HTMLBodyElement> {
  lightOnlyPages?: string[];
}

export const Body: FC<BodyProps> = ({ children, className, lightOnlyPages, ...rest }) => {
  const pathname = usePathname();
  const isLightOnlyPage = lightOnlyPages?.includes(pathname);

  return (
    <body className={cn(className, isLightOnlyPage && 'light text-green-1000')} {...rest}>
      {children}
    </body>
  );
};
