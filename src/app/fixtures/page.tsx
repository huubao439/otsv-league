"use client";

import { CalendarClock } from "lucide-react";
import { MatchStatusBadge } from "@/components/league/match-status-badge";
import { SectionHeading } from "@/components/league/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MATCH_WEEKS, formatKickoff, getMatchesByWeek } from "@/data/league";

export default function FixturesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-up">
      <SectionHeading
        title="Fixtures & Results"
        description="Matches grouped by matchweek (Vong dau) with score and kickoff time."
      />

      <Tabs defaultValue="week-1" className="gap-4">
        <div className="overflow-x-auto pb-1">
          <TabsList data-testid="fixtures-week-tabs" className="h-auto w-max flex-nowrap bg-card/85 p-2 dark:bg-card/70">
          {MATCH_WEEKS.map((week) => (
            <TabsTrigger
              key={week}
              value={`week-${week}`}
              data-testid={`week-tab-${week}`}
              className="px-3 py-1 text-xs sm:text-sm"
            >
              Week {week}
            </TabsTrigger>
          ))}
          </TabsList>
        </div>

        {MATCH_WEEKS.map((week) => {
          const weekMatches = getMatchesByWeek(week);

          return (
            <TabsContent key={week} value={`week-${week}`}>
              <Card className="border-border/70 bg-card/85 shadow-[0_12px_34px_rgba(15,23,42,0.06)] dark:bg-card/70 dark:shadow-none">
                <CardHeader>
                  <CardTitle className="font-heading text-xl uppercase tracking-wide">Matchweek {week}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {weekMatches.map((match, index) => (
                    <div key={match.id} className="rounded-lg border border-border/70 bg-background/70 p-4 dark:bg-background/60 animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <MatchStatusBadge status={match.status} />
                        <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarClock className="h-3.5 w-3.5" />
                          {formatKickoff(match.date, match.time)}
                        </p>
                      </div>

                      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
                        <div className="min-w-0 text-right">
                          <p className="truncate text-sm font-semibold text-foreground sm:text-base">{match.homeTeam.name}</p>
                          <p className="text-xs text-muted-foreground">{match.homeTeam.shortName}</p>
                        </div>
                        <div className="min-w-16 rounded-lg bg-card px-2 py-1.5 text-center font-heading text-base font-bold text-foreground sm:min-w-20 sm:px-3 sm:py-2 sm:text-xl">
                          {match.homeScore === null || match.awayScore === null
                            ? "vs"
                            : `${match.homeScore} - ${match.awayScore}`}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground sm:text-base">{match.awayTeam.name}</p>
                          <p className="text-xs text-muted-foreground">{match.awayTeam.shortName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
