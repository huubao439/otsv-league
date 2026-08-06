import { Anton, JetBrains_Mono, Manrope } from "next/font/google";
import Script from "next/script";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TeamLogoProvider } from "@/components/league/team-logo-provider";
import { formatMatchDate, nextRoundFixturesFrom } from "@/data/league";
import { getMatches } from "@/lib/server/league-data";
import { getTeamLogoMap } from "@/lib/team-logos.server";
import { siteMetadata } from "@/lib/utils";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  preload: false,
});

const anton = Anton({
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  variable: "--font-heading",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-mono",
  preload: false,
});

export const metadata = siteMetadata();

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read once per render so a newly dropped crest appears on the next page load.
  const teamLogos = getTeamLogoMap();

  // Header pill: the next round still to be played, straight from the schedule
  // so it can never disagree with the fixtures. Hidden once the season is done.
  const opener = nextRoundFixturesFrom(await getMatches()).at(0);
  const scheduleLabel = opener
    ? `Round ${opener.round} · kicks off ${formatMatchDate(opener.date)}`
    : null;

  return (
    <html
      lang="vi"
      className={`${manrope.variable} ${anton.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="otsv-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const saved = localStorage.getItem('otsv-theme');
    const theme = saved === 'light' ? 'light' : 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (_) {
    document.documentElement.classList.add('dark');
  }
})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <TeamLogoProvider logos={teamLogos}>
          {/* Extra bottom padding on mobile clears the fixed BottomNav; removed at md. */}
          <div className="relative isolate flex min-h-screen flex-col overflow-hidden pb-[64px] md:pb-0">
            <div className="ambient-bloom" aria-hidden />
            <Navbar scheduleLabel={scheduleLabel} />
            <main className="relative z-1 flex-1">{children}</main>
            <Footer />
          </div>
          <BottomNav />
        </TeamLogoProvider>
      </body>
    </html>
  );
}
