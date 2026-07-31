import { notFound } from "next/navigation";
import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { PageHeading } from "@/components/league/page-heading";
import { ROUNDS, matchesByRoundFrom } from "@/data/league";
import { teams } from "@/data/mock";
import { isAdminSession } from "@/lib/admin-auth";
import { getMatches, getRoster } from "@/lib/server/league-data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Gate the route itself, not just the navbar link, so typing /admin while
  // logged out renders nothing. See src/lib/admin-auth.ts.
  if (!isAdminSession()) {
    notFound();
  }

  const [roster, allMatches] = await Promise.all([getRoster(), getMatches()]);
  const rounds = ROUNDS.map((round) => ({
    round,
    matches: matchesByRoundFrom(allMatches, round),
  }));

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading eyebrow="Admin · league management" title="Overall" accent="tab" />
      <AdminWorkspace teams={teams} roster={roster} rounds={rounds} />
    </div>
  );
}
