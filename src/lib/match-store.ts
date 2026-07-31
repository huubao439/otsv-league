"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  type CleanSheetRow,
  type MatchWithTeams,
  type StandingWithTeam,
  cleanSheetTableFrom,
  latestResultsFrom,
  matchesByRoundFrom,
  nextKickoffIsoFrom,
  nextRoundFixturesFrom,
  seasonProgressFrom,
  standingsWithTeamsFrom,
  teamFormFrom,
  withTeams,
  type FormResult,
} from "@/data/league";
import { matches as seedMatches } from "@/data/mock";
import { type Match, type MatchEvent } from "@/lib/types";

/**
 * Client-side match store. Scores, cards and highlight links edited in the
 * admin Match Detail tab live here, so Fixtures, Standings and the home page
 * all recompute from the same source. Persisted to localStorage until a real
 * backend exists.
 */
const STORAGE_KEY = "otsv-matches";

let state: Match[] = seedMatches;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") {
    return;
  }
  hydrated = true;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      state = parsed as Match[];
    }
  } catch {
    // Corrupt or unavailable storage — fall back to the seeded fixtures.
  }
}

function commit(next: Match[]) {
  state = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Best effort.
  }

  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Match[] {
  hydrate();
  return state;
}

function getServerSnapshot(): Match[] {
  return seedMatches;
}

export type MatchResultDraft = {
  homeScore: number | null;
  awayScore: number | null;
  videoHighlightUrl: string;
  events: MatchEvent[];
};

export function saveMatchResult(matchId: number, draft: MatchResultDraft) {
  const scored = draft.homeScore !== null && draft.awayScore !== null;

  commit(
    state.map((match) =>
      match.id === matchId
        ? {
            ...match,
            homeScore: draft.homeScore,
            awayScore: draft.awayScore,
            // A match counts towards the table only once both scores are in.
            status: scored ? "finished" : "upcoming",
            videoHighlightUrl: draft.videoHighlightUrl.trim(),
            events: draft.events,
          }
        : match,
    ),
  );
}

export function useMatches(): Match[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useMatchesWithTeams(): MatchWithTeams[] {
  const source = useMatches();

  return useMemo(
    () =>
      [...source]
        .sort((a, b) => a.round - b.round || `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
        .map(withTeams),
    [source],
  );
}

export function useStandings(): StandingWithTeam[] {
  const source = useMatches();
  return useMemo(() => standingsWithTeamsFrom(source), [source]);
}

export function useLatestResults(limit = 3): MatchWithTeams[] {
  const source = useMatches();
  return useMemo(() => latestResultsFrom(source, limit), [source, limit]);
}

export function useNextRoundFixtures(): MatchWithTeams[] {
  const source = useMatches();
  return useMemo(() => nextRoundFixturesFrom(source), [source]);
}

export function useMatchesByRound(round: number): MatchWithTeams[] {
  const source = useMatches();
  return useMemo(() => matchesByRoundFrom(source, round), [source, round]);
}

export function useSeasonProgress(): { played: number; total: number } {
  const source = useMatches();
  return useMemo(() => seasonProgressFrom(source), [source]);
}

export function useNextKickoffIso(): string | null {
  const source = useMatches();
  return useMemo(() => nextKickoffIsoFrom(source), [source]);
}

export function useCleanSheetTable(): CleanSheetRow[] {
  const source = useMatches();
  return useMemo(() => cleanSheetTableFrom(source), [source]);
}

/** Form guides for every team, keyed by team id. */
export function useFormGuides(): Record<number, FormResult[]> {
  const source = useMatches();

  return useMemo(() => {
    const guides: Record<number, FormResult[]> = {};
    for (const match of source) {
      guides[match.homeTeamId] ??= teamFormFrom(source, match.homeTeamId);
      guides[match.awayTeamId] ??= teamFormFrom(source, match.awayTeamId);
    }

    return guides;
  }, [source]);
}
