import { type ReactNode } from "react";

/** Card / section header: Anton title with a supporting line beneath it. */
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="flex flex-col gap-1.5">
        <h2 className="m-0 font-heading text-[23px] uppercase leading-none tracking-[0.01em] sm:text-[27px]">
          {title}
        </h2>
        {description ? (
          <span className="text-[12.5px] font-semibold leading-tight text-muted-foreground">
            {description}
          </span>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
