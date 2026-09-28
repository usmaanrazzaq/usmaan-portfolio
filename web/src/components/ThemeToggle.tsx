"use client";

import { useSyncExternalStore } from "react";
import { applyTheme, getPreferredTheme, type Theme } from "@/lib/theme";

/**
 * The document element is the source of truth — the blocking head script sets
 * it before React runs — so the button reads it rather than holding its own
 * copy. The server can only assume light, which is why the markup carries the
 * light labels until hydration.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore<Theme>(subscribe, getPreferredTheme, () => "light");
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={className ? `paper-home__theme ${className}` : "paper-home__theme"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      onClick={() => applyTheme(getPreferredTheme() === "dark" ? "light" : "dark")}
    >
      <svg
        className="theme-icon theme-icon--sun"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
      </svg>
      <svg
        className="theme-icon theme-icon--moon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 15.346C18.859 15.921 17.569 16.245 16.204 16.245C11.538 16.245 7.755 12.462 7.755 7.796C7.755 6.431 8.079 5.141 8.654 4C5.893 5.39 4 8.249 4 11.551C4 16.217 7.783 20 12.449 20C15.751 20 18.61 18.107 20 15.346Z" />
      </svg>
    </button>
  );
}
