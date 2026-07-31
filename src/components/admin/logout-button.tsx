"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { logoutAction } from "@/app/admin/auth-actions";

/** Clears the admin session cookie and returns to the public site. */
export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      data-testid="admin-logout"
      onClick={() => startTransition(async () => { await logoutAction(); })}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-[var(--surface)] px-4 py-2.5 text-[12.5px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--pink)] hover:text-[var(--pink)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LogOut className="h-3.5 w-3.5" />
      {pending ? "Signing out…" : "Log out"}
    </button>
  );
}
