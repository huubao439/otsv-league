"use server";

import { revalidatePath, updateTag } from "next/cache";
import { teams } from "@/data/mock";
import { LEAGUE_TAG } from "@/lib/server/kv";
import {
  deleteMatchImage,
  getMatchImage,
  getRoster,
  saveMatchImage,
  saveMatchResult,
  saveRoster,
} from "@/lib/server/league-data";
import {
  type MatchEvent,
  type Player,
  type PlayerDraft,
  type PlayerImportRow,
} from "@/lib/types";

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

export type ImportResult = {
  added: number;
  skipped: { row: string; reason: string }[];
};

/**
 * Bulk import from a CSV. Every row is re-validated here — the client-side
 * preview is only for showing problems early, and cannot be trusted.
 */
export async function importPlayersAction(rows: PlayerImportRow[]): Promise<ImportResult> {
  const roster = await getRoster();
  const teamIds = new Set(teams.map((team) => team.id));
  const skipped: ImportResult["skipped"] = [];

  let nextId = roster.reduce((max, player) => Math.max(max, player.id), 0) + 1;
  let next = [...roster];
  // Last captain listed for a team wins; applied after every insert.
  const captainByTeam = new Map<number, number>();

  for (const row of rows) {
    const name = row.name?.trim() ?? "";
    const jerseyName = row.jerseyName?.trim() ?? "";
    const label = name || "(unnamed)";

    if (!name || !jerseyName) {
      skipped.push({ row: label, reason: "Missing player name or jersey name." });
      continue;
    }
    if (!Number.isInteger(row.shirtNumber) || row.shirtNumber < 1 || row.shirtNumber > 99) {
      skipped.push({ row: label, reason: "Jersey number must be a whole number 1–99." });
      continue;
    }
    if (!teamIds.has(row.teamId)) {
      skipped.push({ row: label, reason: `Team ${row.teamId} does not exist.` });
      continue;
    }
    if (
      next.some(
        (player) => player.teamId === row.teamId && player.shirtNumber === row.shirtNumber,
      )
    ) {
      skipped.push({ row: label, reason: `Number ${row.shirtNumber} is already taken.` });
      continue;
    }

    const player: Player = {
      id: nextId,
      teamId: row.teamId,
      name,
      jerseyName,
      shirtNumber: row.shirtNumber,
      position: "MF",
      isCaptain: row.isCaptain,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
    };

    next.push(player);
    if (row.isCaptain) {
      captainByTeam.set(row.teamId, player.id);
    }
    nextId += 1;
  }

  for (const [teamId, captainId] of captainByTeam) {
    next = applyCaptaincy(next, teamId, captainId);
  }

  const added = next.length - roster.length;
  if (added > 0 || captainByTeam.size > 0) {
    await saveRoster(next);
    refresh();
  }

  return { added, skipped };
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

/** Upper bound on the stored data URL, to stay well under the KV request cap. */
const MAX_IMAGE_CHARS = 1_400_000;

export type ImageSaveResult = { ok: boolean; error?: string };

export async function saveMatchImageAction(
  matchId: number,
  dataUrl: string,
): Promise<ImageSaveResult> {
  if (!dataUrl.startsWith("data:image/")) {
    return { ok: false, error: "That is not an image." };
  }
  if (dataUrl.length > MAX_IMAGE_CHARS) {
    return { ok: false, error: "Image is too large even after compression." };
  }

  await saveMatchImage(matchId, dataUrl);
  refresh();
  return { ok: true };
}

export async function deleteMatchImageAction(matchId: number) {
  await deleteMatchImage(matchId);
  refresh();
}

/** Returns the stored data URL for on-demand viewing (nothing is sent until asked). */
export async function getMatchImageAction(matchId: number): Promise<string | null> {
  return getMatchImage(matchId);
}

export async function saveMatchAction(matchId: number, draft: MatchResultDraft) {
  const scored = draft.homeScore !== null && draft.awayScore !== null;

  await saveMatchResult({
    id: matchId,
    homeScore: draft.homeScore,
    awayScore: draft.awayScore,
    // A match counts towards the table only once both scores are in.
    status: scored ? "finished" : "upcoming",
    videoHighlightUrl: draft.videoHighlightUrl.trim(),
    events: draft.events,
  });
  refresh();
}
