import { Anchor } from "@hive/design-system/anchor";
import { cn } from "@hive/design-system/cn";

import { prettyPrintTag } from "./pretty-print-tag";

export interface BlogTagChipProps {
  colorScheme: "default" | "featured";
  inert?: boolean;
  tag: string;
}

export function BlogTagChip({ colorScheme, inert, tag }: BlogTagChipProps) {
  const className = cn(
    "rounded-full px-3 py-1 text-sm text-white",
    colorScheme === "featured"
      ? "bg-green-800 dark:bg-primary/90 dark:text-neutral-900"
      : "bg-beige-800 dark:bg-beige-800/40",
    !inert &&
      (colorScheme === "featured"
        ? "hover:bg-green-900 dark:hover:bg-primary"
        : "hover:bg-beige-900 dark:hover:bg-beige-900/40"),
  );

  if (inert) {
    return <span className={className}>{prettyPrintTag(tag)}</span>;
  }

  return (
    <Anchor className={className} href={`/blog/tag/${tag}`}>
      {prettyPrintTag(tag)}
    </Anchor>
  );
}
