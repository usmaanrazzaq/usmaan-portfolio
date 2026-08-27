import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The research insight map animation out of shared/interactive-components.js.
 * NMYA is the only case study with a findings block, so it stays here rather
 * than joining the chart and metric helpers in lib/rented/charts.ts.
 *
 * The original wrapped this in gsap.matchMedia('(prefers-reduced-motion:
 * no-preference)'). Here the check is a plain media query and the reduced-motion
 * resting state comes from CSS, which keeps everything revertible by the
 * surrounding gsap context.
 */

function prefersReduce() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initResearchFindings(root: HTMLElement) {
  const containers = root.querySelectorAll<HTMLElement>("[data-research-findings]");
  if (!containers.length || prefersReduce()) return;

  containers.forEach((container) => {
    const intro = container.querySelector(".research-findings__intro");
    const groups = container.querySelectorAll(".research-findings__group");
    const rows = container.querySelectorAll(".research-findings__row");
    const connector = container.querySelector(".research-findings__connector");
    const response = container.querySelector(".research-findings__response");
    const chips = container.querySelectorAll(".research-findings__chip");

    if (intro) gsap.set(intro, { opacity: 0, y: 15 });
    gsap.set(groups, { opacity: 0, y: 18, scale: 0.98 });
    gsap.set(rows, { opacity: 0, y: 12 });
    if (connector) {
      gsap.set(connector, { opacity: 0, scaleX: 0.72, transformOrigin: "center center" });
    }
    if (response) gsap.set(response, { opacity: 0, y: 14 });
    gsap.set(chips, { opacity: 0, y: 8 });

    ScrollTrigger.create({
      trigger: container,
      start: "top 75%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();

        if (intro) {
          tl.to(intro, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" });
        }

        tl.to(
          groups,
          { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "expo.out", stagger: 0.1 },
          intro ? "-=0.2" : "0",
        );

        tl.to(
          rows,
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.05 },
          "-=0.2",
        );

        if (connector) {
          tl.to(
            connector,
            { opacity: 1, scaleX: 1, duration: 0.45, ease: "power2.out" },
            "-=0.05",
          );
        }

        if (response) {
          tl.to(
            response,
            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
            connector ? "-=0.18" : "-=0.05",
          );
        }

        tl.to(
          chips,
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.06 },
          response ? "-=0.18" : "-=0.05",
        );
      },
    });
  });
}
