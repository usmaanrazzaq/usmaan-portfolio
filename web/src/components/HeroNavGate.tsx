"use client";

import { useEffect } from "react";

/**
 * On the homepage the nav stays out of the way while the chat hero is on
 * screen, so the composer and its quick replies are the way onward, and comes
 * back once the work stack arrives. The theme toggle has no such reason to
 * leave: it waits at the right edge and slides home beside the nav when the
 * nav returns.
 *
 * SiteChrome renders the hidden state, so there is nothing to flash before
 * this mounts; this only reveals. The classes are set on the server-rendered
 * header directly, which React never re-renders.
 */
export default function HeroNavGate() {
  useEffect(() => {
    const chrome = document.querySelector<HTMLElement>(".paper-home__chrome.is-hero");
    const slot = chrome?.querySelector<HTMLElement>(".paper-home__theme-slot");
    const work = document.getElementById("work");
    if (!chrome || !slot || !work) return;

    // How far the toggle's resting place is from the right edge. offsetLeft
    // ignores the transform, so this holds whichever state it is measured in.
    function measure() {
      const shift = chrome!.clientWidth - slot!.offsetLeft - slot!.offsetWidth;
      chrome!.style.setProperty("--hero-toggle-shift", `${Math.max(0, shift)}px`);
    }

    measure();
    const resize = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    resize?.observe(chrome);

    // Same margin the scroll cue used: the stack sits just under the fold at
    // rest, so wait until it is properly in view.
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              const past = entry.boundingClientRect.top < 0;
              chrome.classList.toggle("is-revealed", entry.isIntersecting || past);
            },
            { root: null, threshold: 0, rootMargin: "0px 0px -20% 0px" },
          )
        : null;

    if (observer) observer.observe(work);
    else chrome.classList.add("is-revealed");

    // Transitions switch on a frame late, so a reload part-way down the page
    // opens with the nav already in place rather than sliding in.
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => chrome.classList.add("is-ready")),
    );

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resize?.disconnect();
    };
  }, []);

  return null;
}
