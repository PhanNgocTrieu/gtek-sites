"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeMode = "system" | Theme;

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial: ThemeMode = stored === "dark" || stored === "light" || stored === "system" ? stored : "system";
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
    localStorage.setItem("theme", mode);

    if (mode !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mounted, mode]);

  if (!mounted) {
    return <span className="inline-flex h-9 w-44 rounded-full border border-slate-200 dark:border-slate-700" />;
  }

  const buttonClass = (value: ThemeMode) =>
    `rounded-full px-3 py-1 transition-colors ${
      mode === value
        ? "bg-gtek-navy text-white"
        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
    }`;

  return (
    <div
      role="group"
      aria-label="Theme mode"
      className="inline-flex items-center gap-1 rounded-full border border-slate-300 p-1 text-xs font-semibold dark:border-slate-700"
    >
      <button type="button" onClick={() => setMode("system")} className={buttonClass("system")}>
        System
      </button>
      <button type="button" onClick={() => setMode("light")} className={buttonClass("light")}>
        Light
      </button>
      <button type="button" onClick={() => setMode("dark")} className={buttonClass("dark")}>
        Dark
      </button>
    </div>
  );
}
