import { notFound } from "next/navigation";
import { Shield, Shirt, Trophy } from "lucide-react";
import { SectionHeading } from "@/components/league/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStandingsWithTeams, getTeamById, getTeamPlayers, getTeamStanding } from "@/data/league";

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

  const standing = getTeamStanding(teamId);
  const ranking = getStandingsWithTeams().findIndex((row) => row.teamId === teamId) + 1;
  const roster = getTeamPlayers(teamId);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-up">
      <SectionHeading
        title={team.name}
        description={`Team profile and player roster for ${team.shortName}.`}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border/70 bg-card/85 shadow-[0_12px_34px_rgba(15,23,42,0.06)] dark:bg-card/75 dark:shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-xl uppercase tracking-wide">Team Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              Code: <span className="font-semibold text-foreground">{team.shortName}</span>
            </p>
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              Current Ranking: <span className="font-semibold text-emerald-700 dark:text-lime-300">#{ranking}</span>
            </p>
            <div className="pt-1">
              <Badge variant="outline" className="border-border/70 bg-background/70">
                Color Identity
              </Badge>
              <span
                className="ml-2 inline-block h-3.5 w-12 rounded-full align-middle"
                style={{ backgroundColor: team.colorCode }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/85 shadow-[0_12px_34px_rgba(15,23,42,0.06)] dark:bg-card/75 dark:shadow-none">
          <CardHeader>
            <CardTitle className="font-heading text-xl uppercase tracking-wide">Standing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {standing ? (
              <>
                <p>P: <span className="font-semibold">{standing.played}</span></p>
                <p>W: <span className="font-semibold">{standing.won}</span></p>
                <p>D: <span className="font-semibold">{standing.drawn}</span></p>
                <p>L: <span className="font-semibold">{standing.lost}</span></p>
                <p>GF: <span className="font-semibold">{standing.goalsFor}</span></p>
                <p>GA: <span className="font-semibold">{standing.goalsAgainst}</span></p>
                <p>GD: <span className="font-semibold">{standing.goalDifference}</span></p>
                <p>Pts: <span className="font-semibold text-emerald-700 dark:text-lime-300">{standing.points}</span></p>
              </>
            ) : (
              <p className="text-muted-foreground">No standing data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/70 bg-card/85 shadow-[0_12px_34px_rgba(15,23,42,0.06)] dark:bg-card/75 dark:shadow-none animate-fade-up-delayed">
        <CardHeader>
          <CardTitle className="font-heading text-xl uppercase tracking-wide">Player Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-center">Goals</TableHead>
                <TableHead className="text-center">Assists</TableHead>
                <TableHead className="hidden text-center sm:table-cell">YC</TableHead>
                <TableHead className="hidden text-center sm:table-cell">RC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster.map((player) => (
                <TableRow key={player.id}>
                  <TableCell className="font-semibold text-muted-foreground">{player.shirtNumber}</TableCell>
                  <TableCell>
                    <p className="inline-flex items-center gap-2 font-medium text-foreground">
                      <Shirt className="h-4 w-4 text-muted-foreground" />
                      {player.name}
                    </p>
                  </TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell className="text-center">{player.goals}</TableCell>
                  <TableCell className="text-center">{player.assists}</TableCell>
                  <TableCell className="hidden text-center sm:table-cell">{player.yellowCards}</TableCell>
                  <TableCell className="hidden text-center sm:table-cell">{player.redCards}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
