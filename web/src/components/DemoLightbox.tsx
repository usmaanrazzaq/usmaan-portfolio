"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/**
 * Open/step/close state for a set of demos shown in a `DemoLightbox`. Focus
 * returns to whichever frame opened it.
 */
export function useDemoLightbox(count: number) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  function open(order: number, el: HTMLElement) {
    opener.current = el;
    setIndex(order);
  }

  function step(delta: number) {
    setIndex((i) => (i === null ? i : (i + delta + count) % count));
  }

  function close() {
    setIndex(null);
    opener.current?.focus();
  }

  return { index, open, step, close };
}

/**
 * The enlarged view of a case study's self-running demos: the caller renders a
 * fresh copy of the chosen demo as `children`, stepped through with the side
 * buttons, the arrow keys, or a swipe. Styled after the image lightbox.
 */
export default function DemoLightbox({
  index,
  count,
  noun,
  className = "",
  onStep,
  onClose,
  children,
}: {
  index: number | null;
  count: number;
  /** What one demo is called in the labels, e.g. "component". */
  noun: string;
  className?: string;
  onStep: (delta: number) => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const isOpen = index !== null;

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => setActive(true));
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // The overlay is `visibility: hidden` until active, so focus waits for it.
  useEffect(() => {
    if (active) closeRef.current?.focus();
  }, [active]);

  function close() {
    setActive(false);
    window.setTimeout(onClose, 280);
  }

  // The document listener reads the latest handlers through a ref, so it is
  // attached once per open rather than on every render.
  const keys = useRef({ close, onStep });
  useEffect(() => {
    keys.current = { close, onStep };
  });

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") keys.current.close();
      else if (event.key === "ArrowRight") keys.current.onStep(1);
      else if (event.key === "ArrowLeft") keys.current.onStep(-1);
      else return;
      event.preventDefault();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Clicks on the dimmed ground close it; clicks on the demo do not.
  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target === overlayRef.current || target.classList.contains("lightbox-stage")) close();
  }

  function onTouchStart(event: React.TouchEvent) {
    touchX.current = event.touches[0].clientX;
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = event.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) onStep(dx < 0 ? 1 : -1);
  }

  // Rendered only while open, into <body>, so no ancestor can clip it.
  if (!isOpen) return null;

  return createPortal(
    <div
      className={`lightbox-overlay lightbox-overlay--demos ${className}${active ? " active" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged ${noun}`}
      ref={overlayRef}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        className="lightbox-close"
        aria-label="Close lightbox"
        ref={closeRef}
        onClick={close}
      />
      <button
        type="button"
        className="lightbox-step lightbox-step--prev"
        aria-label={`Previous ${noun}`}
        onClick={() => onStep(-1)}
      />
      <button
        type="button"
        className="lightbox-step lightbox-step--next"
        aria-label={`Next ${noun}`}
        onClick={() => onStep(1)}
      />
      <p className="sr-only" aria-live="polite">
        {noun[0].toUpperCase() + noun.slice(1)} {index + 1} of {count}
      </p>
      <div className="lightbox-stage">{children}</div>
    </div>,
    document.body,
  );
}
