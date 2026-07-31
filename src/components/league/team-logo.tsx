"use client";

import { useTeamLogoSrc } from "@/components/league/team-logo-provider";
import { type Team } from "@/lib/types";

const sizes = {
  xs: { box: "h-5 w-5", text: "text-[8px]" },
  sm: { box: "h-6.5 w-6.5", text: "text-[9px]" },
  md: { box: "h-7 w-7", text: "text-[9.5px]" },
  ml: { box: "h-8 w-8", text: "text-[11px]" },
  lg: { box: "h-[38px] w-[38px]", text: "text-[12px]" },
  /** Standings and fixtures rows. */
  row: { box: "h-10 w-10", text: "text-[13px]" },
  xl: { box: "h-13 w-13", text: "text-[17px]" },
  hero: { box: "h-20 w-20", text: "text-[26px]" },
} as const;

/** "D.A.F" → "DAF", "CHORUS FC" → "CF", "Integration" → "IN". */
function initials(name: string): string {
  const words = name.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** Perceived lightness, so pale crests get dark lettering instead of white. */
function isLight(hex: string): boolean {
  const value = hex.replace("#", "");
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.6;
}

/**
 * Team crest. Uses public/team-logos/<team id>.png when that file exists,
 * otherwise a placeholder in the club colour with the team's initials.
 */
export function TeamLogo({
  team,
  size = "md",
  roundedImage = true,
  className = "",
}: {
  team: Team;
  size?: keyof typeof sizes;
  /** Set false to show the artwork uncropped instead of clipped to a circle. */
  roundedImage?: boolean;
  className?: string;
}) {
  const logoSrc = useTeamLogoSrc(team.id);

  if (logoSrc) {
    return (
      // Plain <img>: the src carries a cache-busting query and the file is
      // dropped in by hand, so next/image's build-time optimisation adds nothing.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoSrc}
        alt=""
        aria-hidden
        className={`shrink-0 object-contain ${roundedImage ? "rounded-full" : ""} ${sizes[size].box} ${className}`}
      />
    );
  }

  const light = isLight(team.colorCode);

  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full font-heading leading-none tracking-[0.02em] ${sizes[size].box} ${sizes[size].text} ${className}`}
      style={{
        background: team.gradient,
        color: light ? "#1b1420" : "#ffffff",
        boxShadow: `inset 0 0 0 1.5px ${light ? "oklch(0.2 0.04 338 / 0.3)" : "oklch(1 0 0 / 0.45)"}`,
      }}
    >
      {initials(team.name)}
    </span>
  );
}
