import Link from "next/link";
import { Calendar, CircleDot, Trophy } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/50 dark:bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground">OTSV League</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              OTSV corporate football league with a double round-robin format, weekly fixtures, and performance-driven stats.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 px-3 py-1"><Trophy className="h-3.5 w-3.5" /> Championship Race</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 px-3 py-1"><Calendar className="h-3.5 w-3.5" /> 10 Matchweeks</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 px-3 py-1"><CircleDot className="h-3.5 w-3.5" /> Live Match Updates</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Pages</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {[["/", "Home"], ["/standings", "Standings"], ["/fixtures", "Fixtures"], ["/teams", "Teams"], ["/stats", "Stats"], ["/media", "Media"]].map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-emerald-600 dark:hover:text-lime-400">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Email: otsv.league@company.com</li>
              <li>Support: +84 900 000 000</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground/70">
          <p>&copy; {new Date().getFullYear()} OTSV League. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
