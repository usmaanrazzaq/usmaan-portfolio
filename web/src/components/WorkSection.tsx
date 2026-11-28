"use client";

import { useEffect, useRef, useState } from "react";
import WorkChat from "@/components/WorkChat";
import type { Project } from "@/data/projects";

/** What the client half needs of each project; the slides themselves are server-rendered. */
export type WorkMeta = Pick<Project, "slug" | "title" | "shortTitle">;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToSlide(slug: string) {
  const reduce = prefersReducedMotion();
  document
    .getElementById(`work-${slug}`)
    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function ArrowIcon({ up }: { up?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={up ? "rotate(180 12 12)" : undefined}
      >
        <path d="M12 19L12 5" />
        <path d="M18 13L12 19L6 13" />
      </g>
    </svg>
  );
}

/**
 * The homepage's work section, from the "New Work Section" Wonder frame: each
 * work is a full-viewport slide (rendered on the server by CaseCard and passed
 * in as children), the page snaps between them, and the chat docks at the
 * bottom of the screen to answer questions about whichever one is in view.
 *
 * This half tracks two things: whether the section has arrived (the same rule
 * HeroNavGate uses to bring the nav back), which docks the chat, and which
 * slide fills most of the screen, which the chat and the next/back tabs follow.
 */
export default function WorkSection({
  works,
  children,
}: {
  works: WorkMeta[];
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    const slides = Array.from(section.querySelectorAll<HTMLElement>("[data-work-slide]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) slides.forEach((slide) => slide.classList.add("is-visible"));

    // Docked once the section is properly in view, and for as long as any of
    // it still is or the page is past it.
    // Leaving by the top resets to the first work, so the chat that glides
    // back down from the hero always starts on Shifts.
    const dock = new IntersectionObserver(
      ([entry]) => {
        const past = entry.boundingClientRect.top < 0;
        setDocked(entry.isIntersecting || past);
        if (!entry.isIntersecting && !past) setCurrent(0);
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    dock.observe(section);

    // The current work is whichever slide covers most of the viewport; while
    // two share it mid-scroll, the last one to cover half keeps the chat.
    const ratios = new Map<Element, number>();
    const view = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.intersectionRatio);
          if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
            entry.target.classList.add("is-visible");
          }
        });
        let best = -1;
        let bestRatio = 0.45;
        slides.forEach((slide, index) => {
          const ratio = ratios.get(slide) ?? 0;
          if (ratio > bestRatio) {
            best = index;
            bestRatio = ratio;
          }
        });
        if (best >= 0) setCurrent(best);
      },
      { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1] },
    );
    slides.forEach((slide) => view.observe(slide));

    return () => {
      dock.disconnect();
      view.disconnect();
    };
  }, []);

  const work = works[current];
  const previous = works[current - 1];
  const next = works[current + 1];

  return (
    <section
      ref={sectionRef}
      id="work"
      className="work-stack scroll-mt-0"
      aria-label="Selected work"
    >
      {children}

      <WorkChat work={work} docked={docked} />

      <nav
        className={`work-tabs${docked ? " is-shown" : ""}`}
        aria-label="Move between works"
        inert={!docked}
      >
        {previous && (
          <button
            type="button"
            className="work-tabs__tab"
            onClick={() => scrollToSlide(previous.slug)}
            aria-label={`Previous work: ${previous.title}`}
          >
            {previous.shortTitle}
            <ArrowIcon up />
          </button>
        )}
        {next && (
          <button
            type="button"
            className="work-tabs__tab"
            onClick={() => scrollToSlide(next.slug)}
            aria-label={`Next work: ${next.title}`}
          >
            {next.shortTitle}
            <ArrowIcon />
          </button>
        )}
        {/* The last work has nowhere further to go, so its spot offers the
            way home instead of a trip back up one work at a time. */}
        {!next && (
          <button
            type="button"
            className="work-tabs__tab"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })
            }
          >
            Back to top
            <ArrowIcon up />
          </button>
        )}
      </nav>
    </section>
  );
}
