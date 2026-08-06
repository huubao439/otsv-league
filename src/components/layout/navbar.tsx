"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { isAdminSession } from "@/lib/admin-auth";
import { useActivePath } from "@/lib/use-active-path";

const ThemeToggle = dynamic(
  () => import("@/components/layout/theme-toggle").then((mod) => mod.ThemeToggle),
  { ssr: false },
);

const publicNavItems = [
  { href: "/", label: "Home" },
  { href: "/standings", label: "Standings" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/teams", label: "Teams" },
  { href: "/stats", label: "Stats" },
  { href: "/rules", label: "Rules" },
];

/** Only rendered for a signed-in admin. See src/lib/admin-auth.ts. */
const adminNavItem = { href: "/admin", label: "Overall" };

export function Navbar() {
  const pathname = useActivePath();
  const navItems = isAdminSession() ? [...publicNavItems, adminNavItem] : publicNavItems;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-[var(--bg-deep)]/85 backdrop-blur-[18px] backdrop-saturate-150">
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3 sm:px-6 lg:gap-7 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 rounded-full bg-[image:var(--grad)] p-0.5 shadow-[0_0_0_1px_var(--border-strong),0_8px_20px_-10px_oklch(0.6_0.24_350/0.8)]">
            <Image
              src="/otsv-logo.png"
              alt="OTSV Football League 2026 logo"
              width={44}
              height={44}
              priority
              className="h-full w-full rounded-full object-cover"
            />
          </span>
          <span className="flex min-w-0 flex-col gap-px">
            <span className="truncate font-heading text-[19px] uppercase leading-tight tracking-[0.02em]">
              OTSV Football League
            </span>
            <span className="truncate font-mono text-[10.5px] font-medium uppercase leading-tight tracking-[0.14em] text-[var(--faint)]">
              {/* Shorter on mobile so it never truncates; full label from md up. */}
              <span className="md:hidden">Season 2026</span>
              <span className="hidden md:inline">Corporate Championship · Season 2026</span>
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-0.5 rounded-full border border-border bg-[var(--surface)] p-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-link-${item.label.toLowerCase()}`}
              className={
                isActive(item.href)
                  ? "rounded-full bg-[image:var(--grad)] px-4 py-2 text-[13.5px] font-bold leading-none text-white shadow-[0_6px_16px_-8px_oklch(0.6_0.24_350/0.9)]"
                  : "rounded-full px-4 py-2 text-[13.5px] font-bold leading-none text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5 md:ml-0">
          {/* Needs 2xl now that Rules is in the nav; below that the header crowds. */}
          <span className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-border bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-muted-foreground 2xl:inline-flex">
            <span className="h-[7px] w-[7px] rounded-full bg-[var(--gold)] animate-pulse-dot" />
            Round 1 · kicks off Mon 17 Aug
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
