"use client";

import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("otsv-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return localStorage.getItem("otsv-theme") === "light" ? "light" : "dark";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      title="Toggle light / dark"
      aria-label={`Switch to ${nextTheme} mode`}
      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-[var(--surface)] text-base text-foreground transition-colors hover:border-[var(--border-strong)] hover:bg-[image:var(--grad-soft)]"
      onClick={() => {
        setTheme(nextTheme);
      }}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
