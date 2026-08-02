import { PageHeading } from "@/components/league/page-heading";
import { TeamLogo } from "@/components/league/team-logo";
import { cleanSheetTableFrom, getTeamById } from "@/data/league";
import {
  RED_CARD_FINE,
  YELLOW_CARD_FINE,
  fairPlayTableFrom,
  topScorersFrom,
} from "@/data/stats";
import { getMatches, getRoster } from "@/lib/server/league-data";
import { formatFine, formatVnd } from "@/lib/vnd";

const defenceColumns = "grid-cols-[36px_minmax(0,1fr)_44px_52px]";

export default async function StatsPage() {
  const [roster, allMatches] = await Promise.all([getRoster(), getMatches()]);

  // Every table below is derived from the match results an admin records, so
  // the Stats tab always agrees with Fixtures and Standings.
  const topScorers = topScorersFrom(allMatches, roster, 10);
  const defence = cleanSheetTableFrom(allMatches);
  const fairPlay = fairPlayTableFrom(allMatches, roster);
  const totalFines = fairPlay.reduce((total, row) => total + row.fine, 0);

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
              ? topScorers.map((row, index) => {
                  const team = getTeamById(row.player.teamId);

                  return (
                    <div
                      key={row.player.id}
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
                        <span className="font-bold">{row.player.name}</span>
                        {team ? (
                          <span className="font-normal text-muted-foreground"> ({team.name})</span>
                        ) : null}
                      </span>
                      <span className="font-heading text-[18px] leading-none">{row.goals}</span>
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

      {/* Fair play — card chips per team, fines charged to the team pot. */}
      <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between gap-3">
          <h3 className="m-0 font-heading text-xl uppercase">Fair play</h3>
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
            Total {formatFine(totalFines)} ₫
          </span>
        </div>

        <div className="flex flex-col">
          {fairPlay.map((row) => (
            <div
              key={row.team.id}
              data-testid={`fairplay-row-${row.team.id}`}
              className="flex items-center gap-3 border-b border-border py-3 last:border-b-0"
            >
              <TeamLogo team={row.team} size="sm" />
              <span className="min-w-0 flex-1 truncate text-[13px] font-extrabold leading-tight">
                {row.team.name}
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="h-[17px] w-[13px] rounded-[3px] bg-[var(--gold)]"
                  title="Yellow cards"
                />
                <span className="w-3 text-[13px] font-semibold leading-none text-muted-foreground">
                  {row.yellowCards}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="h-[17px] w-[13px] rounded-[3px] bg-[var(--pink)]"
                  title="Red cards"
                />
                <span className="w-3 text-[13px] font-semibold leading-none text-muted-foreground">
                  {row.redCards}
                </span>
              </span>
              <span
                className={`w-20 text-right font-heading text-[17px] leading-none ${
                  row.fine > 0 ? "text-[var(--pink)]" : "text-muted-foreground"
                }`}
              >
                {formatFine(row.fine)}
              </span>
            </div>
          ))}
        </div>

        <p className="m-0 text-[11.5px] font-semibold leading-[1.4] text-[var(--faint)]">
          Yellow {formatVnd(YELLOW_CARD_FINE)} · Red {formatVnd(RED_CARD_FINE)} VND — charged to the
          team pot.
        </p>
      </div>
    </div>
  );
}
