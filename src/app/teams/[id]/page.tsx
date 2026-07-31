import Link from "next/link";
import { notFound } from "next/navigation";
import { FormGuide } from "@/components/league/form-guide";
import { MatchStatusBadge } from "@/components/league/match-status-badge";
import { SectionHeading } from "@/components/league/section-heading";
import { SquadTable } from "@/components/league/squad-table";
import { TeamLogo } from "@/components/league/team-logo";
import {
  formatKickoff,
  getTeamById,
  standingsWithTeamsFrom,
  teamFormFrom,
  withTeams,
} from "@/data/league";
import { teams } from "@/data/mock";
import { getMatches, getRoster } from "@/lib/server/league-data";

/** Prerender all six team pages so they are prefetchable like the rest. */
export function generateStaticParams() {
  return teams.map((team) => ({ id: String(team.id) }));
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teamId = Number(id);

  if (Number.isNaN(teamId)) {
    notFound();
  }

  const team = getTeamById(teamId);
  if (!team) {
    notFound();
  }

  const allMatches = await getMatches();
  const table = standingsWithTeamsFrom(allMatches);
  const standing = table.find((row) => row.teamId === teamId);
  const ranking = table.findIndex((row) => row.teamId === teamId) + 1;
  const roster = (await getRoster())
    .filter((player) => player.teamId === teamId)
    .sort((a, b) => a.shirtNumber - b.shirtNumber);
  const fixtures = allMatches
    .filter((match) => match.homeTeamId === teamId || match.awayTeamId === teamId)
    .sort((a, b) => a.round - b.round || `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .map(withTeams);
  const form = teamFormFrom(allMatches, teamId);
  const cleanSheets = fixtures.filter(
    (match) =>
      match.status === "finished" &&
      (match.homeTeamId === teamId ? match.awayScore : match.homeScore) === 0,
  ).length;
  const cards = roster.reduce((total, player) => total + player.yellowCards + player.redCards, 0);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 py-7 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <Link
        href="/teams"
        className="self-start rounded-full border border-border bg-[var(--surface)] px-3.5 py-2.5 text-[12.5px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
      >
        ← All teams
      </Link>

      <section className="relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
        <div className="absolute inset-0" style={{ background: team.gradient }} />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,oklch(0.14_0.03_335/0.72),oklch(0.14_0.03_335/0.15))]" />
        <div className="relative flex flex-wrap items-end justify-between gap-6 p-7 text-white sm:p-9">
          <div className="flex min-w-0 items-end gap-5">
            <TeamLogo
              team={team}
              size="hero"
              className="mb-1 shadow-[0_10px_28px_-12px_oklch(0.1_0.03_335/0.9)] ring-2 ring-white/35"
            />
            <div className="flex min-w-0 flex-col gap-3">
              <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-white/80">
                {team.department} · Position {ranking}
              </span>
              <h1 className="m-0 font-heading text-4xl uppercase leading-[0.94] sm:text-5xl lg:text-[62px]">
                {team.name}
              </h1>
              <span className="flex items-center gap-3 text-[13.5px] font-semibold leading-none text-white/85">
                Recent form
                <FormGuide form={form} />
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {[
              { value: standing?.played ?? 0, label: "Played" },
              {
                value:
                  standing && standing.goalDifference > 0
                    ? `+${standing.goalDifference}`
                    : (standing?.goalDifference ?? 0),
                label: "GD",
              },
              { value: standing?.points ?? 0, label: "Points", highlight: true },
            ].map((stat) => (
              <span
                key={stat.label}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border px-5 py-3.5 ${
                  stat.highlight
                    ? "border-white/30 bg-white/15"
                    : "border-white/20 bg-[oklch(0.14_0.03_335/0.4)]"
                }`}
              >
                <span className="font-heading text-[26px] leading-none">{stat.value}</span>
                <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-white/75">
                  {stat.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[22px] border border-border bg-[var(--surface)] shadow-[var(--shadow-soft)]">
          <div className="border-b border-border px-6 pb-4 pt-5">
            <SectionHeading title="Season fixtures" description="Every match, in round order." />
          </div>
          {fixtures.map((match) => {
            const home = match.homeTeamId === teamId;
            const opponent = home ? match.awayTeam : match.homeTeam;

            return (
              <div
                key={match.id}
                className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3.5 border-b border-border px-6 py-3.5 transition-colors last:border-b-0 hover:bg-[var(--surface-2)]"
              >
                <span className="font-mono text-[10.5px] font-medium leading-none tracking-[0.12em] text-[var(--faint)]">
                  R{match.round}
                </span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <TeamLogo team={opponent} size="sm" />
                  <span className="truncate text-[13.5px] font-extrabold leading-tight">
                    {home ? "vs " : "away to "}
                    {opponent.name}
                  </span>
                </span>
                <span className="flex items-center gap-2.5">
                  {match.status === "finished" ? (
                    <span className="rounded-lg border border-border px-2.5 py-1.5 font-heading text-sm leading-none">
                      {home
                        ? `${match.homeScore} - ${match.awayScore}`
                        : `${match.awayScore} - ${match.homeScore}`}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold leading-none text-muted-foreground">
                      {formatKickoff(match.date, match.time)}
                    </span>
                  )}
                  <MatchStatusBadge status={match.status} />
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 rounded-[22px] border border-border bg-[image:var(--grad-soft)] p-5.5">
            {[
              { value: standing?.goalsFor ?? 0, label: "Goals for" },
              { value: standing?.goalsAgainst ?? 0, label: "Goals against" },
              { value: cleanSheets, label: "Clean sheets" },
              { value: cards, label: "Cards" },
            ].map((stat) => (
              <span key={stat.label} className="flex flex-col gap-1.5">
                <span className="font-heading text-[26px] leading-none">{stat.value}</span>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--faint)]">
                  {stat.label}
                </span>
              </span>
            ))}
          </div>

          <SquadTable roster={roster} />
        </div>
      </div>
    </div>
  );
}
