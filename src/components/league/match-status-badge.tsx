import { type MatchStatus } from "@/lib/types";

const statusConfig: Record<MatchStatus, { label: string; className: string }> = {
  finished: {
    label: "Finished",
    className: "border-border bg-[var(--surface-2)] text-muted-foreground",
  },
  live: {
    label: "Live",
    className: "border-transparent bg-[image:var(--grad)] text-white",
  },
  upcoming: {
    label: "Upcoming",
    className: "border-[var(--border-strong)] bg-[image:var(--grad-soft)] text-[var(--pink-soft)]",
  },
};

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-[5px] border px-2 py-1 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.14em] ${config.className}`}
    >
      {config.label}
    </span>
  );
}
