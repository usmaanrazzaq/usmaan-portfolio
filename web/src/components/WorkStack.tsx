"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveal for the case cards. This is an IntersectionObserver toggling a
 * class, not ScrollTrigger — same as the live site, where the GSAP homepage
 * animation is loaded but never called.
 */
export default function WorkStack({ children }: { children: React.ReactNode }) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cases = stackRef.current?.querySelectorAll<HTMLElement>(".paper-home__case");
    if (!cases?.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      cases.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { root: null, threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    cases.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={stackRef} className="mt-5 flex flex-col gap-0 to-md:mt-7">
      {children}
    </div>
  );
}
