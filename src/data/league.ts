import { matches, players, standings, teams } from "@/data/mock";
import { type Match, type Player, type Standing, type Team } from "@/lib/types";

export type StandingWithTeam = Standing & {
  team: Team;
};

export type MatchWithTeams = Match & {
  homeTeam: Team;
  awayTeam: Team;
};

export const MATCH_WEEKS = Array.from({ length: 10 }, (_, index) => index + 1);

export function getTeamById(teamId: number): Team | undefined {
  return teams.find((team) => team.id === teamId);
}

export function withTeams(match: Match): MatchWithTeams {
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);

  if (!homeTeam || !awayTeam) {
    throw new Error(`Team not found for match ${match.id}`);
  }

  return {
    ...match,
    homeTeam,
    awayTeam,
  };
}

export function getStandingsWithTeams(): StandingWithTeam[] {
  return standings
    .map((row) => {
      const team = getTeamById(row.teamId);
      if (!team) {
        return null;
      }

      return {
        ...row,
        team,
      };
    })
    .filter((row): row is StandingWithTeam => row !== null);
}

export function getLatestResults(limit = 3): MatchWithTeams[] {
  return matches
    .filter((match) => match.status === "finished")
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
    .slice(0, limit)
    .map(withTeams);
}

export function getUpcomingFixtures(limit = 3): MatchWithTeams[] {
  return matches
    .filter((match) => match.status === "upcoming" || match.status === "live")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, limit)
    .map(withTeams);
}

export function getMatchesByWeek(matchWeek: number): MatchWithTeams[] {
  return matches
    .filter((match) => match.matchWeek === matchWeek)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .map(withTeams);
}

export function getTeamPlayers(teamId: number): Player[] {
  return players
    .filter((player) => player.teamId === teamId)
    .sort((a, b) => {
      const pos = a.position.localeCompare(b.position);
      if (pos !== 0) {
        return pos;
      }

      return a.shirtNumber - b.shirtNumber;
    });
}

export function getTeamStanding(teamId: number): StandingWithTeam | undefined {
  return getStandingsWithTeams().find((row) => row.teamId === teamId);
}

export function getTopScorers(limit = 10): Player[] {
  return [...players]
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, limit);
}

export function getTopAssists(limit = 10): Player[] {
  return [...players]
    .sort((a, b) => b.assists - a.assists || b.goals - a.goals)
    .slice(0, limit);
}

export function getEmbedUrl(url: string | undefined): string {
  if (!url) {
    return "";
  }

  if (url.includes("/embed/")) {
    return url;
  }

  const match = url.match(/[?&]v=([^&]+)/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  return url;
}

export function formatKickoff(date: string, time: string): string {
  return `${date} - ${time}`;
}
