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
