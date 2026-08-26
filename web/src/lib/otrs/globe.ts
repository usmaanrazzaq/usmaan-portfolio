import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The globe reach animation out of shared/interactive-components.js. OTRS is
 * the only case study with a globe, so it stays here rather than joining the
 * chart and metric helpers in lib/rented/charts.ts.
 */

function prefersReduce() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Continuous pulse: each ring expands from its authored radius to ~2.6x while
 * fading out, staggered so the markers ripple in sequence.
 */
function startGlobePulse(pulses: NodeListOf<SVGCircleElement>) {
  pulses.forEach((pulse, i) => {
    const base = parseFloat(pulse.getAttribute("r") ?? "") || 5;

    gsap.fromTo(
      pulse,
      { attr: { r: base }, opacity: 0.35 },
      {
        attr: { r: base * 2.6 },
        opacity: 0,
        duration: 2.4,
        ease: "power1.out",
        repeat: -1,
        delay: i * 0.3,
      },
    );
  });
}

/**
 * Markers grow via the SVG `r` attribute rather than a transform so each dot
 * and ring scales around its own (cx, cy). Transform-origin and transform-box
 * mispositioned the pulses on Safari and iOS.
 */
function animateGlobe(globe: HTMLElement) {
  if (globe.classList.contains("globe-animated")) return;

  const sphere = globe.querySelector<SVGGElement>(".globe-sphere");
  const markers = globe.querySelectorAll<SVGGElement>(".globe-marker");
  const dots = globe.querySelectorAll<SVGCircleElement>(".globe-marker-dot");
  const pulses = globe.querySelectorAll<SVGCircleElement>(".globe-marker-pulse");
  if (!sphere) return;

  // Cached so the entrance grows each dot back to the size it was authored at.
  const dotRadii = Array.from(dots, (dot) => parseFloat(dot.getAttribute("r") ?? "") || 5);

  gsap.set(sphere, { opacity: 0, scale: 0.94, transformOrigin: "260px 148px" });
  gsap.set(markers, { opacity: 0 });
  gsap.set(dots, { attr: { r: 0 }, opacity: 1 });
  gsap.set(pulses, { opacity: 0 });

  globe.classList.add("globe-animated");

  const tl = gsap.timeline({ onComplete: () => startGlobePulse(pulses) });

  tl.to(sphere, { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" });
  tl.to(markers, { opacity: 1, duration: 0.4, stagger: 0.12, ease: "power2.out" }, 0.35);
  tl.to(
    dots,
    {
      attr: { r: (i: number) => dotRadii[i] },
      duration: 0.35,
      stagger: 0.1,
      ease: "back.out(2)",
    },
    0.5,
  );
}

export function initGlobeReachScrollTriggers(root: HTMLElement) {
  const globes = root.querySelectorAll<HTMLElement>("[data-globe-reach]");
  if (!globes.length) return;

  // The hidden initial states only apply once this runs, so the markers stay
  // visible if the scripts ever fail to load.
  globes.forEach((globe) => globe.classList.add("globe-js"));

  if (prefersReduce()) {
    globes.forEach((globe) => {
      globe.classList.add("globe-animated");
      // Markers rest at their authored radius; no pulsing.
      globe.querySelectorAll<SVGElement>(".globe-marker").forEach((el) => {
        el.style.opacity = "1";
      });
      globe.querySelectorAll<SVGElement>(".globe-marker-pulse").forEach((el) => {
        el.style.opacity = "0";
      });
    });
    return;
  }

  globes.forEach((globe) => {
    if (globe.classList.contains("globe-animated")) return;

    ScrollTrigger.create({
      trigger: globe,
      start: "top 85%",
      once: true,
      onEnter: () => animateGlobe(globe),
    });
  });
}
