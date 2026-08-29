import ThemeToggle from "@/components/ThemeToggle";

/** Which tab reads as current; the routes that render the work stack default to Work. */
export type NavTab = "work" | "about" | "playground";

/**
 * The tabs are plain anchors: the Rented prototype script mounts once per document load,
 * so a client-side navigation would leave the homepage showcase on its fallback
 * image. Contact is a URL that opens the modal; ContactModal intercepts the
 * click.
 */
function tabsFor(current: NavTab) {
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
export default function SiteChrome({ current = "work" }: { current?: NavTab }) {
  const tabs = tabsFor(current);

  return (
    <header className="pointer-events-none sticky top-5 z-50 flex items-center justify-center gap-2.5 to-sm:gap-2">
      <nav className="paper-home__nav home-enter-drop pointer-events-auto" aria-label="Portfolio sections">
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

      <ThemeToggle className="home-enter-drop" />
    </header>
  );
}
