/**
 * Campaign carousel, ported from adsum/case-study-script.js. The dots are
 * still built in script rather than markup, matching the original, so the
 * teardown clears them along with the listeners.
 */
export function initCarousel(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>(".paper-cs__carousel-track");
  const slides = Array.from(
    root.querySelectorAll<HTMLElement>(".paper-cs__carousel-slide"),
  );
  const dotsHost = root.querySelector<HTMLElement>(".paper-cs__carousel-dots");
  const prevBtn = root.querySelector<HTMLButtonElement>("[data-carousel-prev]");
  const nextBtn = root.querySelector<HTMLButtonElement>("[data-carousel-next]");
  if (!track || slides.length < 2 || !dotsHost || !prevBtn || !nextBtn) return;

  let index = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `paper-cs__carousel-dot${i === 0 ? " active" : ""}`;
    dot.setAttribute("aria-label", `Go to campaign ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsHost.appendChild(dot);
    return dot;
  });

  function goTo(nextIndex: number) {
    index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    track!.style.transition = reduceMotion ? "none" : "";
    track!.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    prevBtn!.disabled = index === 0;
    nextBtn!.disabled = index === slides.length - 1;
  }

  function onPrev() {
    goTo(index - 1);
  }

  function onNext() {
    goTo(index + 1);
  }

  let startX = 0;
  let deltaX = 0;
  let dragging = false;

  function onPointerDown(event: PointerEvent) {
    dragging = true;
    startX = event.clientX;
    deltaX = 0;
    track!.setPointerCapture(event.pointerId);
    track!.style.transition = "none";
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging) return;
    deltaX = event.clientX - startX;
    track!.style.transform = `translateX(calc(${-index * 100}% + ${deltaX}px))`;
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    track!.style.transition = "";
    if (Math.abs(deltaX) > 60) {
      goTo(deltaX < 0 ? index + 1 : index - 1);
    } else {
      goTo(index);
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  }

  prevBtn.addEventListener("click", onPrev);
  nextBtn.addEventListener("click", onNext);
  track.addEventListener("pointerdown", onPointerDown);
  track.addEventListener("pointermove", onPointerMove);
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  root.addEventListener("keydown", onKeyDown);

  goTo(0);

  return () => {
    prevBtn.removeEventListener("click", onPrev);
    nextBtn.removeEventListener("click", onNext);
    track.removeEventListener("pointerdown", onPointerDown);
    track.removeEventListener("pointermove", onPointerMove);
    track.removeEventListener("pointerup", endDrag);
    track.removeEventListener("pointercancel", endDrag);
    root.removeEventListener("keydown", onKeyDown);
    dots.forEach((dot) => dot.remove());
  };
}
