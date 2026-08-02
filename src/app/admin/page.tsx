import { notFound } from "next/navigation";
import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { LogoutButton } from "@/components/admin/logout-button";
import { PageHeading } from "@/components/league/page-heading";
import { ROUNDS, matchesByRoundFrom } from "@/data/league";
import { teams } from "@/data/mock";
import { isAdminSession } from "@/lib/admin-auth";
import { getMatchImageIndex, getMatches, getRoster } from "@/lib/server/league-data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Access itself is enforced by the session cookie in src/proxy.ts — an
  // unauthenticated request never reaches this component. This flag only hides
  // the workspace entirely if the feature is switched off.
  if (!isAdminSession()) {
    notFound();
  }

  const [roster, allMatches, imageIndex] = await Promise.all([
    getRoster(),
    getMatches(),
    getMatchImageIndex(),
  ]);
  const rounds = ROUNDS.map((round) => ({
    round,
    matches: matchesByRoundFrom(allMatches, round),
  }));

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading
        eyebrow="Admin · league management"
        title="Overall"
        accent="tab"
        aside={<LogoutButton />}
      />
      <AdminWorkspace
        teams={teams}
        roster={roster}
        rounds={rounds}
        matchImageIds={imageIndex}
      />
    </div>
  );
}
