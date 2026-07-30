import { Badge } from "@/components/ui/badge";
import { type MatchStatus } from "@/lib/types";

const statusConfig: Record<MatchStatus, { label: string; className: string }> = {
  finished: {
    label: "Finished",
    className: "bg-zinc-500/15 text-zinc-700 border-zinc-500/35 dark:bg-zinc-500/20 dark:text-zinc-100 dark:border-zinc-400/40",
  },
  live: {
    label: "Live",
    className: "bg-red-500/14 text-red-700 border-red-500/35 dark:bg-red-500/20 dark:text-red-200 dark:border-red-400/50",
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-cyan-500/14 text-cyan-700 border-cyan-500/35 dark:bg-cyan-500/20 dark:text-cyan-200 dark:border-cyan-400/50",
  },
};

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
