import Link from "next/link";
import { Countdown } from "@/components/league/countdown";
import { TeamLogo } from "@/components/league/team-logo";
import { type MatchWithTeams, type StandingWithTeam } from "@/data/league";

/** "2026-08-17" → "Mon 17 Aug". Deterministic (UTC), so no hydration drift. */
function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getUTCDay()];
  const month = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ][m - 1];

  return `${weekday} ${d} ${month}`;
}

/**
 * Purpose-built mobile home from the mobile design — a compact card stack that
 * fits the fold, rather than the desktop hero + full tables. Rendered only
 * below `md`; the desktop layout stays untouched behind `md:flex`.
 */
export function MobileHome({
  opener,
  nextRound,
  kickoffIso,
  roundFixtures,
  topTeams,
  progress,
  progressPct,
  totalTeams,
  totalRounds,
}: {
  opener?: MatchWithTeams;
  nextRound?: number;
  kickoffIso: string | null;
  roundFixtures: MatchWithTeams[];
  topTeams: StandingWithTeam[];
  progress: { played: number; total: number };
  progressPct: number;
  totalTeams: number;
  totalRounds: number;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const tiles = [
    { value: pad(totalTeams), label: "Teams" },
    { value: pad(totalRounds), label: "Rounds" },
    { value: pad(progress.played), label: "Played" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-3.5 px-4 py-4 animate-fade-up md:hidden">
      {/* Hero card */}
      <section className="relative overflow-hidden rounded-[22px] bg-[image:var(--grad)] p-4 text-white shadow-[0_20px_40px_-24px_oklch(0.4_0.2_340/0.9)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_88%_8%,oklch(1_0_0/0.22),transparent_60%)]"
        />
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center justify-between font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-white/80">
            <span className="rounded-md border border-white/25 bg-white/15 px-2 py-1.5">
              Season 2026
            </span>
            <span>Round {nextRound ?? "—"}</span>
          </div>

          <h1 className="m-0 font-heading text-[31px] uppercase leading-[0.92]">
            OTSV Football
            <br />
            League 2026
          </h1>

          {opener ? (
            <div className="flex flex-col gap-3 rounded-[16px] border border-white/20 bg-[oklch(0.14_0.03_335/0.42)] p-3.5">
              <div className="flex items-center justify-between font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-white/70">
                <span>Opening match</span>
                <span>
                  {kickoffIso ? shortDate(opener.date) : ""} · {opener.time}
                  {opener.pitch ? ` · Pitch ${opener.pitch}` : ""}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <span className="flex flex-col items-center gap-1.5">
                  <TeamLogo team={opener.homeTeam} size="lg" shape="squircle" />
                  <span className="text-center text-[12px] font-extrabold leading-tight">
                    {opener.homeTeam.name}
                  </span>
                </span>
                <span className="font-heading text-[14px] tracking-[0.08em] text-white/70">VS</span>
                <span className="flex flex-col items-center gap-1.5">
                  <TeamLogo team={opener.awayTeam} size="lg" shape="squircle" />
                  <span className="text-center text-[12px] font-extrabold leading-tight">
                    {opener.awayTeam.name}
                  </span>
                </span>
              </div>
              {kickoffIso ? (
                <div className="flex items-center justify-center gap-2.5 rounded-[13px] border border-white/15 bg-white/10 p-2.5">
                  <span className="whitespace-nowrap font-heading text-[24px] tracking-[0.04em]">
                    <Countdown kickoffIso={kickoffIso} />
                  </span>
                  <span className="font-mono text-[8.5px] font-medium uppercase leading-[1.25] tracking-[0.12em] text-white/70">
                    until
                    <br />
                    kickoff
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[10.5px] font-semibold leading-none text-white/80">
              <span>Season progress</span>
              <span>
                {progress.played} / {progress.total} matches
              </span>
            </div>
            <span className="block h-1.5 overflow-hidden rounded-full bg-white/15">
              <span
                className="block h-full rounded-full bg-[linear-gradient(90deg,#fff,oklch(0.9_0.14_88))]"
                style={{ width: `${progressPct}%` }}
              />
            </span>
          </div>
        </div>
      </section>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-2.5">
        {tiles.map((tile) => (
          <span
            key={tile.label}
            className="flex flex-col gap-1 rounded-[15px] border border-border bg-[var(--surface)] px-3 py-2.5"
          >
            <span className="font-heading text-[23px] leading-none">{tile.value}</span>
            <span className="font-mono text-[8.5px] font-medium uppercase leading-none tracking-[0.14em] text-[var(--faint)]">
              {tile.label}
            </span>
          </span>
        ))}
      </div>

      {/* Next round list */}
      {roundFixtures.length ? (
        <section className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="flex items-baseline gap-2">
              <span className="font-heading text-[17px] uppercase leading-none">
                Round {nextRound}
              </span>
              {opener ? (
                <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
                  {shortDate(opener.date)}
                </span>
              ) : null}
            </span>
            <Link href="/fixtures" className="text-[11.5px] font-bold leading-none text-muted-foreground">
              All →
            </Link>
          </div>
          <div className="overflow-hidden rounded-[18px] border border-border bg-[var(--surface)]">
            {roundFixtures.map((match) => (
              <div
                key={match.id}
                className="flex items-center gap-2.5 border-b border-border px-3 py-2.5 last:border-b-0"
              >
                <span className="flex w-11 shrink-0 flex-col gap-1 font-mono leading-none tracking-[0.08em]">
                  <span className="text-[9.5px] font-bold text-foreground">{match.time}</span>
                  {match.pitch ? (
                    <span className="inline-flex w-fit items-center rounded bg-[image:var(--grad-soft)] px-1 py-0.5 text-[7.5px] font-bold text-[var(--pink)]">
                      {match.pitch}
                    </span>
                  ) : null}
                </span>
                <TeamLogo team={match.homeTeam} size="sm" shape="squircle" />
                <span className="min-w-0 flex-1 truncate text-[12px] font-extrabold leading-tight">
                  {match.homeTeam.name}
                </span>
                <span className="shrink-0 font-mono text-[9px] leading-none text-[var(--faint)]">vs</span>
                <span className="min-w-0 flex-1 truncate text-right text-[12px] font-extrabold leading-tight">
                  {match.awayTeam.name}
                </span>
                <TeamLogo team={match.awayTeam} size="sm" shape="squircle" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Top of the table */}
      {topTeams.length ? (
        <section className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-[17px] uppercase leading-none">Top of the table</span>
            <Link href="/standings" className="text-[11.5px] font-bold leading-none text-muted-foreground">
              Full →
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {topTeams.map((row, index) => {
              const leader = index === 0;

              return (
                <div
                  key={row.teamId}
                  className={`relative flex items-center gap-3 overflow-hidden rounded-[16px] border border-border p-2.5 ${
                    leader ? "bg-[image:var(--grad-gold-soft)]" : "bg-[var(--surface)]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute bottom-0 left-0 top-0 w-[3px] ${leader ? "bg-[image:var(--grad-gold)]" : ""}`}
                    style={leader ? undefined : { background: row.team.gradient }}
                  />
                  <span
                    className={`w-4 shrink-0 pl-0.5 font-heading text-[18px] leading-none ${
                      leader ? "text-[var(--gold)]" : "text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <TeamLogo team={row.team} size="ml" shape="squircle" />
                  <Link
                    href={`/teams/${row.teamId}`}
                    className="min-w-0 flex-1 truncate text-[13px] font-extrabold leading-tight text-foreground"
                  >
                    {row.team.name}
                  </Link>
                  <span className="shrink-0 font-mono text-[9.5px] leading-none text-[var(--faint)]">
                    P {row.played}
                  </span>
                  <span className="grad-text shrink-0 font-heading text-[22px] leading-none">
                    {row.points}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
