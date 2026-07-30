"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarDays, GalleryHorizontalEnd, Menu, Trophy, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = dynamic(
  () => import("@/components/layout/theme-toggle").then((mod) => mod.ThemeToggle),
  { ssr: false },
);

const navItems = [
  { href: "/", label: "Home" },
  { href: "/standings", label: "Standings" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/teams", label: "Teams" },
  { href: "/stats", label: "Stats" },
  { href: "/media", label: "Media" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/90 shadow-[0_8px_26px_rgba(15,23,42,0.06)] backdrop-blur-lg dark:border-border/60 dark:bg-background/95 dark:shadow-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-lime-400 via-emerald-400 to-orange-500 shadow-[0_0_20px_rgba(132,204,22,0.3)]">
            <Trophy className="h-5 w-5 text-zinc-900" />
          </div>
          <div className="leading-tight">
            <p className="font-heading text-xl font-bold uppercase tracking-wide text-foreground">OTSV League</p>
            <p className="text-[11px] text-muted-foreground">Corporate Football Championship</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-link-${item.label.toLowerCase()}`}
                className={
                  `inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 rounded-full border border-border/70 bg-card/90 px-4 py-2 text-xs text-muted-foreground lg:flex dark:bg-card/80">
          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 6 Teams</span>
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> 10 Matchweeks</span>
          <span className="inline-flex items-center gap-1"><GalleryHorizontalEnd className="h-3.5 w-3.5" /> Live Highlights</span>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/70 bg-background px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className={
                `mt-1 inline-flex h-8 w-full items-center justify-start rounded-lg px-2.5 text-sm font-medium transition-all ${
                  pathname === item.href || pathname.startsWith(item.href)
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                }`
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
