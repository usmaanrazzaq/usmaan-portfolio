export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export const THEME_COLORS: Record<Theme, string> = {
  light: "#ffffff",
  dark: "#111111",
};

/**
 * Runs before first paint, from the document head. It has to stay a plain
 * string of ES5 so it can be inlined without a bundler pass, and it mirrors the
 * inline script in the static site's index.html.
 */
export const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var color = theme === 'dark' ? '#111111' : '#ffffff';
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

export function applyTheme(theme: Theme) {
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
