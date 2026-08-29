"use client";

import { isLight } from "@/components/league/team-logo";
import { useTeamLogoSrc } from "@/components/league/team-logo-provider";
import { type Team } from "@/lib/types";

/**
 * The oversized crest tile in the champion badge. Unlike TeamLogo it always
 * paints the club gradient behind the mark — the design's crest is a solid
 * coloured tile ringed in gold, and an uploaded logo sits inside it rather than
 * replacing it.
 */
export function ChampionCrest({ team }: { team: Team }) {
  const logoSrc = useTeamLogoSrc(team.id);

  return (
    <span
      aria-hidden
      className="grid h-[84px] w-[84px] shrink-0 place-items-center rounded-[24px] sm:h-[104px] sm:w-[104px] sm:rounded-[28px] lg:h-30 lg:w-30 lg:rounded-[34px]"
      style={{
        background: team.gradient,
        boxShadow:
          "0 0 0 4px var(--champ-ring), 0 26px 50px -22px oklch(0.1 0.03 335 / 0.55)",
      }}
    >
      {logoSrc ? (
        // Hand-dropped file with a cache-busting query — next/image adds nothing.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt="" className="h-[70%] w-[70%] object-contain" />
      ) : (
        <span
          className="font-heading text-[24px] leading-none tracking-[0.04em] sm:text-[29px] lg:text-[34px]"
          style={{ color: isLight(team.colorCode) ? "#1b1420" : "#ffffff" }}
        >
          {team.abbr}
        </span>
      )}
    </span>
  );
}
