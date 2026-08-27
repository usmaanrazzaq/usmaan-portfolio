"use client";

import { useEffect, useRef, useState } from "react";
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
    // Work is the in-page work stack on the homepage, a link back to it elsewhere.
    { id: "work", label: "Work", href: current === "work" ? "#work" : "/" },
    { id: "playground", label: "Playground", href: "/playground/" },
    { id: "about", label: "About", href: "/about/" },
    { id: "contact", label: "Contact", href: "/contact/" },
  ] as const;
}

export default function SiteChrome({ current = "work" }: { current?: NavTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function onDocumentClick(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const tabs = tabsFor(current);
  const activeTab = tabs.find((tab) => tab.id === current) ?? tabs[0];

  return (
    <header className="flex items-center justify-between gap-[18px] to-md:gap-3">
      <div className="flex min-w-0 items-center gap-[18px] to-md:gap-3">
        {/* Plain anchor, like the tabs: a client-side navigation to the homepage
            would leave the Rented showcase sitting on its fallback image. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="block h-[42px] w-[82px] shrink-0 leading-[0] to-sm:h-auto to-sm:w-[72px]"
          aria-label="Usmaan Razzaq — Home"
        >
          {/* Not next/image: the mark is a fixed-size asset synced from the static site. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/usmaan-logo-mark.png"
            width={82}
            height={42}
            alt=""
            className="block h-[42px] w-[82px] object-cover to-sm:aspect-[82/42] to-sm:h-auto to-sm:w-[72px]"
          />
        </a>

        <nav
          ref={navRef}
          className={`paper-home__nav${isOpen ? " is-open" : ""}`}
          aria-label="Portfolio sections"
        >
          <button
            type="button"
            className="paper-home__nav-toggle"
            aria-expanded={isOpen}
            aria-controls="paper-home-menu"
            onClick={(event) => {
              event.stopPropagation();
              setIsOpen((open) => !open);
            }}
          >
            <span className="paper-home__nav-toggle-label">{activeTab.label}</span>
            <svg
              className="paper-home__nav-chevron"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path
                d="M3 4.5L6 7.5L9 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="paper-home__tabs" id="paper-home-menu">
            {tabs.map((tab) => {
              const isActive = tab.id === current;
              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  className={isActive ? "is-active" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {tab.label}
                </a>
              );
            })}
          </div>
        </nav>
      </div>

      <ThemeToggle />
    </header>
  );
}
