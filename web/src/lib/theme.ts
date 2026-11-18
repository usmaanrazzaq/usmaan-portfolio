export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export const THEME_COLORS: Record<Theme, string> = {
  light: "#ffffff",
  dark: "#0e0e10",
};

/**
 * Runs before first paint, from the document head. It has to stay a plain
 * string of ES5 so it can be inlined without a bundler pass. It was carried
 * over from the inline script in the static site this app replaced.
 */
export const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var color = theme === 'dark' ? '#0e0e10' : '#ffffff';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.style.backgroundColor = color;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color);
  } catch (e) {}
})();`;

export function getPreferredTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // Private mode or blocked storage: fall through to the OS preference.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Every --home-* colour swaps on one frame, which reads as a flash.
 *
 * Where the browser has view transitions, the swap is one cross-fade of the
 * whole page: a snapshot of the old theme dissolves into the new one (the
 * `is-theme-fading` rules in globals.css). Everything changes together,
 * including what a CSS transition cannot interpolate -- the card's grain, its
 * shadow, the gradients -- and the frosted glass is not re-blurred on every
 * frame of a per-element fade, which is what made the old swap judder.
 *
 * Elsewhere, the `is-theme-switching` class lends the document a transition on
 * just the theme-carrying properties for the length of the swap, then takes it
 * away again -- a permanent global transition would fight hover states and
 * drag on scroll.
 */
const THEME_SWITCH_MS = 360;
let switchTimer: number | undefined;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function beginThemeSwitch() {
  const root = document.documentElement;
  root.classList.add("is-theme-switching");
  window.clearTimeout(switchTimer);
  switchTimer = window.setTimeout(() => {
    root.classList.remove("is-theme-switching");
  }, THEME_SWITCH_MS);
}

export function applyTheme(theme: Theme) {
  if (prefersReducedMotion()) {
    setTheme(theme);
    return;
  }

  if (typeof document.startViewTransition === "function") {
    const root = document.documentElement;
    root.classList.add("is-theme-fading");
    const transition = document.startViewTransition(() => setTheme(theme));
    transition.finished.finally(() => root.classList.remove("is-theme-fading"));
    return;
  }

  beginThemeSwitch();
  setTheme(theme);
}

function setTheme(theme: Theme) {
  const color = THEME_COLORS[theme];

  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
  document.documentElement.style.backgroundColor = color;

  // Keeps Safari/iOS status and toolbar chrome in sync with the site theme.
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", color);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Persisting is best effort; the attribute is already applied.
  }
}
