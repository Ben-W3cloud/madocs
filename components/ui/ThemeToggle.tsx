"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "azk-theme";

function readActiveTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  // Start as null until mounted so SSR and the FOUC-prevention script line up.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readActiveTheme());
  }, []);

  const apply = (next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode etc. */
    }
    setTheme(next);
  };

  const toggle = () => apply(theme === "light" ? "dark" : "light");

  // While we don't know the theme yet, render an inert placeholder of the same
  // size so the header layout doesn't jump after hydration.
  if (theme === null) {
    return (
      <span
        aria-hidden
        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-card/60 ${className}`}
      />
    );
  }

  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
      title={`Switch to ${isLight ? "dark" : "light"} theme`}
      className={`group relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-card/60 text-text-secondary outline-none transition-all duration-150 hover:border-border-bright hover:text-text-primary focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ${className}`}
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-200 ${
          isLight ? "rotate-0 scale-100 opacity-100" : "-rotate-45 scale-50 opacity-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-200 ${
          isLight ? "rotate-45 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </button>
  );
}
