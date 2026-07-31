import Image from "next/image";
import Link from "next/link";

const pages = [
  ["/", "Home"],
  ["/standings", "Standings"],
  ["/fixtures", "Fixtures"],
  ["/teams", "Teams"],
  ["/stats", "Stats"],
  ["/rules", "Rules"],
] as const;

export function Footer() {
  return (
    <footer className="relative z-1 border-t border-border bg-[var(--bg-deep)]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/otsv-logo.png"
              alt="OTSV Football League 2026 logo"
              width={34}
              height={34}
              className="h-[34px] w-[34px] rounded-full object-contain"
            />
            <span className="text-[12.5px] font-semibold leading-tight text-muted-foreground">
              OTSV Football League 2026 · One Tech Stop Vietnam
            </span>
          </div>
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[var(--faint)]">
            Fixtures subject to change
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
          {pages.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="text-[12.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
          <span className="ml-auto font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[var(--faint)]">
            otsv.league@company.com · +84 900 000 000
          </span>
        </nav>
      </div>
    </footer>
  );
}
