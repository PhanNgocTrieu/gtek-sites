"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeMode = "system" | Theme;

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 8.5 8.5 0 1 0 21 14.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M8 22h8M12 18v4" strokeLinecap="round" />
    </svg>
  );
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initial: ThemeMode = "system";
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light" || stored === "system") initial = stored;
    } catch {
      /* private mode / blocked storage — stay system */
    }
    setMode(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const applyTheme = () => {
      const resolved: Theme = mode === "system" ? getSystemTheme() : mode;
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      root.style.colorScheme = resolved;
      root.setAttribute("data-theme-mode", mode);
    };

    applyTheme();
    try {
      localStorage.setItem("theme", mode);
    } catch {
      /* ignore */
    }

    if (mode !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mounted, mode]);

  const buttonClass = (value: ThemeMode) =>
    `inline-flex items-center justify-center rounded-full p-2 transition-colors ${
      mode === value
        ? "bg-gtek-navy text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    }`;

  /* Visible chrome-steel placeholders — avoids empty pill before hydration */
  if (!mounted) {
    return (
      <div
        className="inline-flex items-center gap-0.5 rounded-full border border-slate-300 bg-white/80 p-1 dark:border-slate-600 dark:bg-slate-900/80"
        aria-hidden
      >
        <span className="inline-flex rounded-full p-2 text-slate-400 opacity-60">
          <SystemIcon />
        </span>
        <span className="inline-flex rounded-full p-2 text-slate-400 opacity-60">
          <SunIcon />
        </span>
        <span className="inline-flex rounded-full p-2 text-slate-400 opacity-60">
          <MoonIcon />
        </span>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme mode"
      className="inline-flex items-center gap-0.5 rounded-full border border-slate-300 bg-white/90 p-1 text-slate-900 shadow-sm backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-100"
    >
      <button type="button" title="Use system theme" aria-label="Use system theme" onClick={() => setMode("system")} className={buttonClass("system")}>
        <SystemIcon />
      </button>
      <button type="button" title="Light mode" aria-label="Light mode" onClick={() => setMode("light")} className={buttonClass("light")}>
        <SunIcon />
      </button>
      <button type="button" title="Dark mode" aria-label="Dark mode" onClick={() => setMode("dark")} className={buttonClass("dark")}>
        <MoonIcon />
      </button>
    </div>
  );
}
