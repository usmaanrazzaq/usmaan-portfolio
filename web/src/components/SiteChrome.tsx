"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Playground and About still live in the static site at the repo root, so they
 * stay plain anchors. Contact is a URL that opens the modal; ContactModal
 * intercepts the click.
 */
const TABS = [
  { label: "Work", href: "#work", active: true },
  { label: "Playground", href: "/playground/", external: true },
  { label: "About", href: "/about/", external: true },
  { label: "Contact", href: "/contact/", external: true },
] as const;

export default function SiteChrome() {
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

  const activeTab = TABS.find((tab) => "active" in tab && tab.active) ?? TABS[0];

  return (
    <header className="flex items-center justify-between gap-[18px] to-md:gap-3">
      <div className="flex min-w-0 items-center gap-[18px] to-md:gap-3">
        <Link
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
        </Link>

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
            {TABS.map((tab) => {
              const isActive = "active" in tab && tab.active;
              return (
                <a
                  key={tab.label}
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
