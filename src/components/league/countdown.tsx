"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

function format(target: number): string {
  const ms = target - Date.now();
  if (ms <= 0) {
    return "LIVE";
  }

  const days = Math.floor(ms / 864e5);
  const hours = Math.floor(ms / 36e5) % 24;
  const minutes = Math.floor(ms / 6e4) % 60;

  return days > 0
    ? `${days}d ${String(hours).padStart(2, "0")}h`
    : `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
}

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 30000);

  return () => clearInterval(timer);
}

/**
 * Counts down to the next kickoff. The server snapshot is null so the markup
 * hydrates with a placeholder and only then swaps to the live value.
 */
export function Countdown({ kickoffIso }: { kickoffIso: string }) {
  const target = useMemo(() => new Date(kickoffIso).getTime(), [kickoffIso]);
  const getSnapshot = useCallback(
    () => (Number.isNaN(target) ? null : format(target)),
    [target],
  );

  const label = useSyncExternalStore(subscribe, getSnapshot, () => null);

  return <span suppressHydrationWarning>{label ?? "—"}</span>;
}
