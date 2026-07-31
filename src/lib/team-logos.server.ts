import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const LOGO_DIR = join(process.cwd(), "public", "team-logos");

export type TeamLogoMap = Record<number, string>;

/**
 * Scans public/team-logos for crests named after a team id (1.png, 2.png, …)
 * and returns them as public URLs. The file's modified time is appended so a
 * replaced logo is not served from cache.
 *
 * Server-only: call this from a server component and hand the result to the
 * client tree via TeamLogoProvider.
 */
export function getTeamLogoMap(): TeamLogoMap {
  let entries: string[];

  try {
    entries = readdirSync(LOGO_DIR);
  } catch {
    // Folder missing (e.g. fresh checkout) — every team uses its placeholder.
    return {};
  }

  const logos: TeamLogoMap = {};

  for (const entry of entries) {
    const match = /^(\d+)\.png$/i.exec(entry);
    if (!match) {
      continue;
    }

    const teamId = Number(match[1]);

    try {
      const { mtimeMs } = statSync(join(LOGO_DIR, entry));
      logos[teamId] = `/team-logos/${entry}?v=${Math.round(mtimeMs)}`;
    } catch {
      // Removed between listing and stat — skip it.
    }
  }

  return logos;
}
