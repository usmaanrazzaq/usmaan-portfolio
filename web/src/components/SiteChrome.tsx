import HeroNavGate from "@/components/HeroNavGate";
import ThemeToggle from "@/components/ThemeToggle";

/** Which tab reads as current; the routes that render the work stack default to Work. */
export type NavTab = "work" | "about" | "playground";

/**
 * The tabs are plain anchors: the Rented prototype script mounts once per document load,
 * so a client-side navigation would leave the homepage showcase on its fallback
 * image. Contact is a URL that opens the modal; ContactModal intercepts the
 * click.
 */
function tabsFor(current: NavTab | null) {
  return [
    // Reads as Home now that the hero opens the page. "#top" is the spec's
    // document-top fragment, so it needs no anchor element to scroll back up.
    { id: "work", label: "Home", href: current === "work" ? "#top" : "/" },
    { id: "playground", label: "Playground", href: "/playground/" },
    { id: "about", label: "About", href: "/about/" },
    { id: "contact", label: "Contact", href: "/contact/" },
  ] as const;
}

/**
 * One floating frosted pill at every width — the hero frame's nav, with no
 * mobile dropdown behind it, which is why this no longer needs to be a client
 * component. It sticks so it follows the page down, and the row around it is
 * click-through so it does not swallow taps on the content scrolling beneath.
 */
// Whole literals, not template pieces: Tailwind reads class names out of the
// source text, and a utility butted up against `${` is not one it recognises.
const CHROME =
  "paper-home__chrome pointer-events-none sticky top-5 z-50 flex items-center justify-center gap-2.5 to-sm:gap-2";
const NAV = "paper-home__nav pointer-events-auto";

// `null` is for unlinked pages (References): no tab reads as current.
//
// `hideOnHero` is the homepage's variant: the nav is rendered hidden and
// HeroNavGate brings it back once the work stack is in view. The nav drops its
// entrance class there, since that animation would show it on the way in.
export default function SiteChrome({
  current = "work",
  hideOnHero = false,
}: {
  current?: NavTab | null;
  hideOnHero?: boolean;
}) {
  const tabs = tabsFor(current);

  return (
    <header className={hideOnHero ? `${CHROME} is-hero` : CHROME}>
      <nav
        className={hideOnHero ? NAV : `${NAV} home-enter-drop`}
        aria-label="Portfolio sections"
      >
        <div className="paper-home__tabs">
          {tabs.map((tab) => {
            const isActive = tab.id === current;
            return (
              <a
                key={tab.id}
                href={tab.href}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </a>
            );
          })}
        </div>
      </nav>

      {/* The slot carries the hero's slide to the right edge, so it does not
          fight the button's own entrance transform. */}
      <span className="paper-home__theme-slot flex">
        <ThemeToggle className="home-enter-drop" />
      </span>

      {hideOnHero && (
        <>
          <HeroNavGate />
          <noscript>
            <style>
              {
                ".paper-home__chrome.is-hero .paper-home__nav{opacity:1!important;transform:none!important;pointer-events:auto!important}.paper-home__chrome.is-hero .paper-home__theme-slot{transform:none!important}"
              }
            </style>
          </noscript>
        </>
      )}
    </header>
  );
}
