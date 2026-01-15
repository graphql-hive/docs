"use client";

import { useState } from "react";
import { Check, Copy, Github } from "lucide-react";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";

const cache = new Map<string, string>();
const actionClass =
  "inline-flex items-center gap-2 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50";

export function LLMCopyButton({ markdownUrl }: { markdownUrl: string }) {
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl);
    if (cached) return navigator.clipboard.writeText(cached);

    setLoading(true);

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": fetch(markdownUrl).then(async (res) => {
            const content = await res.text();
            cache.set(markdownUrl, content);

            return content;
          }),
        }),
      ]);
    } finally {
      setLoading(false);
    }
  });

  return (
    <button disabled={isLoading} className={actionClass} onClick={onClick}>
      {checked ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      Copy Markdown
    </button>
  );
}

export function PageActions({
  markdownUrl,
  githubUrl,
}: {
  markdownUrl: string;
  githubUrl: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <LLMCopyButton markdownUrl={markdownUrl} />
      <a
        href={githubUrl}
        rel="noreferrer noopener"
        target="_blank"
        className={actionClass}
      >
        <Github className="size-3.5" />
        View on GitHub
      </a>
    </div>
  );
}
