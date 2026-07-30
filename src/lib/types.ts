export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  colorCode: string;
}

export type PlayerPosition = "GK" | "DF" | "MF" | "FW";

export interface Player {
  id: number;
  teamId: number;
  name: string;
  shirtNumber: number;
  position: PlayerPosition;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export type MatchStatus = "upcoming" | "live" | "finished";

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  status: MatchStatus;
  matchWeek: number;
  videoHighlightUrl?: string;
}

export interface Standing {
  teamId: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
