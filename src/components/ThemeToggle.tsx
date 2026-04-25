"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-sage-200 dark:border-slate-800 flex items-center justify-center"></div>
    );
  }

  const isDark = theme === "dark" || resolvedTheme === "dark";

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isDesktop && !prefersReducedMotion) {
      document.documentElement.classList.add("theme-switching");
      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-switching");
      }, 520);
    }

    setTheme(nextTheme);
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full border border-sage-200 dark:border-slate-700 text-sage-800 dark:text-cream-50 hover:bg-sage-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
      title="Gece/Gündüz Modunu Değiştir"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
