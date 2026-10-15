"use client";

import type { MouseEvent } from "react";

/**
 * The "Scroll to see work" cue under the chat composer, from the "Hero v3 -
 * Build 1" Paper frame. Plain anchor to the work stack, matching the nav's own
 * links so the Rented prototype script is not re-mounted by a client-side
 * navigation.
 *
 * A normal click scrolls in place and leaves the URL at `/`. Writing `#work`
 * would make the next load land on the stack instead of the hero. Modifier
 * clicks keep the hash so a new-tab open still has a target.
 *
 * The shimmer lives in paper-home.css: the label's sweep is a clipped
 * background, which an SVG stroke cannot take, so the arrow runs its own colour
 * keyframes on the same cycle.
 */
export default function ScrollCue({ className = "" }: { className?: string }) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const work = document.getElementById("work");
    if (!work) return;

    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    work.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <a
      href="#work"
      className={`home-scroll-cue text-ink flex items-center gap-[5px] self-center px-2.5 py-[5px] text-sm leading-[18px] font-light ${className}`}
      onClick={handleClick}
    >
      <span className="home-scroll-cue__label">Scroll to see work</span>
      <svg
        className="home-scroll-cue__arrow shrink-0"
        width="14"
        height="14"
        viewBox="0 0 21 21"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10.5 16.625L10.5 4.375" />
        <path d="M15.75 11.375L10.5 16.625 5.25 11.375" />
      </svg>
    </a>
  );
}
