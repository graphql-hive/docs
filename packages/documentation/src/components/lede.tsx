import { cn } from "@hive/design-system/cn";

export interface LedeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Lede(props: LedeProps) {
  return (
    <div
      {...props}
      className={cn("sm:*:text-xl/8 md:*:text-2xl/8", props.className)}
    />
  );
}
