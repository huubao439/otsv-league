"use client";

import { type ReactNode, createContext, useContext } from "react";
import { type TeamLogoMap } from "@/lib/team-logos.server";

const TeamLogoContext = createContext<TeamLogoMap>({});

/**
 * Carries the crest URLs discovered on the server (public/team-logos) down to
 * the client components that render them.
 */
export function TeamLogoProvider({
  logos,
  children,
}: {
  logos: TeamLogoMap;
  children: ReactNode;
}) {
  return <TeamLogoContext.Provider value={logos}>{children}</TeamLogoContext.Provider>;
}

/** Public URL of a team's uploaded crest, or undefined when none exists. */
export function useTeamLogoSrc(teamId: number): string | undefined {
  return useContext(TeamLogoContext)[teamId];
}
