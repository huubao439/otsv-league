"use client";

import { useState } from "react";
import { MatchDetail } from "@/components/admin/match-detail";
import { TeamsInfo } from "@/components/admin/teams-info";
import { type FixtureRound } from "@/components/league/fixtures-board";
import { type Player, type Team } from "@/lib/types";

/** Sub-tabs of the Overall workspace. Add further sections here. */
const subTabs = [
  { id: "match-detail", label: "Match Detail" },
  { id: "teams-info", label: "Teams Info" },
] as const;

type SubTabId = (typeof subTabs)[number]["id"];

export function AdminWorkspace({
  teams,
  roster,
  rounds,
  matchImageIds,
}: {
  teams: Team[];
  roster: Player[];
  rounds: FixtureRound[];
  matchImageIds: number[];
}) {
  const [active, setActive] = useState<SubTabId>("match-detail");

  return (
    <div className="flex flex-col gap-4.5">
      <div className="overflow-x-auto pb-1">
        <div
          role="tablist"
          aria-label="Admin sections"
          data-testid="admin-sub-tabs"
          className="flex w-max gap-1.5 rounded-full border border-border bg-[var(--surface-2)] p-1"
        >
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.id === active}
              data-testid={`admin-sub-tab-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={
                tab.id === active
                  ? "cursor-pointer rounded-full bg-[image:var(--grad)] px-4 py-2 text-xs font-bold leading-none text-white"
                  : "cursor-pointer rounded-full px-3.5 py-2 text-xs font-semibold leading-none text-[var(--faint)] transition-colors hover:text-foreground"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {active === "match-detail" ? (
        <MatchDetail rounds={rounds} roster={roster} matchImageIds={matchImageIds} />
      ) : null}
      {active === "teams-info" ? <TeamsInfo teams={teams} roster={roster} /> : null}
    </div>
  );
}
