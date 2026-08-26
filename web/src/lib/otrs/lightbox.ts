/**
 * Lightbox, ported from on-the-run-studio/on-the-run-studio/case-study-script.js.
 * Same two branches as Adsum's, minus the carousel: OTRS enlarges the wide shot
 * and the follower chart. The hero is a video, so it is not a target, and the
 * globe is a `.globe-card` rather than a `.chart-card`, so it is not either.
 */

const IMAGE_SELECTOR = ".paper-cs__hero img, .paper-cs__shot img";
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

export function initMediaLightbox(root: HTMLElement, overlay: HTMLElement) {
  const imgEl = overlay.querySelector<HTMLImageElement>(".lightbox-img");
  const chartEl = overlay.querySelector<HTMLElement>(".lightbox-chart");
  const closeBtn = overlay.querySelector<HTMLElement>(".lightbox-close");
  let lastFocus: HTMLElement | null = null;
  let closeTimer: number | null = null;

  root.querySelectorAll<HTMLImageElement>(IMAGE_SELECTOR).forEach((img) => {
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `${img.alt || "Image"} — enlarge`);
    img.classList.add("paper-cs__zoomable");
  });

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
    if (!overlay.classList.contains("active")) return;

    overlay.classList.remove("active");
    document.body.style.overflow = "";

    closeTimer = window.setTimeout(() => {
      closeTimer = null;
      overlay.hidden = true;
      imgEl?.removeAttribute("src");
      if (imgEl) imgEl.alt = "";
      if (chartEl) chartEl.innerHTML = "";
      lastFocus?.focus();
    }, 280);
  }

  function openImage(img: HTMLImageElement) {
    if (!imgEl) return;

    if (chartEl) {
      chartEl.innerHTML = "";
      chartEl.hidden = true;
    }
    imgEl.hidden = false;
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt || "";
    showOverlay();
  }

  function openChart(card: HTMLElement) {
    const svg = card.querySelector("svg");
    if (!svg || !chartEl) return;

    if (imgEl) {
      imgEl.removeAttribute("src");
      imgEl.alt = "";
      imgEl.hidden = true;
    }
    chartEl.hidden = false;
    chartEl.innerHTML = "";

    const clone = rewriteSvgIds(svg.cloneNode(true) as SVGElement);
    clone.removeAttribute("aria-label");
    clone.setAttribute("aria-hidden", "true");
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
    const target = event.target as HTMLElement | null;

    const img = target?.closest<HTMLImageElement>(IMAGE_SELECTOR);
    if (img) {
      event.preventDefault();
      openImage(img);
      return;
    }

    const chart = target?.closest<HTMLElement>(CHART_SELECTOR);
    if (chart) {
      event.preventDefault();
      openChart(chart);
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && overlay.classList.contains("active")) {
      event.preventDefault();
      closeOverlay();
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") return;

    const target = event.target as HTMLElement | null;

    const img = target?.closest<HTMLImageElement>(IMAGE_SELECTOR);
    if (img && target === img) {
      event.preventDefault();
      openImage(img);
      return;
    }

    const chart = target?.closest<HTMLElement>(CHART_SELECTOR);
    if (chart && target === chart) {
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
