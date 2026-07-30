import { type ReactNode } from "react";

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-slate-900 sm:text-3xl dark:text-foreground">
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm text-slate-600 dark:text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="w-full sm:w-auto">{action}</div> : null}
    </div>
  );
}
