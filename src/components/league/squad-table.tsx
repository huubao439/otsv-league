"use client";

import { useTeamRoster } from "@/lib/roster-store";

/**
 * Reads the roster store rather than the static JSON so players added or edited
 * in the admin workspace show up here too.
 */
export function SquadTable({ teamId }: { teamId: number }) {
  const roster = useTeamRoster(teamId);

  return (
    <div className="flex flex-col gap-3.5 overflow-hidden rounded-[22px] border border-border bg-[var(--surface)] p-5.5 shadow-[var(--shadow-soft)]">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="m-0 font-heading text-[22px] uppercase">Squad</h2>
        <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
          {roster.length} players
        </span>
      </div>

      <div className="-mx-1.5 overflow-x-auto px-1.5">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
              <th className="w-9 py-2 font-medium">#</th>
              <th className="py-2 font-medium">Player</th>
              <th className="py-2 font-medium">Jersey</th>
              <th className="py-2 text-center font-medium">G</th>
              <th className="py-2 text-center font-medium">A</th>
              <th className="hidden py-2 text-center font-medium sm:table-cell">YC</th>
              <th className="hidden py-2 text-center font-medium sm:table-cell">RC</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((player) => (
              <tr key={player.id} className="border-b border-border/70 last:border-b-0">
                <td className="py-2.5 font-mono text-[11px] text-[var(--faint)]">
                  {player.shirtNumber}
                </td>
                <td className="max-w-40 truncate py-2.5 text-[13px] font-bold">
                  <span className="flex items-center gap-2">
                    <span className="truncate">{player.name}</span>
                    {player.isCaptain ? (
                      <span
                        title="Team captain"
                        aria-label="Team captain"
                        className="grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-[image:var(--grad)] font-heading text-[10px] leading-none text-white"
                      >
                        C
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className="py-2.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground">
                  {player.jerseyName}
                </td>
                <td className="py-2.5 text-center text-[13px] font-semibold text-muted-foreground">
                  {player.goals}
                </td>
                <td className="py-2.5 text-center text-[13px] font-semibold text-muted-foreground">
                  {player.assists}
                </td>
                <td className="hidden py-2.5 text-center text-[13px] font-semibold text-muted-foreground sm:table-cell">
                  {player.yellowCards}
                </td>
                <td className="hidden py-2.5 text-center text-[13px] font-semibold text-muted-foreground sm:table-cell">
                  {player.redCards}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
