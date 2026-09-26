"use client";

/**
 * The References page body, from the Paper "Main" frame. The chrome comes from
 * HomeShell, so this is the intro line, the image grid, and its lightbox.
 *
 * The images arrive newest first (the Are.na channels, merged by connection
 * date). They are dealt into four staggered columns, as laid out in Paper:
 * each goes to whichever column is currently shortest, so the newest fill the
 * top row left to right and the columns end close to even. On mobile the
 * columns dissolve and CSS `order` puts every image back in feed order.
 *
 * The lightbox is a native <dialog>: showModal() gives it the top layer, Esc,
 * inert page content, and focus return for free, so all this owns is which
 * image is showing and stepping between them. It steps in feed order.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { Reference } from "@/data/references";

const COLUMNS = 4;

/** Images that start in the first screenful load eagerly; the rest are lazy. */
const EAGER = 8;

type Placed = { reference: Reference; order: number };

function toColumns(references: Reference[]): Placed[][] {
  const columns: Placed[][] = Array.from({ length: COLUMNS }, () => []);
  // Heights in column widths; the gap between images is small enough to ignore.
  const heights = new Array<number>(COLUMNS).fill(0);

  references.forEach((reference, order) => {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push({ reference, order });
    heights[shortest] += reference.height / reference.width;
  });

  return columns;
}

export default function ReferencesContent({ references }: { references: Reference[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [preview, setPreview] = useState<{ id: string; src: string } | null>(null);
  const [readyFulls, setReadyFulls] = useState<Set<string>>(() => new Set());

  const columns = useMemo(() => toColumns(references), [references]);
  const images = references;
  const isOpen = index !== null;
  const current = isOpen ? images[index] : null;
  const currentSrc = current
    ? readyFulls.has(current.id)
      ? current.full
      : preview?.id === current.id
        ? preview.src
        : current.src
    : null;

  // Keep the already-decoded grid image visible while the larger Are.na
  // variant loads. Only swap sources after the browser has decoded it, and
  // ignore the result if the visitor has moved to another image meanwhile.
  useEffect(() => {
    if (!current || readyFulls.has(current.id)) return;

    let cancelled = false;
    const fullImage = new Image();
    fullImage.src = current.full;

    void fullImage
      .decode()
      .then(() => {
        if (cancelled) return;
        setReadyFulls((ready) => {
          if (ready.has(current.id)) return ready;
          const next = new Set(ready);
          next.add(current.id);
          return next;
        });
      })
      // A failed large image deliberately leaves the cached preview in place.
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [current, readyFulls]);

  function openImage(order: number, previewSrc: string) {
    const dialog = dialogRef.current;
    const image = images[order];

    setPreview({ id: image.id, src: previewSrc });
    setIndex(order);

    if (!dialog || dialog.open) return;
    dialog.showModal();
    // showModal() focuses the first control, which would reveal the hidden
    // close button on the next key press. Hold focus on the dialog instead;
    // Tab still reaches the controls.
    dialog.focus({ preventScroll: true });
  }

  function step(delta: number) {
    setPreview(null);
    setIndex((i) => (i === null ? i : (i + delta + images.length) % images.length));
  }

  function onClose() {
    setPreview(null);
    setIndex(null);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else return;
    event.preventDefault();
  }

  // Clicks on the dimmed area around the image close it; clicks on the image
  // itself do not.
  function onDialogClick(event: React.MouseEvent<HTMLDialogElement>) {
    const target = event.target as HTMLElement;
    if (target === event.currentTarget || target.classList.contains("paper-references__stage")) {
      dialogRef.current?.close();
    }
  }

  function onTouchStart(event: React.TouchEvent) {
    touchX.current = event.touches[0].clientX;
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = event.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
  }

  return (
    <>
      <h1 id="references-title" className="sr-only">
        References
      </h1>

      <p className="paper-references__intro home-enter">
        A selection of images used as design inspiration and to provide a visual
        representation of my design ideology.
      </p>

      <div className="paper-references__grid">
        {columns.map((column, i) => (
          <div
            key={i}
            className="paper-references__column home-enter"
            style={{ "--enter-delay": `${60 + i * 60}ms` } as React.CSSProperties}
          >
            {column.map(({ reference: image, order }) => (
              <figure
                key={image.id}
                className="paper-references__media"
                style={{ order }}
              >
                <button
                  type="button"
                  className="paper-references__open"
                  aria-label={`${image.alt} — enlarge`}
                  onClick={(event) => {
                    const gridImage = event.currentTarget.querySelector("img");
                    openImage(order, gridImage?.currentSrc || image.src);
                  }}
                >
                  {/* Not next/image: Are.na already serves resized variants. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    srcSet={image.srcSet}
                    sizes="(max-width: 768px) calc(100vw - 40px), 25vw"
                    width={image.unsized ? undefined : image.width}
                    height={image.unsized ? undefined : image.height}
                    alt=""
                    loading={order < EAGER ? "eager" : "lazy"}
                    decoding="async"
                  />
                </button>
              </figure>
            ))}
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="paper-references__lightbox"
        aria-label="Enlarged image"
        tabIndex={-1}
        onClose={onClose}
        onClick={onDialogClick}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* The Paper view is the image alone on a dimmed ground, so the controls
            stay out of sight until a keyboard reaches them. Mouse and touch
            use the backdrop, Esc, the arrow keys, and swipes. */}
        <button
          type="button"
          className="paper-references__control paper-references__close"
          aria-label="Close"
          onClick={() => dialogRef.current?.close()}
        />
        <button
          type="button"
          className="paper-references__control paper-references__step paper-references__step--prev"
          aria-label="Previous image"
          onClick={() => step(-1)}
        />
        <button
          type="button"
          className="paper-references__control paper-references__step paper-references__step--next"
          aria-label="Next image"
          onClick={() => step(1)}
        />
        <p className="sr-only" aria-live="polite">
          {isOpen ? `Image ${index + 1} of ${images.length}` : null}
        </p>

        <div className="paper-references__stage">
          {current && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={current.id}
              src={currentSrc ?? current.src}
              alt={current.alt}
              {...(current.unsized
                ? { className: "is-unsized" }
                : {
                    width: current.width,
                    height: current.height,
                    style: { "--ratio": current.width / current.height } as React.CSSProperties,
                  })}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
