import Link from "next/link";
import { PageHeading } from "@/components/league/page-heading";
import { TeamLogo } from "@/components/league/team-logo";
import { getStandingsWithTeams } from "@/data/league";
import { teams } from "@/data/mock";

export default function TeamsPage() {
  const table = getStandingsWithTeams();
  const rankOf = (teamId: number) => table.findIndex((row) => row.teamId === teamId) + 1;

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading
        eyebrow={`${teams.length} departments · OTSV Football League 2026`}
        title="The"
        accent="teams"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const standing = table.find((row) => row.teamId === team.id);

          return (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="group overflow-hidden rounded-[20px] border border-border bg-[var(--surface)] shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
            >
              <span className="block h-24" style={{ background: team.gradient }} />
              <span className="-mt-8.5 flex flex-col gap-2.5 px-5 pb-5 pt-4.5">
                <TeamLogo team={team} size="xl" className="border-[3px] border-[var(--bg)]" />
                <span className="font-heading text-2xl uppercase leading-none">{team.name}</span>
                <span className="text-[12.5px] font-semibold leading-[1.3] text-muted-foreground">
                  {team.department} · Position {rankOf(team.id)}
                </span>
                <span className="mt-1 flex flex-wrap gap-3.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
                  <span>P {standing?.played ?? 0}</span>
                  <span>W {standing?.won ?? 0}</span>
                  <span>
                    GD{" "}
                    {standing && standing.goalDifference > 0
                      ? `+${standing.goalDifference}`
                      : (standing?.goalDifference ?? 0)}
                  </span>
                  <span>PTS {standing?.points ?? 0}</span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
