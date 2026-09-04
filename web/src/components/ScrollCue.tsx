"use client";

import { useEffect, useState, type MouseEvent } from "react";

/**
 * The "Scroll to view work" cue that closes the hero. Plain anchor to the work
 * stack, matching the nav's own links so the Rented prototype script is not
 * re-mounted by a client-side navigation.
 *
 * A normal click scrolls in place and leaves the URL at `/`. Writing `#work`
 * would make the next load land on the stack instead of the hero. Modifier
 * clicks keep the hash so a new-tab open still has a target.
 *
 * It dims itself once the work section reaches the viewport — the instruction is
 * stale by the time you are reading the cases. Same IntersectionObserver shape
 * as WorkStack, except the observer is kept alive so the cue comes back if you
 * scroll up.
 */
export default function ScrollCue() {
  const [isDimmed, setIsDimmed] = useState(false);

  useEffect(() => {
    const work = document.getElementById("work");
    if (!work) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") return;

    // The work stack's top edge sits only ~50px below the fold at rest, so a
    // bare threshold would trip before the visitor has scrolled at all. The
    // negative bottom margin waits until it is properly into the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => setIsDimmed(entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );

    observer.observe(work);
    return () => observer.disconnect();
  }, []);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const work = document.getElementById("work");
    if (!work) return;

    event.preventDefault();
    work.scrollIntoView();
  }

  return (
    <div
      className={`home-enter home-scroll-cue mt-[63px] flex flex-col items-center gap-5 [--enter-delay:660ms] to-md:mt-10${
        isDimmed ? " is-dimmed" : ""
      }`}
    >
      <span className="text-ink text-sm leading-[1.4] font-normal">Scroll to view work</span>

      <a
        href="#work"
        aria-label="Scroll to selected work"
        className="border-hairline bg-glass text-ink flex size-[45px] shrink-0 items-center justify-center rounded-pill border-[0.5px]"
        onClick={handleClick}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19L12 5" />
          <path d="M18 13L12 19L6 13" />
        </svg>
      </a>
    </div>
  );
}
