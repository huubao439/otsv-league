import { Trophy } from "lucide-react";
import { SectionHeading } from "@/components/league/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStandingsWithTeams } from "@/data/league";

export default function StandingsPage() {
  const rows = getStandingsWithTeams();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-up">
      <SectionHeading
        title="Standings"
        description="Full league table with 6 teams in a double round-robin season."
      />

      <div className="space-y-3 md:hidden">
        {rows.map((row, index) => {
          const champion = index === 0;

          return (
            <Card key={row.teamId} className={`border-border/70 bg-card/90 dark:bg-card/75 ${champion ? "ring-1 ring-emerald-500/40" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Pos #{index + 1}</p>
                    <p className="mt-1 inline-flex items-center gap-2 font-semibold text-foreground">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: row.team.colorCode }} />
                      <span className="truncate">{row.team.name}</span>
                      {champion ? <Trophy className="h-4 w-4 text-emerald-600 dark:text-lime-400" /> : null}
                    </p>
                  </div>
                  <p className="rounded-md bg-emerald-500/10 px-2 py-1 text-sm font-bold text-emerald-700 dark:text-lime-300">{row.points} pts</p>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                  <p className="rounded-md bg-background/70 p-2">P<br /><span className="font-semibold text-sm">{row.played}</span></p>
                  <p className="rounded-md bg-background/70 p-2">W<br /><span className="font-semibold text-sm">{row.won}</span></p>
                  <p className="rounded-md bg-background/70 p-2">D<br /><span className="font-semibold text-sm">{row.drawn}</span></p>
                  <p className="rounded-md bg-background/70 p-2">L<br /><span className="font-semibold text-sm">{row.lost}</span></p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="hidden border-border/70 bg-card/85 shadow-[0_12px_36px_rgba(15,23,42,0.06)] dark:bg-card/75 dark:shadow-none md:block">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Pos</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">P</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">D</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">GF</TableHead>
                <TableHead className="text-center">GA</TableHead>
                <TableHead className="text-center">GD</TableHead>
                <TableHead className="text-right">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => {
                const champion = index === 0;

                return (
                  <TableRow key={row.teamId} className={champion ? "bg-emerald-500/10 dark:bg-lime-400/10" : undefined}>
                    <TableCell className="font-semibold text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: row.team.colorCode }}
                        />
                        <span className="font-medium text-foreground">{row.team.name}</span>
                        {champion ? <Trophy className="h-4 w-4 text-emerald-600 dark:text-lime-400" /> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{row.played}</TableCell>
                    <TableCell className="text-center">{row.won}</TableCell>
                    <TableCell className="text-center">{row.drawn}</TableCell>
                    <TableCell className="text-center">{row.lost}</TableCell>
                    <TableCell className="text-center">{row.goalsFor}</TableCell>
                    <TableCell className="text-center">{row.goalsAgainst}</TableCell>
                    <TableCell className="text-center">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</TableCell>
                    <TableCell className="text-right font-bold text-emerald-700 dark:text-lime-300">{row.points}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
