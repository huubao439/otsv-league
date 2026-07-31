import { PageHeading } from "@/components/league/page-heading";
import { TeamLogo } from "@/components/league/team-logo";
import { cleanSheetTableFrom, getTeamById } from "@/data/league";
import { getMatches, getRoster } from "@/lib/server/league-data";

const defenceColumns = "grid-cols-[36px_minmax(0,1fr)_44px_52px]";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const roster = await getRoster();
  const topScorers = [...roster]
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, 10)
    .filter((player) => player.goals > 0);
  // Ranked by fewest goals conceded — the meanest defence in the league wins.
  const defence = cleanSheetTableFrom(await getMatches());

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading
        eyebrow={
          topScorers.length
            ? `Golden boot race · top ${topScorers.length} scorers`
            : "Leaderboards unlock after Round 1"
        }
        title="Season"
        accent="stats"
      />

      <div className="grid items-start gap-4 lg:grid-cols-2">
        {/* Golden boot */}
        <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-col gap-1.5">
            <h3 className="m-0 font-heading text-xl uppercase">Golden boot</h3>
            <span className="text-[12.5px] font-semibold leading-tight text-muted-foreground">
              Most goals scored this season.
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {topScorers.length
              ? topScorers.map((player, index) => {
                  const team = getTeamById(player.teamId);

                  return (
                    <div
                      key={player.id}
                      className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 ${
                        index === 0
                          ? "border-[var(--border-strong)] bg-[image:var(--grad-soft)]"
                          : "border-border bg-[var(--surface-2)]"
                      }`}
                    >
                      <span className="w-4 shrink-0 font-mono text-[10.5px] text-[var(--faint)]">
                        {index + 1}
                      </span>
                      {team ? <TeamLogo team={team} size="sm" /> : null}
                      <span className="min-w-0 flex-1 truncate text-[13px]">
                        <span className="font-bold">{player.name}</span>
                        {team ? (
                          <span className="font-normal text-muted-foreground"> ({team.name})</span>
                        ) : null}
                      </span>
                      <span className="font-heading text-[18px] leading-none">{player.goals}</span>
                    </div>
                  );
                })
              : [1, 2, 3].map((slot) => (
                  <span
                    key={slot}
                    className="flex h-11 items-center rounded-xl border border-dashed border-[var(--border-strong)] px-3.5 font-mono text-[10.5px] font-medium text-[var(--faint)]"
                  >
                    {slot} · {slot === 1 ? "awaiting first goal" : ""}
                  </span>
                ))}
          </div>
        </div>

        {/* Best defence */}
        <div className="flex flex-col gap-4 overflow-hidden rounded-[20px] border border-border bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-col gap-1.5">
            <h3 className="m-0 font-heading text-xl uppercase">Best defence</h3>
            <span className="text-[12.5px] font-semibold leading-tight text-muted-foreground">
              Fewest goals conceded in the league.
            </span>
          </div>

          <div className="-mx-1 overflow-x-auto px-1">
            <div className="min-w-[320px]">
              <div
                className={`grid ${defenceColumns} border-b border-border pb-2.5 pl-3 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]`}
              >
                <span>Pos</span>
                <span>Team</span>
                <span className="text-center">P</span>
                <span className="text-right">GA</span>
              </div>

              {defence.map((row, index) => (
                <div
                  key={row.team.id}
                  className={`relative grid ${defenceColumns} items-center border-b border-border py-3 pl-3 last:border-b-0 ${
                    index === 0 ? "bg-[image:var(--grad-soft)]" : ""
                  }`}
                >
                  {index === 0 ? (
                    <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-[image:var(--grad)]" />
                  ) : null}
                  <span
                    className={`font-heading text-[17px] ${index === 0 ? "" : "text-muted-foreground"}`}
                  >
                    {index + 1}
                  </span>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <TeamLogo team={row.team} size="sm" />
                    <span className="truncate text-[13px] font-extrabold leading-tight">
                      {row.team.name}
                    </span>
                  </span>
                  <span className="text-center text-[13px] font-semibold leading-none text-muted-foreground">
                    {row.played}
                  </span>
                  <span className="text-right font-heading text-[17px] leading-none">
                    {row.goalsAgainst}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="m-0 text-[11.5px] font-semibold leading-[1.4] text-[var(--faint)]">
            GA = goals against. The team conceding fewest goals wins the title.
          </p>
        </div>
      </div>
    </div>
  );
}
