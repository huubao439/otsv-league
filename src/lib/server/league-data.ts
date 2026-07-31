import { cache } from "react";
import { matches as seedMatches, players as seedPlayers } from "@/data/mock";
import { kvGet, kvSet } from "@/lib/server/kv";
import { type Match, type Player } from "@/lib/types";

const ROSTER_KEY = "otsv:roster";
const MATCHES_KEY = "otsv:matches";

/**
 * Shared league data. The store is the source of truth once anything has been
 * saved; until then the seeded JSON is served so a fresh deployment is never
 * empty. `cache` dedupes reads within a single request.
 */
export const getRoster = cache(async (): Promise<Player[]> => {
  const stored = await kvGet<Player[]>(ROSTER_KEY);
  return stored && stored.length > 0 ? stored : seedPlayers;
});

export const getMatches = cache(async (): Promise<Match[]> => {
  const stored = await kvGet<Match[]>(MATCHES_KEY);
  return stored && stored.length > 0 ? stored : seedMatches;
});

export async function saveRoster(roster: Player[]): Promise<void> {
  await kvSet(ROSTER_KEY, roster);
}

export async function saveMatches(matches: Match[]): Promise<void> {
  await kvSet(MATCHES_KEY, matches);
}
