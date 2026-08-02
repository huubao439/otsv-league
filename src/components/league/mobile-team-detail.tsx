"use client";

import Link from "next/link";
import { useState } from "react";
import { FormGuide } from "@/components/league/form-guide";
import { TeamLogo } from "@/components/league/team-logo";
import { type FormResult } from "@/data/league";
import { type MatchStatus, type Team } from "@/lib/types";

export type TeamFixtureRow = {
  id: number;
  round: number;
  opponent: Team;
  time: string;
  dateLabel: string;
  status: MatchStatus;
  scoreLine: string | null;
};

export type TeamSquadRow = {
  id: number;
  name: string;
  jerseyName: string;
  shirtNumber: number;
  isCaptain: boolean;
  goals: number;
  yellowCards: number;
  redCards: number;
};

const tabs = ["Fixtures", "Squad", "Stats"] as const;
type Tab = (typeof tabs)[number];

/**
 * Mobile team page from the design: a coloured hero with four stat tiles, then
 * a segmented control over Fixtures / Squad / Stats. Rendered below md only;
 * the desktop two-column layout stays untouched behind md:block.
 */
export function MobileTeamDetail({
  team,
  ranking,
  played,
  goalDifference,
  points,
  form,
  fixtures,
  squad,
  teamStats,
}: {
  team: Team;
  ranking: number;
  played: number;
  goalDifference: string;
  points: number;
  form: FormResult[];
  fixtures: TeamFixtureRow[];
  squad: TeamSquadRow[];
  teamStats: { goalsFor: number; goalsAgainst: number; cleanSheets: number; cards: number };
}) {
  const [tab, setTab] = useState<Tab>("Fixtures");

  const tiles = [
    { value: `#${ranking}`, label: "Pos" },
    { value: played, label: "Played" },
    { value: goalDifference, label: "GD" },
    { value: points, label: "Pts", highlight: true },
  ];

  return (
    <div className="flex flex-col md:hidden">
      {/* Coloured hero */}
      <section className="relative overflow-hidden" style={{ background: team.gradient }}>
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(160deg,oklch(0.14_0.03_335/0.55),oklch(0.14_0.03_335/0.12))]"
        />
        <div className="relative flex flex-col gap-4 px-4 pb-5 pt-4 text-white">
          <Link
            href="/teams"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-[12px] font-bold leading-none"
          >
            <span aria-hidden>←</span> All teams
          </Link>

          <div className="flex items-center gap-4">
            <TeamLogo
              team={team}
              size="hero"
              shape="squircle"
              className="shadow-[0_10px_28px_-12px_oklch(0.1_0.03_335/0.9)] ring-2 ring-white/35"
            />
            <div className="flex min-w-0 flex-col gap-2">
              <h1 className="m-0 font-heading text-[38px] uppercase leading-[0.94]">{team.name}</h1>
              <span className="flex items-center gap-2.5 text-[12px] font-semibold leading-none text-white/85">
                Form
                <FormGuide form={form} />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {tiles.map((tile) => (
              <span
                key={tile.label}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 ${
                  tile.highlight ? "border-white/30 bg-white/15" : "border-white/20 bg-[oklch(0.14_0.03_335/0.4)]"
                }`}
              >
                <span className="font-heading text-[22px] leading-none">{tile.value}</span>
                <span className="font-mono text-[8.5px] font-medium uppercase tracking-[0.14em] text-white/75">
                  {tile.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Segmented control */}
      <div className="flex flex-col gap-3 px-4 pb-4 pt-3">
        <div
          role="tablist"
          aria-label="Team sections"
          className="flex gap-1.5 rounded-full border border-border bg-[var(--surface-2)] p-1"
        >
          {tabs.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={tab === name}
              data-testid={`team-tab-${name.toLowerCase()}`}
              onClick={() => setTab(name)}
              className={
                tab === name
                  ? "flex-1 cursor-pointer rounded-full bg-[image:var(--grad)] px-3 py-2.5 text-[12.5px] font-extrabold leading-none text-white"
                  : "flex-1 cursor-pointer rounded-full px-3 py-2.5 text-[12.5px] font-bold leading-none text-[var(--faint)] transition-colors hover:text-foreground"
              }
            >
              {name}
            </button>
          ))}
        </div>

        {tab === "Fixtures" ? (
          <div className="flex flex-col gap-2">
            {fixtures.map((match) => (
              <Link
                key={match.id}
                href={`/teams/${match.opponent.id}`}
                className="flex items-center gap-3 rounded-[16px] border border-border bg-[var(--surface)] p-3"
              >
                <span className="w-7 shrink-0 font-mono text-[10.5px] font-medium leading-none tracking-[0.08em] text-[var(--faint)]">
                  R{match.round}
                </span>
                <TeamLogo team={match.opponent} size="ml" shape="squircle" />
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-extrabold leading-tight">
                  {match.opponent.name}
                </span>
                {match.scoreLine ? (
                  <span className="shrink-0 rounded-lg border border-border px-2.5 py-1.5 font-heading text-sm leading-none">
                    {match.scoreLine}
                  </span>
                ) : (
                  <span className="flex shrink-0 flex-col items-end gap-1 font-mono text-[10px] leading-none text-[var(--faint)]">
                    <span className="text-[12px] font-semibold text-foreground">{match.time}</span>
                    <span>{match.dateLabel}</span>
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : null}

        {tab === "Squad" ? (
          <div className="overflow-hidden rounded-[16px] border border-border bg-[var(--surface)]">
            <div className="grid grid-cols-[32px_minmax(0,1fr)_auto] gap-3 border-b border-border px-3.5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
              <span>#</span>
              <span>Player</span>
              <span className="text-right">G · YC · RC</span>
            </div>
            {squad.map((player) => (
              <div
                key={player.id}
                className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 px-3.5 py-2.5 last:border-b-0"
              >
                <span className="font-mono text-[11px] text-[var(--faint)]">{player.shirtNumber}</span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-[13px] font-bold leading-tight">{player.name}</span>
                    {player.isCaptain ? (
                      <span
                        title="Team captain"
                        aria-label="Team captain"
                        className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[image:var(--grad)] font-heading text-[9px] leading-none text-white"
                      >
                        C
                      </span>
                    ) : null}
                  </span>
                  <span className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--faint)]">
                    {player.jerseyName}
                  </span>
                </span>
                <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                  {player.goals} · {player.yellowCards} · {player.redCards}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "Stats" ? (
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { value: teamStats.goalsFor, label: "Goals for" },
              { value: teamStats.goalsAgainst, label: "Goals against" },
              { value: teamStats.cleanSheets, label: "Clean sheets" },
              { value: teamStats.cards, label: "Cards" },
            ].map((stat) => (
              <span
                key={stat.label}
                className="flex flex-col gap-1.5 rounded-[16px] border border-border bg-[image:var(--grad-soft)] p-4"
              >
                <span className="font-heading text-[26px] leading-none">{stat.value}</span>
                <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-[var(--faint)]">
                  {stat.label}
                </span>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
