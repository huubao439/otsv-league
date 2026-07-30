import { ArrowRight, CalendarClock } from "lucide-react";
import Link from "next/link";
import { MatchStatusBadge } from "@/components/league/match-status-badge";
import { SectionHeading } from "@/components/league/section-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  formatKickoff,
  getLatestResults,
  getStandingsWithTeams,
  getUpcomingFixtures,
} from "@/data/league";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  const quickTable = getStandingsWithTeams();
  const latestResults = getLatestResults(3);
  const upcomingFixtures = getUpcomingFixtures(4);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-up">
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-r from-emerald-50 via-white to-orange-50 p-8 shadow-[0_24px_70px_rgba(16,24,40,0.12)] sm:p-10 dark:border-border/70 dark:bg-linear-to-r dark:from-zinc-950 dark:via-slate-900 dark:to-zinc-900 dark:shadow-none">
        <div className="absolute -left-24 -top-16 h-56 w-56 rounded-full bg-lime-500/20 blur-3xl dark:bg-lime-400/25" />
        <div className="absolute -bottom-16 right-0 h-56 w-56 rounded-full bg-orange-500/18 blur-3xl dark:bg-orange-500/20" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_38%)] dark:hidden" />
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-700 dark:text-lime-300">OTSV Corporate Championship</p>
          <h1 className="mt-2 max-w-3xl font-heading text-4xl font-bold uppercase tracking-wide text-slate-900 sm:text-6xl dark:text-white">
            OTSV League
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-zinc-300">
            Six teams. Ten matchweeks. One champion. Follow standings, fixtures, stats, and media highlights in real time.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/standings"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(5,150,105,0.28)] transition hover:bg-emerald-500 dark:bg-lime-400 dark:text-zinc-900 dark:shadow-none dark:hover:bg-lime-300"
            >
              League Table
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/fixtures"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 px-5 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white dark:border-zinc-600 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Fixtures & Results
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-2 animate-fade-up-delayed">
        <Card className="border-border/70 bg-card/85 shadow-[0_12px_36px_rgba(15,23,42,0.06)] dark:bg-card/75 dark:shadow-none">
          <CardHeader>
            <SectionHeading title="Quick Standings" description="Full 6-team compact table." />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">Pos</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">P</TableHead>
                  <TableHead className="hidden text-center sm:table-cell">GD</TableHead>
                  <TableHead className="text-right">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quickTable.map((row, index) => (
                  <TableRow key={row.teamId} className={index === 0 ? "bg-emerald-500/10 dark:bg-lime-400/10" : undefined}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.team.colorCode }} />
                        <span className="truncate">{row.team.shortName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{row.played}</TableCell>
                    <TableCell className="hidden text-center sm:table-cell">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</TableCell>
                    <TableCell className="text-right font-bold text-emerald-700 dark:text-lime-300">{row.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/85 shadow-[0_12px_36px_rgba(15,23,42,0.06)] dark:bg-card/75 dark:shadow-none">
          <CardHeader>
            <SectionHeading title="Latest Results" description="Most recent completed matches." />
          </CardHeader>
          <CardContent className="space-y-3">
            {latestResults.map((match) => (
              <div key={match.id} className="rounded-lg border border-border/70 bg-background/60 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <MatchStatusBadge status={match.status} />
                  <p className="text-xs text-muted-foreground">{formatKickoff(match.date, match.time)}</p>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-sm">
                  <p className="truncate text-right font-medium text-foreground">{match.homeTeam.shortName}</p>
                  <p className="rounded-md bg-card px-2 py-1 font-heading text-lg font-bold text-foreground">
                    {match.homeScore} - {match.awayScore}
                  </p>
                  <p className="truncate font-medium text-foreground">{match.awayTeam.shortName}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 animate-fade-up-more">
        <SectionHeading title="Upcoming Fixtures" description="Next kickoff windows including live status." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {upcomingFixtures.map((match) => (
            <Card key={match.id} className="border-border/70 bg-card/85 shadow-[0_10px_28px_rgba(15,23,42,0.05)] dark:bg-card/75 dark:shadow-none">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {formatKickoff(match.date, match.time)}
                  </p>
                  <MatchStatusBadge status={match.status} />
                </div>
                <p className="font-semibold text-foreground">
                  {match.homeTeam.name} <span className="text-muted-foreground">vs</span> {match.awayTeam.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Week {match.matchWeek}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
