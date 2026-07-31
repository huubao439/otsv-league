import { calculateStandings, matches, players, standings, teams } from "@/data/mock";
import { type Match, type Player, type Standing, type Team } from "@/lib/types";

export type StandingWithTeam = Standing & {
  team: Team;
};

export type MatchWithTeams = Match & {
  homeTeam: Team;
  awayTeam: Team;
};

export const ROUNDS = Array.from({ length: 5 }, (_, index) => index + 1);

/*
 * The `*From` helpers below are pure: they take whichever match list you hand
 * them. Server components pass the static data via the wrappers further down;
 * client components pass the admin-edited list from the match store, so both
 * share one implementation.
 */

export function standingsWithTeamsFrom(source: Match[]): StandingWithTeam[] {
  return calculateStandings(source)
    .map((row) => {
      const team = getTeamById(row.teamId);
      return team ? { ...row, team } : null;
    })
    .filter((row): row is StandingWithTeam => row !== null);
}

export function latestResultsFrom(source: Match[], limit = 3): MatchWithTeams[] {
  return source
    .filter((match) => match.status === "finished")
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
    .slice(0, limit)
    .map(withTeams);
}

export function matchesByRoundFrom(source: Match[], round: number): MatchWithTeams[] {
  return source
    .filter((match) => match.round === round)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .map(withTeams);
}

export function nextRoundFixturesFrom(source: Match[]): MatchWithTeams[] {
  const nextRound = source
    .filter((match) => match.status === "upcoming" || match.status === "live")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .at(0)?.round;

  return nextRound === undefined ? [] : matchesByRoundFrom(source, nextRound);
}

export function teamFormFrom(source: Match[], teamId: number, limit = 5): FormResult[] {
  return source
    .filter(
      (match) =>
        match.status === "finished" &&
        match.homeScore !== null &&
        match.awayScore !== null &&
        (match.homeTeamId === teamId || match.awayTeamId === teamId),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(-limit)
    .map((match) => {
      const isHome = match.homeTeamId === teamId;
      const scored = isHome ? match.homeScore! : match.awayScore!;
      const conceded = isHome ? match.awayScore! : match.homeScore!;

      if (scored > conceded) {
        return "W";
      }

      return scored === conceded ? "D" : "L";
    });
}

export function nextKickoffIsoFrom(source: Match[]): string | null {
  const next = source
    .filter((match) => match.status === "upcoming" || match.status === "live")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .at(0);

  // Fixture times are local to Vietnam (UTC+7).
  return next ? `${next.date}T${next.time}:00+07:00` : null;
}

export function seasonProgressFrom(source: Match[]): { played: number; total: number } {
  return {
    played: source.filter((match) => match.status === "finished").length,
    total: source.length,
  };
}

export function cleanSheetTableFrom(source: Match[]): CleanSheetRow[] {
  const finished = source.filter(
    (match) => match.status === "finished" && match.homeScore !== null && match.awayScore !== null,
  );

  return teams
    .map((team) => {
      const teamMatches = finished.filter(
        (match) => match.homeTeamId === team.id || match.awayTeamId === team.id,
      );

      const conceded = teamMatches.map((match) =>
        match.homeTeamId === team.id ? match.awayScore! : match.homeScore!,
      );

      return {
        team,
        played: teamMatches.length,
        goalsAgainst: conceded.reduce((total, goals) => total + goals, 0),
        cleanSheets: conceded.filter((goals) => goals === 0).length,
      };
    })
    // Best defence is decided purely on goals conceded; clean sheets are shown
    // for context but never affect the order.
    .sort((a, b) => a.goalsAgainst - b.goalsAgainst || a.team.name.localeCompare(b.team.name));
}

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
      return team ? { ...row, team } : null;
    })
    .filter((row): row is StandingWithTeam => row !== null);
}

export function getLatestResults(limit = 3): MatchWithTeams[] {
  return latestResultsFrom(matches, limit);
}

export function getUpcomingFixtures(limit = 3): MatchWithTeams[] {
  return matches
    .filter((match) => match.status === "upcoming" || match.status === "live")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, limit)
    .map(withTeams);
}

export function getNextRoundFixtures(): MatchWithTeams[] {
  return nextRoundFixturesFrom(matches);
}

export function getMatchesByRound(round: number): MatchWithTeams[] {
  return matchesByRoundFrom(matches, round);
}

export type FormResult = "W" | "D" | "L";

/**
 * Last `limit` finished results for a team, oldest first, so the form guide
 * reads left to right. Returns fewer than `limit` entries early in the season;
 * the UI pads the remainder with "not played" placeholders.
 */
export function getTeamForm(teamId: number, limit = 5): FormResult[] {
  return teamFormFrom(matches, teamId, limit);
}

/** Matches a team plays across the whole season, in kickoff order. */
export function getTeamFixtures(teamId: number): MatchWithTeams[] {
  return matches
    .filter((match) => match.homeTeamId === teamId || match.awayTeamId === teamId)
    .sort((a, b) => a.round - b.round || `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .map(withTeams);
}

/** Next scheduled kickoff as an ISO timestamp, used for the hero countdown. */
export function getNextKickoffIso(): string | null {
  return nextKickoffIsoFrom(matches);
}

export function getSeasonProgress(): { played: number; total: number } {
  return seasonProgressFrom(matches);
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

export type CleanSheetRow = {
  team: Team;
  played: number;
  goalsAgainst: number;
  cleanSheets: number;
};

/**
 * Defensive table ranked by fewest goals conceded, counted per team rather than
 * per goalkeeper.
 */
export function getCleanSheetTable(): CleanSheetRow[] {
  return cleanSheetTableFrom(matches);
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
