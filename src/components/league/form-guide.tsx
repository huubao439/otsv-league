import { type FormResult } from "@/data/league";

const resultStyles: Record<FormResult, string> = {
  W: "bg-[image:var(--grad)] text-white",
  D: "border border-[var(--border-strong)] bg-[var(--surface-2)] text-muted-foreground",
  L: "border border-[var(--border-strong)] text-[var(--faint)]",
};

/**
 * Five-slot form guide. Played matches render as filled chips; the remaining
 * slots stay as dashed "not played yet" placeholders, per the design.
 */
export function FormGuide({ form, slots = 5 }: { form: FormResult[]; slots?: number }) {
  const placeholders = Math.max(0, slots - form.length);

  return (
    <span className="flex justify-center gap-1">
      {form.map((result, index) => (
        <span
          key={`${result}-${index}`}
          title={result}
          className={`grid h-[13px] w-[13px] place-items-center rounded-[4px] font-mono text-[8px] font-medium leading-none ${resultStyles[result]}`}
        >
          {result}
        </span>
      ))}
      {Array.from({ length: placeholders }, (_, index) => (
        <span
          key={`empty-${index}`}
          className="h-[13px] w-[13px] rounded-[4px] border border-dashed border-[var(--border-strong)]"
        />
      ))}
    </span>
  );
}
