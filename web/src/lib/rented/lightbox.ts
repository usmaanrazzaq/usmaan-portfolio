/**
 * Chart lightbox, ported from rented/rented/case-study-script.js. Rented only
 * enlarges charts, not images, so the image branch of the original is dropped
 * along with the <img> it drove.
 */

const CHART_SELECTOR = ".paper-cs__charts .chart-card";

/**
 * A cloned SVG carries the original's gradient ids, so the two copies on the
 * page would fight over `url(#…)` references. Renaming them in the clone keeps
 * the enlarged chart painted with its own gradient.
 */
function rewriteSvgIds(svg: SVGElement) {
  const idMap: Record<string, string> = {};

  svg.querySelectorAll<SVGElement>("[id]").forEach((node) => {
    const oldId = node.id;
    const newId = `lb-${oldId}-${Math.random().toString(36).slice(2, 7)}`;
    idMap[oldId] = newId;
    node.id = newId;
  });

  svg.querySelectorAll<SVGElement>("*").forEach((node) => {
    ["fill", "stroke", "filter", "clip-path", "mask"].forEach((attr) => {
      let value = node.getAttribute(attr);
      if (!value || !value.includes("url(#")) return;
      Object.keys(idMap).forEach((oldId) => {
        value = value!.split(`url(#${oldId})`).join(`url(#${idMap[oldId]})`);
      });
      node.setAttribute(attr, value);
    });
  });

  return svg;
}

export function initChartLightbox(root: HTMLElement, overlay: HTMLElement) {
  const chartEl = overlay.querySelector<HTMLElement>(".lightbox-chart");
  const closeBtn = overlay.querySelector<HTMLElement>(".lightbox-close");
  let lastFocus: HTMLElement | null = null;
  let closeTimer: number | null = null;

  root.querySelectorAll<HTMLElement>(CHART_SELECTOR).forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    const label = card.querySelector("svg")?.getAttribute("aria-label");
    card.setAttribute("aria-label", `${label || "Chart"} — enlarge`);
    card.classList.add("paper-cs__zoomable");
  });

  function showOverlay() {
    lastFocus = document.activeElement as HTMLElement | null;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("active"));
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  }

  function closeOverlay() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";

    closeTimer = window.setTimeout(() => {
      closeTimer = null;
      overlay.hidden = true;
      if (chartEl) {
        chartEl.innerHTML = "";
        chartEl.hidden = true;
      }
      lastFocus?.focus();
    }, 280);
  }

  function openChart(card: HTMLElement) {
    const svg = card.querySelector("svg");
    if (!svg || !chartEl) return;

    chartEl.hidden = false;
    chartEl.innerHTML = "";

    const clone = rewriteSvgIds(svg.cloneNode(true) as SVGElement);
    clone.removeAttribute("aria-label");
    clone.classList.add("chart-animated");
    clone.querySelectorAll<SVGElement>(".chart-line").forEach((line) => {
      line.style.strokeDasharray = "none";
      line.style.strokeDashoffset = "0";
    });

    const shell = document.createElement("div");
    shell.className = "chart-card lightbox-chart-card chart-animated";
    shell.appendChild(clone);
    chartEl.appendChild(shell);
    showOverlay();
  }

  function onDocumentClick(event: MouseEvent) {
    const chart = (event.target as HTMLElement | null)?.closest<HTMLElement>(CHART_SELECTOR);
    if (!chart) return;
    event.preventDefault();
    openChart(chart);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && overlay.classList.contains("active")) {
      closeOverlay();
      return;
    }

    const chart = (event.target as HTMLElement | null)?.closest<HTMLElement>(CHART_SELECTOR);
    if (chart && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openChart(chart);
    }
  }

  function onCloseClick(event: MouseEvent) {
    event.stopPropagation();
    closeOverlay();
  }

  function onOverlayClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target === overlay || target.classList.contains("lightbox-stage")) closeOverlay();
  }

  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onKeyDown);
  closeBtn?.addEventListener("click", onCloseClick);
  overlay.addEventListener("click", onOverlayClick);

  return () => {
    document.removeEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onKeyDown);
    closeBtn?.removeEventListener("click", onCloseClick);
    overlay.removeEventListener("click", onOverlayClick);
    if (closeTimer !== null) window.clearTimeout(closeTimer);
    document.body.style.overflow = "";
  };
}
