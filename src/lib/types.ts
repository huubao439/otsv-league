export interface Team {
  id: number;
  name: string;
  /** Two or three letter crest abbreviation, e.g. "MAT". */
  abbr: string;
  /** Department the team represents, shown as the team's subtitle. */
  department: string;
  logo: string;
  colorCode: string;
  /** CSS gradient used for the team's crest tile and hero banner. */
  gradient: string;
}

export type PlayerPosition = "GK" | "DF" | "MF" | "FW";

export interface Player {
  id: number;
  teamId: number;
  name: string;
  /** Short name printed on the shirt. */
  jerseyName: string;
  shirtNumber: number;
  position: PlayerPosition;
  /** At most one player per team may be captain. */
  isCaptain: boolean;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

/** The subset of a player an admin edits; stats are not editable by hand. */
export type PlayerDraft = {
  name: string;
  jerseyName: string;
  shirtNumber: number;
  isCaptain: boolean;
};

/** One row of a bulk CSV import — a draft plus the team it belongs to. */
export type PlayerImportRow = PlayerDraft & { teamId: number };

export type MatchStatus = "upcoming" | "live" | "finished";

export type MatchEventType = "goal" | "yellow" | "red";

export interface MatchEvent {
  id: string;
  playerId: number;
  type: MatchEventType;
  /** Goals scored by this player. Always 1 for cards. */
  count: number;
}

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  status: MatchStatus;
  round: number;
  videoHighlightUrl?: string;
  /** Scorers and cards recorded by an admin in the Match Detail tab. */
  events?: MatchEvent[];
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
