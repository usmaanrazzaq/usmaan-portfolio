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

export default function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, getPreferredTheme, () => "light");
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="paper-home__theme"
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
        strokeWidth="1.6"
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
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
