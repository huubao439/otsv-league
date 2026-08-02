"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";

/**
 * Mobile bottom tab bar, from the mobile design. Replaces the hamburger menu
 * below `md`; hidden from `md` up, where the header pill nav takes over. Uses
 * the short labels the design uses ("Table" for Standings) so every tab fits.
 */
const publicTabs = [
  { href: "/", label: "Home" },
  { href: "/standings", label: "Table" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/teams", label: "Teams" },
  { href: "/stats", label: "Stats" },
  { href: "/rules", label: "Rules" },
];

const adminTab = { href: "/admin", label: "Overall" };

export function BottomNav() {
  const pathname = usePathname();
  const tabs = isAdminSession() ? [...publicTabs, adminTab] : publicTabs;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Primary"
      data-testid="bottom-nav"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[var(--bg-deep)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
    >
      <div className="flex items-stretch gap-1 px-2 py-2">
        {tabs.map((tab) => {
          const active = isActive(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              data-testid={`bottom-nav-${tab.label.toLowerCase()}`}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "flex-1 rounded-full bg-[image:var(--grad)] px-1 py-2.5 text-center text-[10.5px] font-extrabold leading-none text-white"
                  : "flex-1 rounded-full px-1 py-2.5 text-center text-[10.5px] font-bold leading-none text-[var(--faint)] transition-colors hover:text-foreground"
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
