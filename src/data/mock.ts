import { type Match, type MatchStatus, type Player, type PlayerPosition, type Standing, type Team } from "@/lib/types";
import matchesJson from "@/data/matches.json";
import playersJson from "@/data/players.json";
import teamsJson from "@/data/teams.json";

export const teams: Team[] = teamsJson as Team[];

export const players: Player[] = (playersJson as Array<Omit<Player, "position"> & { position: string }>).map(
  (player) => ({
    ...player,
    position: player.position as PlayerPosition,
  }),
);

export const matches: Match[] = (matchesJson as Array<Omit<Match, "status"> & { status: string }>).map(
  (match) => ({
    ...match,
    status: match.status as MatchStatus,
  }),
);

export function calculateStandings(inputMatches: Match[]): Standing[] {
  const base: Record<number, Standing> = Object.fromEntries(
    teams.map((team) => [
      team.id,
      {
        teamId: team.id,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      },
    ]),
  );

  for (const match of inputMatches) {
    if (match.status !== "finished" || match.homeScore === null || match.awayScore === null) {
      continue;
    }

    const home = base[match.homeTeamId];
    const away = base[match.awayTeamId];

    home.played += 1;
    away.played += 1;

    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won += 1;
      away.lost += 1;
      home.points += 3;
    } else if (match.homeScore < match.awayScore) {
      away.won += 1;
      home.lost += 1;
      away.points += 3;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  return Object.values(base)
    .map((row) => ({
      ...row,
      goalDifference: row.goalsFor - row.goalsAgainst,
    }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor,
    );
}

export const standings: Standing[] = calculateStandings(matches);

export const leagueSnapshot = {
  teams,
  players,
  matches,
  standings,
} as const;
