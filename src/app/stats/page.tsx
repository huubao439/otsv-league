import { Crown, Goal, HandHelping } from "lucide-react";
import { SectionHeading } from "@/components/league/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTeamById, getTopAssists, getTopScorers } from "@/data/league";

export default function StatsPage() {
  const topScorers = getTopScorers(10);
  const topAssists = getTopAssists(10);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-up">
      <SectionHeading
        title="Statistics"
        description="Top scorers (Vua pha luoi) and top assists (Vua kien tao)."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/85 shadow-[0_12px_34px_rgba(15,23,42,0.06)] dark:bg-card/75 dark:shadow-none">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 font-heading text-xl uppercase tracking-wide">
              <Goal className="h-5 w-5 text-orange-600 dark:text-orange-300" />
              Top Scorers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="hidden sm:table-cell">Team</TableHead>
                  <TableHead className="text-right">Goals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topScorers.map((player, index) => {
                  const team = getTeamById(player.teamId);

                  return (
                    <TableRow key={player.id}>
                      <TableCell className="font-semibold text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="max-w-30 truncate font-medium text-foreground sm:max-w-none">{player.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{team?.shortName}</TableCell>
                      <TableCell className="text-right font-bold text-orange-700 dark:text-orange-200">
                        {index === 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <Crown className="h-4 w-4 text-yellow-500 dark:text-yellow-300" />
                            {player.goals}
                          </span>
                        ) : (
                          player.goals
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/85 shadow-[0_12px_34px_rgba(15,23,42,0.06)] dark:bg-card/75 dark:shadow-none">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 font-heading text-xl uppercase tracking-wide">
              <HandHelping className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
              Top Assists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="hidden sm:table-cell">Team</TableHead>
                  <TableHead className="text-right">Assists</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topAssists.map((player, index) => {
                  const team = getTeamById(player.teamId);

                  return (
                    <TableRow key={player.id}>
                      <TableCell className="font-semibold text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="max-w-30 truncate font-medium text-foreground sm:max-w-none">{player.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{team?.shortName}</TableCell>
                      <TableCell className="text-right font-bold text-cyan-700 dark:text-cyan-200">{player.assists}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
