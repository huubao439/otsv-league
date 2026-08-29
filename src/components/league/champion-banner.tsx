import { ChampionCrest } from "@/components/league/champion-crest";
import { type Team } from "@/lib/types";

/**
 * Confetti and spark colours come from CSS variables rather than literals, so
 * the celebration re-tints itself for the light (pale gold) and dark (deep
 * plum) versions of the badge.
 */
const sparkPalette = ["var(--champ-spark-a)", "var(--champ-spark-b)", "var(--champ-spark-c)"];
const spark2Palette = [
  "var(--champ-spark2-a)",
  "var(--champ-spark2-b)",
  "var(--champ-spark2-c)",
];
const confettiPalette = [
  "var(--champ-confetti-a)",
  "var(--champ-confetti-b)",
  "var(--champ-confetti-c)",
  "var(--champ-confetti-d)",
];

/**
 * Particles fanned out evenly around a circle. Deterministic — no randomness —
 * so the server and client markup always agree.
 */
function spread(count: number, baseDelay: number, palette: string[]) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count;
    const radius = 92 + (index % 3) * 26;

    return {
      dx: `${Math.round(Math.cos(angle) * radius)}px`,
      dy: `${Math.round(Math.sin(angle) * radius)}px`,
      delay: `${(baseDelay + (index % 4) * 0.12).toFixed(2)}s`,
      color: palette[index % palette.length],
    };
  });
}

const sparks = spread(12, 0, sparkPalette);
const sparks2 = spread(10, 1.1, spark2Palette);
const confetti = Array.from({ length: 16 }, (_, index) => ({
  left: `${5 + index * 6}%`,
  delay: `${((index % 8) * 0.62).toFixed(2)}s`,
  color: confettiPalette[index % confettiPalette.length],
}));

/**
 * Champion badge for the home page: the winning team, a trophy, and the team
 * photo the admin uploaded. One component serves both breakpoints — the desktop
 * proportions from the design scale down to a single stacked column on mobile.
 *
 * `photoVersion` is the photo's `updatedAt`; it cache-busts the /champion-photo
 * route. `null` means no photo has been uploaded, and the photo block is left
 * out entirely rather than showing an empty placeholder to visitors.
 */
