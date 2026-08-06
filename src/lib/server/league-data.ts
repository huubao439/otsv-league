import { cache } from "react";
import { matches as seedMatches, players as seedPlayers } from "@/data/mock";
import { kvGet, kvSet } from "@/lib/server/kv";
import { type Match, type MatchEvent, type MatchStatus, type Player } from "@/lib/types";

const ROSTER_KEY = "otsv:roster";
const RESULTS_KEY = "otsv:match-results";

/**
 * The fixture schedule (date, time, round, teams) is fixed tournament data and
 * always comes from src/data/matches.json — so editing that file is all it takes
 * to reschedule, and the change shows immediately regardless of the store.
 *
 * Only the admin-recorded result is stored, keyed by match id and overlaid onto
 * the schedule. Results therefore survive schedule edits, matched by id.
 */
export type MatchResult = {
  id: number;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  videoHighlightUrl: string;
  events: MatchEvent[];
};

/**
 * Shared league data. The store is the source of truth for results once saved;
 * until then the seeded JSON is served so a fresh deployment is never empty.
 * `cache` dedupes reads within a single request.
 */
export const getRoster = cache(async (): Promise<Player[]> => {
  const stored = await kvGet<Player[]>(ROSTER_KEY);
  return stored && stored.length > 0 ? stored : seedPlayers;
});

export const getMatches = cache(async (): Promise<Match[]> => {
  const results = (await kvGet<MatchResult[]>(RESULTS_KEY)) ?? [];
  const byId = new Map(results.map((result) => [result.id, result]));

  return seedMatches.map((match) => {
    const result = byId.get(match.id);
    return result ? { ...match, ...result } : match;
  });
});

export async function saveRoster(roster: Player[]): Promise<void> {
  await kvSet(ROSTER_KEY, roster);
}

/** Store one match's result, replacing any earlier result for that match. */
export async function saveMatchResult(result: MatchResult): Promise<void> {
  const results = (await kvGet<MatchResult[]>(RESULTS_KEY)) ?? [];
  await kvSet(RESULTS_KEY, [...results.filter((entry) => entry.id !== result.id), result]);
}

/*
 * Match sheet images (a photo of the paper) are stored one-per-match under a
 * dedicated key so a blob is only fetched when actually viewed. A tiny index
 * lists which matches have one, so the admin list can show that cheaply without
 * pulling every image.
 */
const IMAGE_KEY = (matchId: number) => `otsv:match-image:${matchId}`;
const IMAGE_INDEX_KEY = "otsv:match-image-index";

export async function getMatchImageIndex(): Promise<number[]> {
  return (await kvGet<number[]>(IMAGE_INDEX_KEY)) ?? [];
}

export async function getMatchImage(matchId: number): Promise<string | null> {
  return kvGet<string>(IMAGE_KEY(matchId));
}

export async function saveMatchImage(matchId: number, dataUrl: string): Promise<void> {
  await kvSet(IMAGE_KEY(matchId), dataUrl);
  const index = await getMatchImageIndex();
  if (!index.includes(matchId)) {
    await kvSet(IMAGE_INDEX_KEY, [...index, matchId]);
  }
}

export async function deleteMatchImage(matchId: number): Promise<void> {
  await kvSet(IMAGE_KEY(matchId), null);
  const index = await getMatchImageIndex();
  await kvSet(
    IMAGE_INDEX_KEY,
    index.filter((id) => id !== matchId),
  );
}
