import { CalendarDays, Clock, MapPin } from "lucide-react";
import { STADIUM, formatMatchDate } from "@/data/league";

/**
 * Highlighted date / time / pitch chips for a fixture. Server-safe (no client
 * hooks) so it drops into both the server pages and the client boards. The time
 * chip is filled with the brand gradient and the pitch chip is pin-marked, so
 * the "when & where" reads at a glance. `showDate`/`showStadium` are turned off
 * where a round header already states them, to avoid repeating on every row.
 */
export function MatchMeta({
  date,
  time,
  pitch,
  showDate = true,
  showStadium = true,
  className = "",
}: {
  date: string;
  time: string;
  pitch?: string;
  showDate?: boolean;
  showStadium?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {showDate ? (
        <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-[var(--surface-2)] px-2 py-1 text-[11px] font-bold leading-none text-foreground">
          <CalendarDays className="h-3 w-3 text-[var(--faint)]" />
          {formatMatchDate(date)}
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1 rounded-lg bg-[image:var(--grad)] px-2 py-1 text-[11px] font-extrabold leading-none text-white shadow-[0_6px_14px_-8px_oklch(0.6_0.24_350/0.9)]">
        <Clock className="h-3 w-3" />
        {time}
      </span>
      {pitch ? (
        <span className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-strong)] bg-[image:var(--grad-soft)] px-2 py-1 text-[11px] font-bold leading-none text-foreground">
          <MapPin className="h-3 w-3 text-[var(--pink)]" />
          Pitch {pitch}
          {showStadium ? (
            <span className="font-semibold text-[var(--faint)]"> · {STADIUM}</span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
