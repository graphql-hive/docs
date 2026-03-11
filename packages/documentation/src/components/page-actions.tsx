"use client";

import { cn } from "@hive/design-system";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { Check, Copy, Github } from "lucide-react";
import { useRef, useState } from "react";

const cache = new Map<string, string>();
const actionLinkClass =
  "inline-flex items-center gap-2 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-green-500/50 disabled:pointer-events-none disabled:opacity-50";

export function LLMCopyButton({ markdownUrl }: { markdownUrl: string }) {
  const [loading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl);
    if (cached) return navigator.clipboard.writeText(cached);

    setLoading(true);

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": fetch(markdownUrl).then(async (res) => {
            const content = await res.text();

            if (!res.ok) {
              // If we're rendering this page, we should definitely have Markdown for it.
              // eslint-disable-next-line no-console
              console.error(`Failed to fetch ${markdownUrl}`, res);
              throw new Error(
                `${markdownUrl} is unexpectedly missing, try again later`,
              );
            }

            cache.set(markdownUrl, content);
            return content;
          }),
        }),
      ]);
    } finally {
      setLoading(false);
    }
  });

  const hasToggled = useRef(false);
  if (checked) hasToggled.current = true;

  return (
    <button className={actionLinkClass} disabled={loading} onClick={onClick}>
      <span className="relative size-3.5 in-active:scale-90 transition-transform">
        <Check
          className="absolute inset-0 size-3.5 fill-mode-forwards"
          style={
            hasToggled.current
              ? {
                  animation: checked
                    ? "icon-blur-in 250ms forwards"
                    : "icon-blur-out 250ms forwards",
                }
              : { opacity: 0 }
          }
        />
        <Copy
          className="absolute inset-0 size-3.5 fill-mode-forwards"
          style={
            hasToggled.current
              ? {
                  animation: checked
                    ? "icon-blur-out 250ms forwards"
                    : "icon-blur-in 250ms forwards",
                }
              : { opacity: 1 }
          }
        />
      </span>
      Copy Markdown
    </button>
  );
}

export function PageActions({
  githubUrl,
  markdownUrl,
}: {
  githubUrl: string;
  markdownUrl: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <LLMCopyButton markdownUrl={markdownUrl} />
      <a
        className={actionLinkClass}
        href={githubUrl}
        rel="noreferrer noopener"
        target="_blank"
      >
        <Github className="size-3.5" />
        View on GitHub
      </a>
    </div>
  );
}

export function EditOnGitHub({ githubUrl }: { githubUrl: string }) {
  return (
    <a
      className={cn(actionLinkClass, "no-underline")}
      href={githubUrl.replace("/blob/", "/edit/")}
      rel="noreferrer noopener"
      target="_blank"
    >
      <Github className="size-3.5" />
      Edit on GitHub
    </a>
  );
}
