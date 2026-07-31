"use server";

import { revalidatePath, updateTag } from "next/cache";
import { LEAGUE_TAG } from "@/lib/server/kv";
import { getMatches, getRoster, saveMatches, saveRoster } from "@/lib/server/league-data";
import { type MatchEvent, type Player, type PlayerDraft } from "@/lib/types";

/**
 * Every admin write goes through here: mutate the shared store, then
 * revalidate so all pages pick the change up for every visitor.
 *
 * NOTE: these are unauthenticated by request — /admin is deliberately open for
 * testing. Gate them before this is public; see src/lib/admin-auth.ts.
 */
function refresh() {
  // updateTag (not revalidateTag) expires the cached read immediately rather
  // than serving stale-while-revalidate, so the admin sees their own save and
  // the next visitor gets fresh data straight away. revalidatePath then drops
  // the rendered pages built from that read.
  updateTag(LEAGUE_TAG);
  revalidatePath("/", "layout");
}

/** A team may only have one captain, so promoting one demotes the rest. */
function applyCaptaincy(list: Player[], teamId: number, captainId: number): Player[] {
  return list.map((player) =>
    player.teamId === teamId && player.id !== captainId
      ? { ...player, isCaptain: false }
      : player,
  );
}

export async function addPlayerAction(teamId: number, draft: PlayerDraft) {
  const roster = await getRoster();
  const id = roster.reduce((max, player) => Math.max(max, player.id), 0) + 1;

  const player: Player = {
    id,
    teamId,
    name: draft.name,
    jerseyName: draft.jerseyName,
    shirtNumber: draft.shirtNumber,
    // The admin form does not capture a position yet, so new players default to MF.
    position: "MF",
    isCaptain: draft.isCaptain,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  };

  const next = [...roster, player];
  await saveRoster(draft.isCaptain ? applyCaptaincy(next, teamId, id) : next);
  refresh();
}

export async function updatePlayerAction(id: number, draft: PlayerDraft) {
  const roster = await getRoster();
  const target = roster.find((player) => player.id === id);
  if (!target) {
    return;
  }

  const next = roster.map((player) => (player.id === id ? { ...player, ...draft } : player));
  await saveRoster(draft.isCaptain ? applyCaptaincy(next, target.teamId, id) : next);
  refresh();
}

export async function removePlayerAction(id: number) {
  const roster = await getRoster();
  await saveRoster(roster.filter((player) => player.id !== id));
  refresh();
}

export type MatchResultDraft = {
  homeScore: number | null;
  awayScore: number | null;
  videoHighlightUrl: string;
  events: MatchEvent[];
};

export async function saveMatchAction(matchId: number, draft: MatchResultDraft) {
  const matches = await getMatches();
  const scored = draft.homeScore !== null && draft.awayScore !== null;

  await saveMatches(
    matches.map((match) =>
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
  refresh();
}
