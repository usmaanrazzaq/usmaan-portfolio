import type { HeroSky } from "@/data/heroSkies";

/** The element the picker writes to, and where it remembers its last pick. */
export const HERO_SKY_ID = "home-hero-sky";
export const HERO_SKY_STORAGE_KEY = "hero-sky";

/**
 * Serialises a value for inlining inside a <script> element.
 *
 * The HTML parser ends a script element at the first `</script` sequence
 * regardless of JavaScript string context, and JSON.stringify does not escape
 * `<`. Alt text here comes from Are.na block descriptions, so a description
 * containing `</script` would close the element early and let the rest be
 * parsed as HTML -- a broken picker at best, script injection at worst.
 * Escaping `<` keeps the JSON valid and makes that impossible.
 *
 * U+2028/U+2029 go too: they are legal in JSON strings but terminate a line in
 * older JavaScript parsers, and this script is deliberately un-transpiled.
 */
function inlineJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(new RegExp("\u2028", "g"), "\\u2028")
    .replace(new RegExp("\u2029", "g"), "\\u2029");
}

/**
 * Picks the hero plate's image, in the browser, before the plate paints.
 *
 * It has to run client-side: every route is prerendered to static HTML, so a
 * pick made while rendering would be evaluated once at build time and every
 * visitor would see the same image until the next deploy.
 *
 * Like THEME_INIT_SCRIPT in lib/theme.ts this stays plain ES5 so it can be
 * inlined without a bundler pass, and it is placed immediately after the plate
 * so it normally runs before that element is painted. React can hoist script
 * elements, so it falls back to DOMContentLoaded if the plate is not in the
 * document yet -- a frame later than ideal, but the plate is still inside its
 * 200ms entrance delay at that point, so nothing visible changes.
 *
 * It writes a custom property rather than style.backgroundImage on purpose: the
 * plate belongs to a server component, and a property React never rendered is
 * one hydration cannot clobber.
 *
 * An entry whose image is missing would otherwise leave the plate blank for its
 * share of loads, silently -- so the pick is applied optimistically and then
 * verified, and a candidate that fails to load is dropped and re-rolled. That
 * keeps the manifest safe to edit ahead of the files landing, and matters more
 * now the pool is remote: an Are.na URL can rot in a way a local file cannot.
 *
 * The pool is passed in rather than imported so the caller decides the source —
 * the Are.na channel, or the local manifest when that fetch fails.
 */
export function heroSkyScript(pool: HeroSky[]): string {
  return `(function () {
  var pool = ${inlineJson(pool.map((sky) => [sky.src, sky.alt]))};
  var key = ${inlineJson(HERO_SKY_STORAGE_KEY)};
  var id = ${inlineJson(HERO_SKY_ID)};
  if (!pool.length) return;

  var index = Math.floor(Math.random() * pool.length);

  // A reload should land somewhere new, so step off the last pick rather than
  // letting chance repeat it.
  try {
    var previous = parseInt(sessionStorage.getItem(key), 10);
    if (pool.length > 1 && index === previous) {
      index = (index + 1 + Math.floor(Math.random() * (pool.length - 1))) % pool.length;
    }
    sessionStorage.setItem(key, String(index));
  } catch (e) {
    // Private mode or blocked storage: an unremembered random pick is fine.
  }

  function show(el, entry) {
    el.style.setProperty('--hero-sky', 'url(' + entry[0] + ')');
    el.setAttribute('aria-label', entry[1]);
  }

  function apply() {
    var el = document.getElementById(id);
    if (!el) return false;

    var remaining = pool.slice();
    var entry = remaining.splice(index % remaining.length, 1)[0];

    function attempt(candidate) {
      show(el, candidate);
      var probe = new Image();
      probe.onerror = function () {
        if (!remaining.length) return; // Nothing loads; leave the last attempt in place.
        attempt(remaining.splice(Math.floor(Math.random() * remaining.length), 1)[0]);
      };
      probe.src = candidate[0];
    }

    attempt(entry);
    return true;
  }

  if (!apply()) document.addEventListener('DOMContentLoaded', apply);
})();`;
}
