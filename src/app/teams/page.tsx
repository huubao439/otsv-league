import Link from "next/link";
import { PageHeading } from "@/components/league/page-heading";
import { TeamLogo } from "@/components/league/team-logo";
import { standingsWithTeamsFrom } from "@/data/league";
import { teams } from "@/data/mock";
import { getMatches, getRoster } from "@/lib/server/league-data";

/**
 * Rank pill treatment from the design: gold for the leader, a soft brand tint
 * for the rest of the podium, and a plain outline below that.
 */
function rankPillClass(rank: number): string {
  if (rank === 1) {
    return "bg-[linear-gradient(120deg,oklch(0.9_0.15_92),oklch(0.78_0.16_68))] text-[oklch(0.27_0.07_60)] shadow-[0_8px_20px_-12px_oklch(0.8_0.16_85/0.9)]";
  }

  return rank <= 3
    ? "border border-[var(--border-strong)] bg-[image:var(--grad-soft)] text-foreground"
    : "border border-border text-[var(--faint)]";
}

const statLabel =
  "font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.12em] text-[var(--faint)]";
const statValue = "font-heading text-[20px] leading-none";

export default async function TeamsPage() {
  const [allMatches, roster] = await Promise.all([getMatches(), getRoster()]);
  const table = standingsWithTeamsFrom(allMatches, roster);
  const rankOf = (teamId: number) => table.findIndex((row) => row.teamId === teamId) + 1;

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading
        eyebrow={`${teams.length} departments · ${roster.length} players registered`}
        title="The"
        accent="teams"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const standing = table.find((row) => row.teamId === team.id);
          const rank = rankOf(team.id);
          const goalDifference = standing?.goalDifference ?? 0;

          return (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              data-testid={`team-card-${team.id}`}
              className="relative flex flex-col gap-4 overflow-hidden rounded-[22px] border border-border bg-[var(--surface)] py-5.5 pl-7 pr-5.5 shadow-[var(--shadow-soft)] transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-[var(--border-strong)]"
            >
              {/* Team-coloured rail down the leading edge */}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 top-0 w-1.5"
                style={{ background: team.gradient }}
              />
              {/* Soft colour bloom behind the crest */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-[30px] -top-10 h-[180px] w-[180px] rounded-full opacity-[0.34] blur-[28px]"
                style={{ background: team.gradient }}
              />
              {/* Oversized league position, bled off the top edge */}
              <span
                aria-hidden
                className="grad-text-inline pointer-events-none absolute -top-4 right-4 font-heading text-[104px] leading-none opacity-[0.16]"
                style={{ backgroundImage: team.gradient }}
              >
                {rank}
              </span>

              <span className="relative flex items-center justify-between gap-3">
                <TeamLogo
                  team={team}
                  size="card"
                  shape="squircle"
                  className="shadow-[0_10px_24px_-12px_oklch(0.15_0.04_335/0.9)]"
                />
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full py-1.5 pl-2.5 pr-3 text-[13px] font-extrabold leading-none ${rankPillClass(rank)}`}
                >
                  <span className="font-mono text-[9.5px] font-medium leading-none tracking-[0.1em] opacity-70">
                    POS
                  </span>
                  <span>#{rank}</span>
                </span>
              </span>

              <span className="relative flex flex-col gap-1.5">
                <span className="font-heading text-[27px] uppercase leading-none">{team.name}</span>
              </span>

              <span className="relative grid grid-cols-4 gap-2 border-t border-border pt-3.5">
                <span className="flex flex-col gap-1">
                  <span className={statValue}>{standing?.played ?? 0}</span>
                  <span className={statLabel}>Played</span>
                </span>
                <span className="flex flex-col gap-1">
                  <span className={statValue}>{standing?.won ?? 0}</span>
                  <span className={statLabel}>Won</span>
                </span>
                <span className="flex flex-col gap-1">
                  <span className={statValue}>
                    {goalDifference > 0 ? `+${goalDifference}` : goalDifference}
                  </span>
                  <span className={statLabel}>GD</span>
                </span>
                <span className="flex flex-col gap-1">
                  <span className={`${statValue} grad-text`}>{standing?.points ?? 0}</span>
                  <span className={statLabel}>Points</span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
