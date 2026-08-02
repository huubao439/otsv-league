import Link from "next/link";
import { FormGuide } from "@/components/league/form-guide";
import { PageHeading } from "@/components/league/page-heading";
import { TeamLogo } from "@/components/league/team-logo";
import {
  ROUNDS,
  seasonProgressFrom,
  standingsWithTeamsFrom,
  teamFormFrom,
} from "@/data/league";
import { getMatches } from "@/lib/server/league-data";

// Pos | Team | Pts | P | W | D | L | GF | GA | GD | Form — points sit first so
// they read as the headline number rather than a trailing total.
const columns =
  "grid-cols-[48px_minmax(0,1fr)_60px_42px_42px_42px_42px_46px_46px_52px_96px] min-w-[770px]";

export default async function StandingsPage() {
  const allMatches = await getMatches();
  const rows = standingsWithTeamsFrom(allMatches);
  const progress = seasonProgressFrom(allMatches);
  const roundsPlayed = Math.floor(progress.played / (progress.total / ROUNDS.length));

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading
        eyebrow={`Season 2026 · after ${roundsPlayed} of ${ROUNDS.length} rounds`}
        title="League"
        accent="standings"
        aside={
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[image:var(--grad)] px-4 py-2.5 text-[12.5px] font-bold leading-none text-white">
              Overall
            </span>
            <span className="rounded-full border border-border px-4 py-2.5 text-[12.5px] font-semibold leading-none text-[var(--faint)]">
              {progress.played} played
            </span>
            <span className="rounded-full border border-border px-4 py-2.5 text-[12.5px] font-semibold leading-none text-[var(--faint)]">
              {progress.total - progress.played} to play
            </span>
          </div>
        }
      />

      <div className="grid items-start gap-5 xl:grid-cols-[1.55fr_0.75fr]">
        {/* Desktop table — hidden on mobile, where the row-cards below take over. */}
        <div className="hidden overflow-hidden overflow-x-auto rounded-[22px] border border-border bg-[var(--surface)] shadow-[var(--shadow-soft)] md:block">
          <div
            className={`grid ${columns} border-b border-border bg-[var(--surface-2)] px-6 py-3.5 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.12em] text-[var(--faint)]`}
          >
            <span>Pos</span>
            <span>Team</span>
            <span className="text-center">Pts</span>
            <span className="text-center">P</span>
            <span className="text-center">W</span>
            <span className="text-center">D</span>
            <span className="text-center">L</span>
            <span className="text-center">GF</span>
            <span className="text-center">GA</span>
            <span className="text-center">GD</span>
            <span className="text-center">Form</span>
          </div>

          {rows.map((row, index) => {
            const leader = index === 0;

            return (
              <div
                key={row.teamId}
                className={`relative grid ${columns} items-center border-b border-border px-6 py-4 transition-colors last:border-b-0 hover:bg-[var(--surface-2)] ${
                  leader ? "bg-[image:var(--grad-gold-soft)]" : ""
                }`}
              >
                {leader ? (
                  <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-[image:var(--grad-gold)]" />
                ) : null}
                <span className={`font-heading text-[19px] ${leader ? "text-[var(--gold)]" : "text-muted-foreground"}`}>
                  {index + 1}
                </span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <TeamLogo team={row.team} size="row" shape="bare" />
                  <Link
                    href={`/teams/${row.teamId}`}
                    className="truncate text-[14.5px] font-extrabold leading-tight text-foreground hover:text-[var(--pink)]"
                  >
                    {row.team.name}
                  </Link>
                </span>
                <span className="grad-text text-center font-heading text-[23px] leading-none">
                  {row.points}
                </span>
                <span className="text-center text-[13.5px] font-semibold leading-none text-muted-foreground">
                  {row.played}
                </span>
                <span className="text-center text-[13.5px] font-semibold leading-none text-muted-foreground">
                  {row.won}
                </span>
                <span className="text-center text-[13.5px] font-semibold leading-none text-muted-foreground">
                  {row.drawn}
                </span>
                <span className="text-center text-[13.5px] font-semibold leading-none text-muted-foreground">
                  {row.lost}
                </span>
                <span className="text-center text-[13.5px] font-semibold leading-none text-muted-foreground">
                  {row.goalsFor}
                </span>
                <span className="text-center text-[13.5px] font-semibold leading-none text-muted-foreground">
                  {row.goalsAgainst}
                </span>
                <span className="text-center text-[13.5px] font-semibold leading-none text-muted-foreground">
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </span>
                <FormGuide form={teamFormFrom(allMatches, row.teamId)} />
              </div>
            );
          })}

          <div className="flex flex-wrap items-center gap-4.5 bg-[var(--surface-2)] px-6 py-3.5 text-[11.5px] font-semibold leading-none text-[var(--faint)]">
            <span className="flex items-center gap-1.5">
              <span className="h-[3px] w-3 rounded-sm bg-[image:var(--grad-gold)]" />
              Championship place
            </span>
            <span className="ml-auto font-mono tracking-[0.1em]">
              Sorted by points, then goal difference
            </span>
          </div>
        </div>

        {/* Mobile reflow — the wide table becomes row-cards so nothing scrolls sideways. */}
        <div className="flex flex-col gap-2 md:hidden">
          {rows.map((row, index) => {
            const leader = index === 0;
            const gd =
              row.goalDifference > 0 ? `+${row.goalDifference}` : String(row.goalDifference);

            return (
              <div
                key={row.teamId}
                className={`relative flex items-center gap-3 overflow-hidden rounded-[18px] border border-border p-3 ${
                  leader ? "bg-[image:var(--grad-gold-soft)]" : "bg-[var(--surface)]"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute bottom-0 left-0 top-0 w-[3px] ${
                    leader ? "bg-[image:var(--grad-gold)]" : ""
                  }`}
                  style={leader ? undefined : { background: row.team.gradient }}
                />
                <span
                  className={`w-4 shrink-0 pl-0.5 font-heading text-[19px] leading-none ${
                    leader ? "text-[var(--gold)]" : "text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </span>
                <TeamLogo team={row.team} size="row" shape="squircle" />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link
                    href={`/teams/${row.teamId}`}
                    className="truncate text-[14px] font-extrabold leading-tight text-foreground"
                  >
                    {row.team.name}
                  </Link>
                  <span className="truncate font-mono text-[9.5px] leading-none tracking-[0.06em] text-[var(--faint)]">
                    P {row.played} · W {row.won} · D {row.drawn} · L {row.lost} · GD {gd}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="grad-text font-heading text-[24px] leading-none">
                    {row.points}
                  </span>
                  <span className="font-mono text-[8px] uppercase leading-none tracking-[0.14em] text-[var(--faint)]">
                    Pts
                  </span>
                </span>
              </div>
            );
          })}
          <div className="flex items-center gap-2 rounded-[16px] border border-dashed border-[var(--border-strong)] p-3 text-[10.5px] font-semibold leading-[1.3] text-[var(--faint)]">
            <span className="h-[3px] w-3 shrink-0 rounded-sm bg-[image:var(--grad-gold)]" />
            Championship place · sorted by points, then goal difference
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3.5 rounded-[20px] border border-border bg-[var(--surface)] p-5.5">
            <h3 className="m-0 font-heading text-[19px] uppercase">Points</h3>
            <div className="flex flex-col gap-2.5">
              {[
                ["Win", "3"],
                ["Draw", "1"],
                ["Loss", "0"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-[13px] font-semibold leading-none text-muted-foreground"
                >
                  <span>{label}</span>
                  <span className="font-heading text-[18px] text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-[20px] border border-border bg-[image:var(--grad-soft)] p-5.5">
            <h3 className="m-0 font-heading text-[19px] uppercase">Tiebreakers</h3>
            <ol className="m-0 flex list-decimal flex-col gap-1.5 pl-4.5 text-[12.5px] font-semibold leading-[1.4] text-muted-foreground">
              <li>Goal difference</li>
              <li>Goals scored</li>
              <li>Head-to-head result</li>
              <li>Penalty shootout</li>
            </ol>
          </div>

          <Link
            href="/fixtures"
            className="rounded-2xl border border-border bg-[var(--surface)] p-3.5 text-center text-[13px] font-bold leading-none text-foreground transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
          >
            View full fixture list →
          </Link>
        </div>
      </div>
    </div>
  );
}
