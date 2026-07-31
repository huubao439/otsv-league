"use client";

import { Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MatchStatusBadge } from "@/components/league/match-status-badge";
import { PageHeading } from "@/components/league/page-heading";
import { TeamLogo } from "@/components/league/team-logo";
import { ROUNDS, formatKickoff, matchesByRoundFrom } from "@/data/league";
import { useMatches } from "@/lib/match-store";

const matchColumns =
  "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-cols-[150px_minmax(0,1fr)_86px_minmax(0,1fr)_128px] min-w-0 md:min-w-[720px]";

export default function FixturesPage() {
  const [activeRound, setActiveRound] = useState(ROUNDS[0]);
  const allMatches = useMatches();
  const rounds = ROUNDS.map((round) => ({ round, matches: matchesByRoundFrom(allMatches, round) }));
  const visible = rounds.filter((entry) => entry.round === activeRound);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading
        eyebrow={`${rounds.reduce((total, entry) => total + entry.matches.length, 0)} matches · ${ROUNDS.length} rounds`}
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
          {ROUNDS.map((round) => (
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
          className="overflow-hidden overflow-x-auto rounded-[22px] border border-border bg-[var(--surface)] shadow-[var(--shadow-soft)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-[var(--surface-2)] px-6 py-4.5">
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

          {matches.map((match, index) => (
            <div
              key={match.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`grid ${matchColumns} items-center gap-x-4 gap-y-3 border-b border-border px-6 py-4 transition-colors last:border-b-0 hover:bg-[var(--surface-2)] animate-fade-up`}
            >
              <span className="col-span-3 flex flex-wrap items-center gap-2 font-mono text-[11px] leading-none tracking-[0.1em] text-[var(--faint)] md:col-span-1">
                {formatKickoff(match.date, match.time)}
                <MatchStatusBadge status={match.status} />
              </span>

              <Link
                href={`/teams/${match.homeTeam.id}`}
                className="flex min-w-0 items-center justify-end gap-2.5 hover:text-[var(--pink)]"
              >
                {/* leading-tight, not leading-none: truncate clips descenders otherwise */}
                <span className="truncate text-right text-[14.5px] font-extrabold leading-tight">
                  {match.homeTeam.name}
                </span>
                <TeamLogo team={match.homeTeam} size="row" roundedImage={false} />
              </Link>

              <span className="justify-self-center rounded-[9px] border border-border px-3.5 py-1.5 font-heading text-sm leading-none tracking-[0.06em] text-muted-foreground">
                {match.homeScore === null || match.awayScore === null
                  ? "VS"
                  : `${match.homeScore} - ${match.awayScore}`}
              </span>

              <Link
                href={`/teams/${match.awayTeam.id}`}
                className="flex min-w-0 items-center gap-2.5 hover:text-[var(--pink)]"
              >
                <TeamLogo team={match.awayTeam} size="row" roundedImage={false} />
                <span className="truncate text-[14.5px] font-extrabold leading-tight">
                  {match.awayTeam.name}
                </span>
              </Link>

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
          ))}
        </div>
      ))}
    </div>
  );
}
