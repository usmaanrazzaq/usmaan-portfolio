"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";

export type CsDirectoryItem = { id: string; label: string };

/**
 * How close to the viewport top (px) a heading has to climb before its entry
 * takes over. It has to stay near the 40px `scroll-margin-top` a click lands a
 * heading on: any lower and, after jumping to a short section, the next
 * heading is already past the line and steals the highlight.
 */
const ACTIVE_LINE = 100;

/**
 * The section list in a case study's left margin. Each entry points at a
 * section's `<h2 id>` — headings rather than `<section>`s, because a section
 * like Shifts' "Components" is only a heading with its figures as siblings.
 *
 * Clicking scrolls to the heading; the smoothness (and its reduced-motion
 * opt-out) comes from the `scroll-behavior` rule in paper-cs.css. The active
 * entry otherwise follows the scroll position.
 */
export default function CsDirectory({ items }: { items: CsDirectoryItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  // The entry under the pointer or keyboard focus. The pill glides to it and
  // settles back on the active entry when the pointer leaves the list.
  const [hoverId, setHoverId] = useState<string | null>(null);
  const pillIndex = Math.max(
    0,
    items.findIndex((item) => item.id === (hoverId ?? activeId)),
  );
  // Set while a click's scroll is in flight, so the highlight stays on the
  // clicked entry instead of stepping through every section on the way.
  const lockRef = useRef<number | null>(null);

  useEffect(() => {
    let frame = 0;

    function sync() {
      frame = 0;
      if (lockRef.current !== null) return;

      const scroller = document.documentElement;
      const atBottom = window.innerHeight + window.scrollY >= scroller.scrollHeight - 2;

      let current = items[0]?.id;
      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (!heading) continue;
        if (atBottom || heading.getBoundingClientRect().top <= ACTIVE_LINE) current = item.id;
      }
      setActiveId(current);
    }

    function requestSync() {
      if (!frame) frame = requestAnimationFrame(sync);
    }

    function unlock() {
      if (lockRef.current === null) return;
      window.clearTimeout(lockRef.current);
      lockRef.current = null;
      requestSync();
    }

    requestSync();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    window.addEventListener("scrollend", unlock);
    // The visitor taking over mid-scroll cancels the smooth scroll.
    window.addEventListener("wheel", unlock, { passive: true });
    window.addEventListener("touchmove", unlock, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (lockRef.current !== null) window.clearTimeout(lockRef.current);
      lockRef.current = null;
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      window.removeEventListener("scrollend", unlock);
      window.removeEventListener("wheel", unlock);
      window.removeEventListener("touchmove", unlock);
    };
  }, [items]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const heading = document.getElementById(id);
    if (!heading) return;

    event.preventDefault();
    setActiveId(id);

    // `scrollend` releases the lock; the timeout covers browsers without it
    // and a click on a heading that is already in place, which never scrolls.
    if (lockRef.current !== null) window.clearTimeout(lockRef.current);
    lockRef.current = window.setTimeout(() => {
      lockRef.current = null;
    }, 1000);

    heading.scrollIntoView();
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav className="paper-cs__directory" aria-label="Directory">
      <p className="paper-cs__directory-title">Directory</p>
      <ul
        style={{ "--pill-index": pillIndex } as CSSProperties}
        onMouseLeave={() => setHoverId(null)}
      >
        <li className="paper-cs__directory-pill" aria-hidden="true" />
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={item.id === activeId ? "true" : undefined}
              onMouseEnter={() => setHoverId(item.id)}
              onFocus={() => setHoverId(item.id)}
              onBlur={() => setHoverId(null)}
              onClick={(event) => handleClick(event, item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
