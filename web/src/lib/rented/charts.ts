import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The three functions rented/rented/case-study-script.js calls out of
 * shared/interactive-components.js. The rest of that file drives components no
 * Rented section uses, so it is not ported.
 *
 * The originals wrapped these in gsap.matchMedia('(prefers-reduced-motion:
 * no-preference)'). Here the check is a plain media query and the reduced-motion
 * resting state comes from CSS, which keeps everything revertible by the
 * surrounding gsap context.
 */

function prefersReduce() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Measures each polyline so CSS can draw it on, then flips the class that
 * starts the transitions.
 */
function animateChart(chart: HTMLElement) {
  const lines = chart.querySelectorAll<SVGGeometryElement>(".chart-line");
  if (!lines.length) return;

  lines.forEach((line) => {
    let length = 0;
    try {
      length = line.getTotalLength();
    } catch {
      length = parseFloat(line.style.getPropertyValue("--chart-length")) || 1000;
    }
    line.style.setProperty("--chart-length", String(length));
    line.style.strokeDasharray = String(length);
    line.style.strokeDashoffset = String(length);
  });

  // Forces a reflow so the browser registers the initial state.
  void chart.offsetHeight;

  chart.classList.add("chart-animated");
}

export function initChartScrollTriggers(root: HTMLElement) {
  const charts = root.querySelectorAll<HTMLElement>(".chart-card[data-chart]");
  if (!charts.length || prefersReduce()) return;

  charts.forEach((chart) => {
    if (chart.classList.contains("chart-animated")) return;

    ScrollTrigger.create({
      trigger: chart,
      start: "top 80%",
      once: true,
      onEnter: () => animateChart(chart),
    });
  });
}

export function initMetricUnderlineScrollTriggers(root: HTMLElement) {
  const metrics = root.querySelectorAll<HTMLElement>(".paper-cs__metric");
  if (!metrics.length) return;

  const underlineAll = () => {
    metrics.forEach((el) => el.classList.add("metric-underlined"));
  };

  if (prefersReduce()) {
    underlineAll();
    return;
  }

  ScrollTrigger.create({
    trigger: metrics[0].closest(".paper-cs__section") ?? metrics[0],
    start: "top 85%",
    once: true,
    onEnter: underlineAll,
  });
}
