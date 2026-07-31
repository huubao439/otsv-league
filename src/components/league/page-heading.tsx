import { type ReactNode } from "react";

/**
 * Big page header from the design: a monospace eyebrow above an Anton display
 * title whose trailing word is filled with the brand gradient.
 */
export function PageHeading({
  eyebrow,
  title,
  accent,
  aside,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="flex flex-col gap-2.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--faint)]">
          {eyebrow}
        </span>
        <h1 className="m-0 font-heading text-4xl uppercase leading-[0.95] sm:text-5xl lg:text-[56px]">
          {title}
          {accent ? <> <span className="grad-text">{accent}</span></> : null}
        </h1>
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
