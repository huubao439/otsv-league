import { FixturesBoard } from "@/components/league/fixtures-board";
import { ROUNDS, matchesByRoundFrom } from "@/data/league";
import { getMatches } from "@/lib/server/league-data";

export const dynamic = "force-dynamic";

export default async function FixturesPage() {
  const allMatches = await getMatches();
  const rounds = ROUNDS.map((round) => ({
    round,
    matches: matchesByRoundFrom(allMatches, round),
  }));

  return <FixturesBoard rounds={rounds} />;
}
