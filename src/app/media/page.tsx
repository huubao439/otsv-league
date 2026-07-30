import { PlayCircle } from "lucide-react";
import { SectionHeading } from "@/components/league/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmbedUrl, getTeamById } from "@/data/league";
import { matches } from "@/data/mock";

export default function MediaPage() {
  const finishedMatches = matches
    .filter((match) => match.status === "finished" && match.videoHighlightUrl)
    .slice(0, 9);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-up">
      <SectionHeading
        title="Media Highlights"
        description="Video highlight collection from completed matchdays."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {finishedMatches.map((match) => {
          const home = getTeamById(match.homeTeamId);
          const away = getTeamById(match.awayTeamId);
          const embedUrl = getEmbedUrl(match.videoHighlightUrl);

          return (
            <Card key={match.id} className="border-border/70 bg-card/85 shadow-[0_12px_34px_rgba(15,23,42,0.06)] dark:bg-card/75 dark:shadow-none">
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-base">
                  <PlayCircle className="h-5 w-5 text-emerald-600 dark:text-lime-300" />
                  Week {match.matchWeek}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 wrap-break-word text-sm text-muted-foreground">
                  {home?.shortName} {match.homeScore} - {match.awayScore} {away?.shortName}
                </p>
                {embedUrl ? (
                  <div className="overflow-hidden rounded-lg border border-border/70">
                    <iframe
                      className="aspect-video w-full"
                      src={embedUrl}
                      title={`Match ${match.id} highlight`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/70 bg-background/50 p-6 text-center text-sm text-muted-foreground">
                    Highlight is coming soon.
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
