import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { SectionHeading } from "@/components/league/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teams } from "@/data/mock";

export default function TeamsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-up">
      <SectionHeading
        title="Teams"
        description="All 6 participating teams in OTSV League."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className="border-border/70 bg-card/85 shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-0.5 dark:bg-card/70 dark:shadow-none dark:hover:translate-y-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{team.name}</span>
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: team.colorCode }}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Code: {team.shortName}
              </p>
              <Link
                href={`/teams/${team.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-white dark:bg-background/70 dark:hover:bg-card"
              >
                Team Detail
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
