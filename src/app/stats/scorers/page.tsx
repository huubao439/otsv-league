import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeading } from "@/components/league/page-heading";
import { TeamLogo } from "@/components/league/team-logo";
import { getTeamById } from "@/data/league";
import { topScorersFrom, withPositions } from "@/data/stats";
import { getMatches, getRoster } from "@/lib/server/league-data";

const columns = "grid-cols-[46px_minmax(0,1fr)_56px]";

export default async function ScorersPage() {
  const [roster, allMatches] = await Promise.all([getRoster(), getMatches()]);

  // Every player who has scored at least once, ranked exactly like the Golden
  // boot card on Stats: players level on goals share a position.
  const scorers = withPositions(topScorersFrom(allMatches, roster), (row) => row.goals);
  const totalGoals = scorers.reduce((total, row) => total + row.goals, 0);

  return (
    <div className="mx-auto flex w-full max-w-[840px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading
        eyebrow={
          scorers.length
            ? `Full table · ${scorers.length} scorers · ${totalGoals} goals`
            : "Full table · no goals recorded yet"
        }
        title="Golden"
        accent="boot"
        aside={
          <Link
            href="/stats"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface)] px-4 py-2.5 text-[12.5px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to stats
          </Link>
        }
      />

      <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-1.5">
          <h3 className="m-0 font-heading text-xl uppercase">Every scorer</h3>
          <span className="text-[12.5px] font-semibold leading-tight text-muted-foreground">
            Every player who has scored this season, most goals first.
          </span>
        </div>

        {scorers.length ? (
          <div className="-mx-1 overflow-x-auto px-1">
            <div className="min-w-[320px]">
              <div
                className={`grid ${columns} border-b border-border pb-2.5 pl-3 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]`}
              >
                <span>Pos</span>
                <span>Player</span>
                <span className="text-right">Goals</span>
              </div>

              {scorers.map((row) => {
                const team = getTeamById(row.player.teamId);

                return (
                  <div
                    key={row.player.id}
                    data-testid={`scorer-row-${row.player.id}`}
                    className={`relative grid ${columns} items-center border-b border-border py-3 pl-3 last:border-b-0 ${
                      row.position === 1 ? "bg-[image:var(--grad-soft)]" : ""
                    }`}
                  >
                    {row.position === 1 ? (
                      <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-[image:var(--grad)]" />
                    ) : null}
                    <span
                      className={`font-heading text-[17px] ${
                        row.position === 1 ? "" : "text-muted-foreground"
                      }`}
                    >
                      {row.position}
                    </span>
                    <span className="flex min-w-0 items-center gap-2.5">
                      {team ? <TeamLogo team={team} size="sm" /> : null}
                      <span className="min-w-0 flex-1 truncate text-[13px]">
                        <span className="font-extrabold">{row.player.name}</span>
                        {team ? (
                          <span className="font-normal text-muted-foreground"> ({team.name})</span>
                        ) : null}
                      </span>
                    </span>
                    <span className="text-right font-heading text-[17px] leading-none">
                      {row.goals}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="m-0 rounded-xl border border-dashed border-[var(--border-strong)] px-3.5 py-6 text-center text-[12.5px] font-semibold text-[var(--faint)]">
            No goals have been recorded yet. Scorers appear here as soon as results are entered.
          </p>
        )}

        <p className="m-0 text-[11.5px] font-semibold leading-[1.4] text-[var(--faint)]">
          Players level on goals share a position. Own goals count for the team but are credited to
          no player, so they never appear here.
        </p>
      </div>
    </div>
  );
}
