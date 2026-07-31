import { type Player, type PlayerImportRow } from "@/lib/types";

/**
 * Minimal RFC-4180 style CSV reader: handles quoted fields, escaped quotes,
 * CRLF, and a leading BOM from Excel exports. Blank lines are dropped.
 */
export function parseCsv(text: string): string[][] {
  const source = text.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (inQuotes) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((entry) => entry.some((cell) => cell.trim() !== ""));
}

export type CsvIssue = { line: number; message: string };

export type CsvImportPreview = {
  rows: PlayerImportRow[];
  issues: CsvIssue[];
};

const HEADER_ALIASES: Record<string, keyof PlayerImportRow> = {
  playername: "name",
  name: "name",
  player: "name",
  jerseyname: "jerseyName",
  jersey: "jerseyName",
  number: "shirtNumber",
  shirtnumber: "shirtNumber",
  jerseynumber: "shirtNumber",
  captain: "isCaptain",
  iscaptain: "isCaptain",
  teamid: "teamId",
  team: "teamId",
};

const DEFAULT_ORDER: (keyof PlayerImportRow)[] = [
  "name",
  "jerseyName",
  "shirtNumber",
  "isCaptain",
  "teamId",
];

const normalise = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

function parseBoolean(value: string): boolean {
  return ["true", "1", "yes", "y", "x"].includes(normalise(value));
}

/**
 * Maps CSV rows onto player drafts and reports what could not be used.
 * Validation is repeated on the server — this exists so the admin sees problems
 * before committing the import.
 */
export function parsePlayerCsv(
  text: string,
  validTeamIds: Set<number>,
  existingRoster: Player[] = [],
): CsvImportPreview {
  const table = parseCsv(text);
  const issues: CsvIssue[] = [];
  const rows: PlayerImportRow[] = [];

  if (table.length === 0) {
    return { rows, issues: [{ line: 0, message: "The file is empty." }] };
  }

  // A header row is optional; fall back to the documented column order.
  const first = table[0].map(normalise);
  const hasHeader = first.some((cell) => cell in HEADER_ALIASES);
  const columns = hasHeader
    ? first.map((cell) => HEADER_ALIASES[cell] ?? null)
    : DEFAULT_ORDER.map((key) => key);

  const body = hasHeader ? table.slice(1) : table;
  // +1 for 1-based lines, +1 more when a header was consumed.
  const lineOffset = hasHeader ? 2 : 1;

  // Shirt numbers already taken, both inside the file and by the current squad,
  // so a clash surfaces in the preview rather than at import time.
  const seen = new Set(
    existingRoster.map((player) => `${player.teamId}:${player.shirtNumber}`),
  );

  body.forEach((cells, index) => {
    const line = index + lineOffset;
    const raw: Record<string, string> = {};

    columns.forEach((key, column) => {
      if (key) {
        raw[key] = (cells[column] ?? "").trim();
      }
    });

    const name = raw.name ?? "";
    const jerseyName = raw.jerseyName ?? "";
    const shirtNumber = Number(raw.shirtNumber);
    const teamId = Number(raw.teamId);
    const isCaptain = parseBoolean(raw.isCaptain ?? "");

    if (!name) {
      issues.push({ line, message: "Missing player name." });
      return;
    }
    if (!jerseyName) {
      issues.push({ line, message: `${name}: missing jersey name.` });
      return;
    }
    if (!Number.isInteger(shirtNumber) || shirtNumber < 1 || shirtNumber > 99) {
      issues.push({ line, message: `${name}: jersey number must be a whole number 1–99.` });
      return;
    }
    if (!validTeamIds.has(teamId)) {
      issues.push({ line, message: `${name}: team ${raw.teamId || "(blank)"} does not exist.` });
      return;
    }

    const key = `${teamId}:${shirtNumber}`;
    if (seen.has(key)) {
      issues.push({ line, message: `${name}: number ${shirtNumber} is already taken in this team.` });
      return;
    }
    seen.add(key);

    rows.push({ name, jerseyName, shirtNumber, isCaptain, teamId });
  });

  return { rows, issues };
}
