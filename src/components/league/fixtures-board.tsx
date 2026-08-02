"use client";

import { Video } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { MatchStatusBadge } from "@/components/league/match-status-badge";
import { PageHeading } from "@/components/league/page-heading";
import { TeamLogo } from "@/components/league/team-logo";
import { formatKickoff, type MatchWithTeams } from "@/data/league";

const matchColumns =
  "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-cols-[150px_minmax(0,1fr)_86px_minmax(0,1fr)_128px] min-w-0 md:min-w-[720px]";

export type FixtureRound = { round: number; matches: MatchWithTeams[] };

/** Round tabs are local UI state; the fixtures themselves come from the server. */
export function FixturesBoard({ rounds }: { rounds: FixtureRound[] }) {
  const [activeRound, setActiveRound] = useState(rounds.at(0)?.round ?? 1);
  const visible = rounds.filter((entry) => entry.round === activeRound);
  const totalMatches = rounds.reduce((total, entry) => total + entry.matches.length, 0);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading
        eyebrow={`${totalMatches} matches · ${rounds.length} rounds`}
        title="Fixtures"
        accent="& results"
        aside={
          <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-[var(--surface)] px-4 py-2.5 text-[12.5px] font-semibold leading-none text-muted-foreground">
            <span className="h-[7px] w-[7px] rounded-full bg-[var(--gold)] animate-pulse-dot" />
            Round {activeRound} selected
          </span>
        }
      />

      <div className="overflow-x-auto pb-1">
        <div
          data-testid="fixtures-round-tabs"
          role="tablist"
          aria-label="Fixture rounds"
          className="flex w-max gap-1.5 rounded-full border border-border bg-[var(--surface-2)] p-1"
        >
          {rounds.map(({ round }) => (
            <button
              key={round}
              type="button"
              role="tab"
              aria-selected={round === activeRound}
              data-testid={`round-tab-${round}`}
              onClick={() => setActiveRound(round)}
              className={
                round === activeRound
                  ? "cursor-pointer rounded-full bg-[image:var(--grad)] px-4 py-2 text-xs font-bold leading-none text-white"
                  : "cursor-pointer rounded-full px-3.5 py-2 text-xs font-semibold leading-none text-[var(--faint)] transition-colors hover:text-foreground"
              }
            >
              Round {round}
            </button>
          ))}
        </div>
      </div>

      {visible.map(({ round, matches }) => (
        <div
          key={round}
          role="tabpanel"
          // Mobile: a plain stack of match cards. Desktop (md+): the bordered
          // table panel, exactly as before.
          className="flex flex-col gap-3 md:block md:gap-0 md:overflow-hidden md:overflow-x-auto md:rounded-[22px] md:border md:border-border md:bg-[var(--surface)] md:shadow-[var(--shadow-soft)]"
        >
          {/* Round header — desktop bar */}
          <div className="hidden flex-wrap items-center justify-between gap-3 border-b border-border bg-[var(--surface-2)] px-6 py-4.5 md:flex">
            <div className="flex flex-wrap items-center gap-3.5">
              <span className="font-heading text-[22px] uppercase leading-none">Round {round}</span>
              <span className="text-[12.5px] font-semibold leading-none text-muted-foreground">
                {matches.at(0) ? formatKickoff(matches[0].date, matches[0].time) : "To be scheduled"}
              </span>
            </div>
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[var(--faint)]">
              {matches.length} matches
            </span>
          </div>

          {/* Round header — mobile inline label */}
          <div className="flex items-center justify-between md:hidden">
            <span className="flex items-center gap-2 font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-[var(--faint)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-pulse-dot" />
              {matches.at(0) ? formatKickoff(matches[0].date, matches[0].time) : "To be scheduled"}
            </span>
            <span className="font-mono text-[10px] font-medium uppercase text-[var(--faint)]">
              {matches.length} matches
            </span>
          </div>

          {matches.map((match, index) => (
            <Fragment key={match.id}>
              {/* Mobile card — crest over name, VS in the middle, roomy tap targets. */}
              <div className="flex flex-col gap-3 rounded-[20px] border border-border bg-[var(--surface)] p-3.5 shadow-[var(--shadow-soft)] md:hidden">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] leading-none tracking-[0.1em] text-[var(--faint)]">
                    {formatKickoff(match.date, match.time)}
                  </span>
                  <MatchStatusBadge status={match.status} />
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2.5">
                  <Link href={`/teams/${match.homeTeam.id}`} className="flex flex-col items-center gap-1.5">
                    <TeamLogo team={match.homeTeam} size="xl" shape="squircle" />
                    <span className="text-center text-[12.5px] font-extrabold leading-tight">
                      {match.homeTeam.name}
                    </span>
                  </Link>
                  <span className="mt-2 justify-self-center rounded-[11px] border border-border px-3 py-2 font-heading text-sm leading-none tracking-[0.06em] text-muted-foreground">
                    {match.homeScore === null || match.awayScore === null
                      ? "VS"
                      : `${match.homeScore} - ${match.awayScore}`}
                  </span>
                  <Link href={`/teams/${match.awayTeam.id}`} className="flex flex-col items-center gap-1.5">
                    <TeamLogo team={match.awayTeam} size="xl" shape="squircle" />
                    <span className="text-center text-[12.5px] font-extrabold leading-tight">
                      {match.awayTeam.name}
                    </span>
                  </Link>
                </div>
                {match.videoHighlightUrl ? (
                  <a
                    href={match.videoHighlightUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch highlight: ${match.homeTeam.name} vs ${match.awayTeam.name}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-[13px] bg-[image:var(--grad)] py-2.5 text-xs font-extrabold leading-none text-white"
                  >
                    <Video className="h-3.5 w-3.5" />
                    Watch highlight
                  </a>
                ) : null}
              </div>

              {/* Desktop row — unchanged. */}
              <div
                style={{ animationDelay: `${index * 50}ms` }}
                className={`hidden ${matchColumns} items-center gap-x-4 gap-y-3 border-b border-border px-6 py-4 transition-colors last:border-b-0 hover:bg-[var(--surface-2)] animate-fade-up md:grid`}
              >
                <span className="col-span-3 flex flex-wrap items-center gap-2 font-mono text-[11px] leading-none tracking-[0.1em] text-[var(--faint)] md:col-span-1">
                  {formatKickoff(match.date, match.time)}
                  <MatchStatusBadge status={match.status} />
                </span>

                {/* Only the name is a link, so the rest of the row is inert on hover. */}
                <span className="flex min-w-0 items-center justify-end gap-2.5">
                  {/* leading-tight, not leading-none: truncate clips descenders otherwise */}
                  <Link
                    href={`/teams/${match.homeTeam.id}`}
                    className="truncate text-right text-[14.5px] font-extrabold leading-tight transition-colors hover:text-[var(--pink)]"
                  >
                    {match.homeTeam.name}
                  </Link>
                  <TeamLogo team={match.homeTeam} size="row" shape="bare" />
                </span>

                <span className="justify-self-center rounded-[9px] border border-border px-3.5 py-1.5 font-heading text-sm leading-none tracking-[0.06em] text-muted-foreground">
                  {match.homeScore === null || match.awayScore === null
                    ? "VS"
                    : `${match.homeScore} - ${match.awayScore}`}
                </span>

                <span className="flex min-w-0 items-center gap-2.5">
                  <TeamLogo team={match.awayTeam} size="row" shape="bare" />
                  <Link
                    href={`/teams/${match.awayTeam.id}`}
                    className="truncate text-[14.5px] font-extrabold leading-tight transition-colors hover:text-[var(--pink)]"
                  >
                    {match.awayTeam.name}
                  </Link>
                </span>

                <span className="col-span-3 justify-self-start empty:hidden md:col-span-1 md:justify-self-end">
                  {match.videoHighlightUrl ? (
                    <a
                      href={match.videoHighlightUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`highlight-link-${match.id}`}
                      aria-label={`Watch highlight: ${match.homeTeam.name} vs ${match.awayTeam.name}`}
                      title="Watch match highlight"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[image:var(--grad)] px-3.5 py-2 text-xs font-bold leading-none text-white shadow-[0_12px_24px_-14px_oklch(0.6_0.24_350/0.9)] transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pink)]"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Highlight
                    </a>
                  ) : null}
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
