"use client";

import { useMemo, useSyncExternalStore } from "react";
import { players as seedPlayers } from "@/data/mock";
import { type Player, type PlayerDraft } from "@/lib/types";

/**
 * Client-side roster store. There is no backend yet, so admin edits are seeded
 * from players.json and persisted to localStorage. Swap the read/write helpers
 * for API calls when a server exists — the component API stays the same.
 */
const STORAGE_KEY = "otsv-roster";

let state: Player[] = seedPlayers;
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
      state = parsed as Player[];
    }
  } catch {
    // Corrupt or unavailable storage — fall back to the seeded roster.
  }
}

function commit(next: Player[]) {
  state = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Persisting is best-effort; the in-memory state is still updated.
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

function getSnapshot(): Player[] {
  hydrate();
  return state;
}

function getServerSnapshot(): Player[] {
  return seedPlayers;
}

/** A team may only have one captain, so promoting one demotes the rest. */
function applyCaptaincy(list: Player[], teamId: number, captainId: number): Player[] {
  return list.map((player) =>
    player.teamId === teamId && player.id !== captainId
      ? { ...player, isCaptain: false }
      : player,
  );
}

export function addPlayer(teamId: number, draft: PlayerDraft) {
  const id = state.reduce((max, player) => Math.max(max, player.id), 0) + 1;
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

  const next = [...state, player];
  commit(draft.isCaptain ? applyCaptaincy(next, teamId, id) : next);
}

export function updatePlayer(id: number, draft: PlayerDraft) {
  const target = state.find((player) => player.id === id);
  if (!target) {
    return;
  }

  const next = state.map((player) => (player.id === id ? { ...player, ...draft } : player));
  commit(draft.isCaptain ? applyCaptaincy(next, target.teamId, id) : next);
}

export function removePlayer(id: number) {
  commit(state.filter((player) => player.id !== id));
}

export function useRoster(): Player[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Squad for one team, ordered by shirt number. */
export function useTeamRoster(teamId: number): Player[] {
  const roster = useRoster();

  return useMemo(
    () =>
      roster
        .filter((player) => player.teamId === teamId)
        .sort((a, b) => a.shirtNumber - b.shirtNumber),
    [roster, teamId],
  );
}