export function ChampionBanner({
  team,
  photoVersion,
  photoWidth,
  photoHeight,
  seasonComplete,
}: {
  team: Team;
  photoVersion: number | null;
  /** Pixel size of the stored photo, when it was recorded at upload time. */
  photoWidth?: number;
  photoHeight?: number;
  seasonComplete: boolean;
}) {
  return (
    <section
      aria-label={`Season 2026 champions: ${team.name}`}
      className="relative overflow-hidden rounded-[22px] border border-border bg-[image:var(--champ)] shadow-[var(--shadow-soft)] md:rounded-[28px]"
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[image:var(--champ-glow)]" />

      {/* Three expanding rings of light, offset in time so one is always going. */}
      <span
        aria-hidden
        className="animate-champ-burst pointer-events-none absolute left-[14%] top-[16%] -ml-[68px] -mt-[68px] h-[136px] w-[136px] rounded-full bg-[image:var(--champ-burst-1)] sm:-ml-[110px] sm:-mt-[110px] sm:h-[220px] sm:w-[220px]"
      />
      <span
        aria-hidden
        className="animate-champ-burst pointer-events-none absolute right-[22%] top-[26%] -mr-[56px] -mt-[56px] h-[112px] w-[112px] rounded-full bg-[image:var(--champ-burst-2)] [animation-delay:1.1s] sm:-mr-[90px] sm:-mt-[90px] sm:h-[180px] sm:w-[180px]"
      />
      <span
        aria-hidden
        className="animate-champ-burst pointer-events-none absolute left-[52%] top-[8%] -ml-[46px] -mt-[46px] h-[92px] w-[92px] rounded-full bg-[image:var(--champ-burst-3)] [animation-delay:2.2s] sm:-ml-[75px] sm:-mt-[75px] sm:h-[150px] sm:w-[150px]"
      />

      <span aria-hidden className="pointer-events-none absolute left-[14%] top-[16%]">
        {sparks.map((spark, index) => (
          <span
            key={index}
            className="animate-champ-spark absolute h-[5px] w-[5px] rounded-full"
            style={{
              background: spark.color,
              animationDelay: spark.delay,
              ["--dx" as string]: spark.dx,
              ["--dy" as string]: spark.dy,
            }}
          />
        ))}
      </span>
      <span aria-hidden className="pointer-events-none absolute right-[22%] top-[26%]">
        {sparks2.map((spark, index) => (
          <span
            key={index}
            className="animate-champ-spark absolute h-1 w-1 rounded-full"
            style={{
              background: spark.color,
              animationDelay: spark.delay,
              ["--dx" as string]: spark.dx,
              ["--dy" as string]: spark.dy,
            }}
          />
        ))}
      </span>

      {/* Confetti falls the height of the card, so the drop scales with it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden [--fall:340px] sm:[--fall:560px] lg:[--fall:820px]"
      >
        {confetti.map((strip, index) => (
          <span
            key={index}
            className="animate-champ-confetti absolute -top-5 h-[13px] w-[7px] rounded-[2px]"
            style={{ background: strip.color, left: strip.left, animationDelay: strip.delay }}
          />
        ))}
      </span>

      <div className="relative flex flex-col items-center gap-4.5 px-5 pb-8 pt-9 text-center text-[color:var(--champ-fg)] sm:gap-6 sm:px-10 sm:pb-11 sm:pt-14 lg:px-12 lg:pb-13 lg:pt-16">
        <span className="inline-flex items-center gap-2.5 rounded-full bg-[image:var(--champ-pill)] px-4 py-2.5 text-[10px] font-extrabold uppercase leading-none tracking-[0.18em] text-[color:var(--champ-pill-fg)] sm:px-4.5 sm:text-[11.5px]">
          Season 2026 · Champions
        </span>

        <span
          aria-hidden
          className="animate-champ-float text-[58px] leading-none drop-shadow-[0_18px_30px_oklch(0.2_0.06_60/0.55)] sm:text-[78px] lg:text-[96px]"
        >
          🏆
        </span>

        <div className="flex w-full flex-col items-center gap-3.5 sm:w-auto sm:flex-row sm:gap-6 lg:gap-6.5">
          <ChampionCrest team={team} />
          <div className="flex min-w-0 flex-col items-center gap-2 sm:items-start">
            <h2 className="champ-name m-0 max-w-full break-words font-heading text-[clamp(1.9rem,9vw,2.6rem)] uppercase leading-[0.9] tracking-[0.01em] sm:text-[clamp(2.6rem,7vw,3.75rem)] lg:text-[88px]">
              {team.name}
            </h2>
            <span className="text-[13px] font-semibold leading-tight text-[color:var(--champ-fg-soft)] sm:text-left sm:text-[15px]">
              {team.projects}
            </span>
          </div>
        </div>

        <p className="m-0 max-w-[46ch] text-[13.5px] font-semibold leading-[1.6] text-[color:var(--champ-fg-soft)] sm:text-[15.5px]">
          {seasonComplete
            ? "The OTSV Football League 2026 is complete. Congratulations to the champions."
            : "Congratulations to the champions of the OTSV Football League 2026."}
        </p>
      </div>

      {photoVersion !== null ? (
        <div className="relative flex flex-col gap-3 px-5 pb-6 sm:px-10 sm:pb-10">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[color:var(--champ-fg-faint)] sm:text-[10.5px]">
              Champion team photo
            </span>
            <span className="truncate text-[10.5px] font-semibold text-[color:var(--champ-fg-faint)] sm:text-[11.5px]">
              {team.name} · Season 2026
            </span>
          </div>
          <div className="relative w-full overflow-hidden rounded-[16px] border border-[color:var(--champ-line)] sm:rounded-[22px]">
            {/* Served by src/app/champion-photo/route.ts, versioned so a
                replacement busts the immutable cache.

                Fills the frame's width and takes its height from its own
                proportions, so the whole uploaded photo shows with no crop and
                no letterbox gap at the edges. Capping the height instead would
                reintroduce those gaps, since the image would then be sized to
                fit the cap rather than the frame. width/height come from the
                upload and only reserve the right space while it loads — the
                CSS below is what actually sizes it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/champion-photo?v=${photoVersion}`}
              alt={`${team.name} celebrating the OTSV Football League 2026 title`}
              width={photoWidth ?? undefined}
              height={photoHeight ?? undefined}
              className="block h-auto w-full"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
