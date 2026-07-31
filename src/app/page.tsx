import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/league/countdown";
import { FormGuide } from "@/components/league/form-guide";
import { MatchStatusBadge } from "@/components/league/match-status-badge";
import { SectionHeading } from "@/components/league/section-heading";
import { TeamLogo } from "@/components/league/team-logo";
import {
  ROUNDS,
  formatKickoff,
  latestResultsFrom,
  nextKickoffIsoFrom,
  nextRoundFixturesFrom,
  seasonProgressFrom,
  standingsWithTeamsFrom,
  teamFormFrom,
} from "@/data/league";
import { getMatches } from "@/lib/server/league-data";

const tableColumns =
  "grid-cols-[44px_minmax(0,1fr)_40px_40px_40px_40px_52px_92px_52px] min-w-[660px]";

export default async function Home() {
  const allMatches = await getMatches();
  const table = standingsWithTeamsFrom(allMatches);
  const latestResults = latestResultsFrom(allMatches, 3);
  const upcomingFixtures = nextRoundFixturesFrom(allMatches);
  const nextRound = upcomingFixtures.at(0)?.round;
  const opener = upcomingFixtures.at(0);
  const kickoffIso = nextKickoffIsoFrom(allMatches);
  const progress = seasonProgressFrom(allMatches);
  const progressPct = Math.max(3, Math.round((progress.played / progress.total) * 100));

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[26px] border border-border shadow-[var(--shadow-soft)]">
        <div className="absolute inset-0 bg-[image:var(--grad)] opacity-[0.92]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_120%_at_88%_12%,oklch(1_0_0/0.22),transparent_60%)]" />
        <Image
          src="/otsv-logo.png"
          alt=""
          aria-hidden
          width={460}
          height={460}
          priority
          className="pointer-events-none absolute -bottom-35 -right-22 w-115 max-w-none opacity-[0.14] mix-blend-screen"
        />

        <div className="relative grid items-center gap-8 p-7 sm:p-11 lg:grid-cols-[1.35fr_0.9fr] lg:gap-10">
          <div className="flex flex-col gap-4 text-white">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
              <span className="rounded-md border border-white/25 bg-white/15 px-2.5 py-1.5">Season 2026</span>
              <span>One Tech Stop Vietnam</span>
            </div>
            <h1 className="m-0 font-heading text-4xl uppercase leading-[0.92] tracking-[-0.01em] [text-shadow:0_8px_30px_oklch(0.2_0.08_335/0.45)] sm:text-6xl lg:text-[76px]">
              OTSV Football
              <br />
              League 2026
            </h1>
            <p className="m-0 max-w-[44ch] text-[15px] font-medium leading-[1.55] text-white/90 sm:text-[17px]">
              Live standings, fixtures and player stats for the OTSV corporate football
              championship — updated the moment the whistle blows.
            </p>
            <div className="mt-1.5 flex flex-wrap gap-3">
              <Link
                href="/standings"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-5.5 py-3.5 text-[14.5px] font-extrabold leading-none text-[var(--plum)] shadow-[0_14px_30px_-14px_oklch(0.15_0.05_335/0.7)] transition-transform hover:-translate-y-px"
              >
                League table <span className="text-[15px]">→</span>
              </Link>
              <Link
                href="/fixtures"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/45 px-5.5 py-3.5 text-[14.5px] font-bold leading-none text-white transition-colors hover:bg-white/15"
              >
                Fixtures &amp; results
              </Link>
            </div>
          </div>

          {/* Opening match card */}
          <div className="flex flex-col gap-4.5 rounded-[20px] border border-white/20 bg-[oklch(0.14_0.03_335/0.42)] p-5.5 text-white backdrop-blur-[14px]">
            <div className="flex items-center justify-between font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/70">
              <span>{opener ? "Opening match" : "Season complete"}</span>
              <span>Round {nextRound ?? "—"}</span>
            </div>

            {opener ? (
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <TeamLogo team={opener.homeTeam} size="lg" />
                  <span className="text-center text-[13px] font-extrabold leading-tight">
                    {opener.homeTeam.name}
                  </span>
                </div>
                <span className="font-heading text-[15px] tracking-[0.08em] text-white/70">VS</span>
                <div className="flex flex-col items-center gap-2">
                  <TeamLogo team={opener.awayTeam} size="lg" />
                  <span className="text-center text-[13px] font-extrabold leading-tight">
                    {opener.awayTeam.name}
                  </span>
                </div>
              </div>
            ) : (
              <p className="m-0 text-sm font-semibold text-white/80">
                Every match has been played.
              </p>
            )}

            {kickoffIso ? (
              <div className="flex items-center justify-center gap-2 rounded-[14px] border border-white/15 bg-white/10 p-3">
                <span className="font-heading text-[26px] tracking-[0.04em]">
                  <Countdown kickoffIso={kickoffIso} />
                </span>
                <span className="font-mono text-[10px] font-medium uppercase leading-[1.3] tracking-[0.12em] text-white/70">
                  until
                  <br />
                  kickoff
                </span>
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11.5px] font-semibold leading-none text-white/80">
                <span>Season progress</span>
                <span>
                  {progress.played} / {progress.total} matches
                </span>
              </div>
              <div className="h-[7px] overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#fff,oklch(0.9_0.14_88))]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/60">
                {ROUNDS.map((round) => (
                  <span key={round}>R{round}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stat tiles */}
      <section className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {[
          { label: "Teams", value: "06", note: "Departments entered" },
          { label: "Rounds", value: `0${ROUNDS.length}`, note: "Single round-robin" },
          { label: "Matches", value: String(progress.total), note: "3 per round, single leg" },
          { label: "Played", value: String(progress.played).padStart(2, "0"), note: "Results confirmed" },
        ].map((tile) => (
          <div
            key={tile.label}
            className="flex flex-col gap-1.5 rounded-[18px] border border-border bg-[var(--surface)] px-5.5 py-5 transition-colors hover:border-[var(--border-strong)]"
          >
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--faint)]">
              {tile.label}
            </span>
            <span className="font-heading text-[34px] leading-none">{tile.value}</span>
            <span className="text-[12.5px] font-semibold leading-[1.3] text-muted-foreground">
              {tile.note}
            </span>
          </div>
        ))}
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-[1.25fr_0.95fr]">
        {/* League table */}
        <div className="overflow-hidden overflow-x-auto rounded-[22px] border border-border bg-[var(--surface)] shadow-[var(--shadow-soft)]">
          <div className="border-b border-border px-6 pb-4.5 pt-6">
            <SectionHeading
              title="League table"
              description="All six teams · updated after every match"
              action={
                <Link
                  href="/standings"
                  className="inline-flex rounded-full border border-border px-3.5 py-2.5 text-[12.5px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
                >
                  Full table →
                </Link>
              }
            />
          </div>

          <div
            className={`grid ${tableColumns} bg-[var(--surface-2)] px-6 py-3 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.12em] text-[var(--faint)]`}
          >
            <span>Pos</span>
            <span>Team</span>
            <span className="text-center">P</span>
            <span className="text-center">W</span>
            <span className="text-center">D</span>
            <span className="text-center">L</span>
            <span className="text-center">GD</span>
            <span className="text-center">Form</span>
            <span className="text-right">Pts</span>
          </div>

          <div className="flex flex-col">
            {table.map((row, index) => {
              const leader = index === 0;

              return (
                <div
                  key={row.teamId}
                  className={`relative grid ${tableColumns} items-center border-b border-border px-6 py-3.5 transition-colors last:border-b-0 hover:bg-[var(--surface-2)] ${
                    leader ? "bg-[image:var(--grad-soft)]" : ""
                  }`}
                >
                  {leader ? (
                    <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-[image:var(--grad)]" />
                  ) : null}
                  <span
                    className={`font-heading text-[19px] ${leader ? "" : "text-muted-foreground"}`}
                  >
                    {index + 1}
                  </span>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <TeamLogo team={row.team} />
                    <Link
                      href={`/teams/${row.teamId}`}
                      className="truncate text-[14.5px] font-extrabold leading-tight text-foreground hover:text-[var(--pink)]"
                    >
                      {row.team.name}
                    </Link>
                    {leader ? (
                      <span className="hidden rounded-[5px] bg-[image:var(--grad)] px-1.5 py-1 font-mono text-[9.5px] font-bold leading-none tracking-[0.08em] text-white sm:inline">
                        LEADER
                      </span>
                    ) : null}
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
                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                  </span>
                  <FormGuide form={teamFormFrom(allMatches, row.teamId)} />
                  <span className="text-right font-heading text-[20px]">{row.points}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4.5 border-t border-border bg-[var(--surface-2)] px-6 py-3.5 text-[11.5px] font-semibold leading-none text-[var(--faint)]">
            <span className="flex items-center gap-1.5">
              <span className="h-[3px] w-3 rounded-sm bg-[image:var(--grad)]" />
              Championship place
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-[11px] w-[11px] rounded-[4px] border border-dashed border-[var(--border-strong)]" />
              Match not played
            </span>
          </div>
        </div>

        {/* Latest results */}
        <div className="flex flex-col gap-4 rounded-[22px] border border-border bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
          <SectionHeading
            title="Latest results"
            description={
              latestResults.length
                ? "Most recent completed matches."
                : "Nothing played yet — here's what unlocks first."
            }
          />

          {latestResults.length ? (
            <div className="flex flex-col gap-3">
              {latestResults.map((match) => (
                <div key={match.id} className="rounded-2xl border border-border bg-[var(--surface-2)] p-3.5">
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <MatchStatusBadge status={match.status} />
                    <span className="font-mono text-[10.5px] tracking-[0.1em] text-[var(--faint)]">
                      {formatKickoff(match.date, match.time)}
                    </span>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2.5">
                    <span className="flex min-w-0 items-center justify-end gap-2">
                      <span className="truncate text-right text-sm font-extrabold">
                        {match.homeTeam.name}
                      </span>
                      <TeamLogo team={match.homeTeam} size="sm" />
                    </span>
                    <span className="rounded-lg border border-border px-2.5 py-1.5 font-heading text-lg leading-none">
                      {match.homeScore} - {match.awayScore}
                    </span>
                    <span className="flex min-w-0 items-center gap-2">
                      <TeamLogo team={match.awayTeam} size="sm" />
                      <span className="truncate text-sm font-extrabold">{match.awayTeam.name}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-start gap-3.5 rounded-2xl border border-dashed border-[var(--border-strong)] bg-[image:var(--grad-soft)] p-5.5">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--faint)]">
                Empty until the first kickoff
              </span>
              <div className="flex w-full flex-col gap-2.5">
                {[
                  "Round 1 scores & scorers",
                  "Team form & goal difference",
                  "Golden boot race",
                ].map((item, index) => (
                  <span
                    key={item}
                    className="flex items-center gap-2.5 text-[13px] font-semibold leading-[1.3] text-muted-foreground"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-md bg-[image:var(--grad)] font-mono text-[10px] font-bold leading-none text-white">
                      {index + 1}
                    </span>
                    {item}
                  </span>
                ))}
              </div>
              <Link
                href="/fixtures"
                className="mt-auto inline-flex rounded-full bg-[image:var(--grad)] px-4 py-2.5 text-[12.5px] font-extrabold leading-none text-white shadow-[0_12px_24px_-14px_oklch(0.6_0.24_350/0.9)] transition-transform hover:-translate-y-px"
              >
                See Round {nextRound ?? 1} fixtures →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming fixtures */}
      <section className="overflow-hidden overflow-x-auto rounded-[22px] border border-border bg-[var(--surface)] shadow-[var(--shadow-soft)] animate-fade-up-more">
        <div className="border-b border-border px-6 pb-4.5 pt-6">
          <SectionHeading
            title="Upcoming fixtures"
            description={
              nextRound
                ? `Round ${nextRound} · all matches in the next round`
                : "No upcoming fixtures scheduled."
            }
            action={
              <Link
                href="/fixtures"
                className="inline-flex rounded-full border border-border px-3.5 py-2.5 text-[12.5px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
              >
                All rounds →
              </Link>
            }
          />
        </div>

        {upcomingFixtures.length ? (
          <div className="grid md:grid-cols-3">
            {upcomingFixtures.map((match, index) => (
              <div
                key={match.id}
                className={`flex flex-col gap-4.5 border-b border-border p-6 transition-colors last:border-b-0 hover:bg-[var(--surface-2)] md:border-b-0 ${
                  index < upcomingFixtures.length - 1 ? "md:border-r md:border-border" : ""
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[var(--faint)]">
                  <span>{formatKickoff(match.date, match.time)}</span>
                  <MatchStatusBadge status={match.status} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <TeamLogo team={match.homeTeam} size="md" />
                    <span className="truncate text-sm font-extrabold leading-tight">
                      {match.homeTeam.name}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] leading-none text-[var(--faint)]">vs</span>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="truncate text-sm font-extrabold leading-tight">
                      {match.awayTeam.name}
                    </span>
                    <TeamLogo team={match.awayTeam} size="md" />
                  </span>
                </div>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--faint)]">
                  Round {match.round}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-6 py-8 text-sm font-semibold text-muted-foreground">
            The season schedule is complete.
          </p>
        )}
      </section>
    </div>
  );
}
