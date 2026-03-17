import { Info, Lightbulb, Tag } from "lucide-react";

interface LabelCardProps {
  meaning: string;
  name: string;
  notes?: string;
  typicalValues: string[];
}

export function LabelCard({
  meaning,
  name,
  notes,
  typicalValues,
}: LabelCardProps) {
  return (
    <div>
      <div className="mb-3 flex items-start gap-3">
        <div className="shrink-0 rounded-md border border-gray-200 bg-gray-100 p-1.5 dark:border-neutral-700 dark:bg-neutral-800">
          <Tag className="size-4 text-gray-600 dark:text-slate-100" />
        </div>
        <div className="min-w-0 flex-1">
          <code className="break-all text-sm font-semibold text-gray-900 dark:text-slate-100">
            {name}
          </code>
          <p className="mt-1 text-sm/relaxed text-gray-600 dark:text-slate-100">
            {meaning}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Info className="size-3.5 text-gray-500 dark:text-slate-400" />
            <span className="text-xs font-semibold uppercase text-gray-700 dark:text-slate-100">
              Typical Values
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {typicalValues.map((value) => (
              <code
                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
                key={value}
              >
                {value}
              </code>
            ))}
          </div>
        </div>

        {notes && (
          <div className="pt-1">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm/relaxed text-gray-600 dark:text-slate-100">
                {notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
