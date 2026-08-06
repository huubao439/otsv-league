"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * The current pathname for highlighting the active nav link.
 *
 * `usePathname()` alone can return a stale value on a fresh static load and not
 * re-render until the first client navigation — which left the Home link
 * un-highlighted until you switched tabs and back. Re-syncing from
 * `window.location` after mount (and whenever the router path changes) makes the
 * active state deterministic regardless of hydration timing.
 */
export function useActivePath(): string {
  const routerPath = usePathname();
  const [path, setPath] = useState(routerPath);

  useEffect(() => {
    setPath(window.location.pathname);
  }, [routerPath]);

  return path;
}
