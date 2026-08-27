/**
 * Image lightbox, ported from wcm-connect/case-study-script.js. WCM only
 * enlarges images, so there is no chart branch and the overlay carries an
 * <img> rather than a chart slot.
 */

const IMAGE_SELECTOR = ".paper-cs__hero img, .paper-cs__shot img";

export function initImageLightbox(root: HTMLElement, overlay: HTMLElement) {
  const imgEl = overlay.querySelector<HTMLImageElement>(".lightbox-img");
  const closeBtn = overlay.querySelector<HTMLElement>(".lightbox-close");
  let lastFocus: HTMLElement | null = null;
  let closeTimer: number | null = null;

  root.querySelectorAll<HTMLImageElement>(IMAGE_SELECTOR).forEach((img) => {
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `${img.alt || "Image"} — enlarge`);
    img.classList.add("paper-cs__zoomable");
  });

  function openImage(img: HTMLImageElement) {
    if (!imgEl) return;

    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt || "";

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
      lastFocus?.focus();
    }, 280);
  }

  function onDocumentClick(event: MouseEvent) {
    const img = (event.target as HTMLElement | null)?.closest<HTMLImageElement>(IMAGE_SELECTOR);
    if (!img) return;
    event.preventDefault();
    openImage(img);
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
