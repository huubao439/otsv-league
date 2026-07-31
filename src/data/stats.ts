import { teams } from "@/data/mock";
import { type Match, type Player, type Team } from "@/lib/types";

/** Fines from the tournament regulations, section III. */
export const YELLOW_CARD_FINE = 50_000;
export const RED_CARD_FINE = 100_000;

export type PlayerStatLine = {
  goals: number;
  yellowCards: number;
  redCards: number;
};

const EMPTY_LINE: PlayerStatLine = { goals: 0, yellowCards: 0, redCards: 0 };

/**
 * Per-player goals and cards, derived from the events an admin records against
 * each match. Match events are the single source of truth — the goals/cards
 * fields stored on a player record are never counted here, otherwise a scorer
 * would be tallied twice.
 *
 * Only finished matches count, matching how the standings are calculated.
 */
export function playerStatsFrom(source: Match[]): Map<number, PlayerStatLine> {
  const stats = new Map<number, PlayerStatLine>();

  for (const match of source) {
    if (match.status !== "finished" || !match.events) {
      continue;
    }

    for (const event of match.events) {
      const line = stats.get(event.playerId) ?? { ...EMPTY_LINE };

      if (event.type === "goal") {
        line.goals += event.count;
      } else if (event.type === "yellow") {
        line.yellowCards += event.count;
      } else {
        line.redCards += event.count;
      }

      stats.set(event.playerId, line);
    }
  }

  return stats;
}

export function statsForPlayer(
  stats: Map<number, PlayerStatLine>,
  playerId: number,
): PlayerStatLine {
  return stats.get(playerId) ?? EMPTY_LINE;
}

export type ScorerRow = { player: Player; goals: number };

/** Golden boot standings, highest scorer first. */
export function topScorersFrom(source: Match[], roster: Player[], limit = 10): ScorerRow[] {
  const stats = playerStatsFrom(source);

  return roster
    .map((player) => ({ player, goals: statsForPlayer(stats, player.id).goals }))
    .filter((row) => row.goals > 0)
    .sort((a, b) => b.goals - a.goals || a.player.name.localeCompare(b.player.name))
    .slice(0, limit);
}

export type FairPlayRow = {
  team: Team;
  yellowCards: number;
  redCards: number;
  /** Positive magnitude in VND; the UI renders it as a negative balance. */
  fine: number;
};

/**
 * Cards and fines per team. Events are attributed through the player's current
 * team, so a player who has since been removed from the roster is skipped.
 */
export function fairPlayTableFrom(source: Match[], roster: Player[]): FairPlayRow[] {
  const stats = playerStatsFrom(source);
  const teamOfPlayer = new Map(roster.map((player) => [player.id, player.teamId]));
  const totals = new Map<number, { yellowCards: number; redCards: number }>();

  for (const [playerId, line] of stats) {
    const teamId = teamOfPlayer.get(playerId);
    if (teamId === undefined) {
      continue;
    }

    const total = totals.get(teamId) ?? { yellowCards: 0, redCards: 0 };
    total.yellowCards += line.yellowCards;
    total.redCards += line.redCards;
    totals.set(teamId, total);
  }

  return teams
    .map((team) => {
      const total = totals.get(team.id) ?? { yellowCards: 0, redCards: 0 };

      return {
        team,
        yellowCards: total.yellowCards,
        redCards: total.redCards,
        fine: total.yellowCards * YELLOW_CARD_FINE + total.redCards * RED_CARD_FINE,
      };
    })
    // Cleanest record first, matching the fair-play tie-breaker in the rules.
    .sort((a, b) => a.fine - b.fine || a.team.name.localeCompare(b.team.name));
}
