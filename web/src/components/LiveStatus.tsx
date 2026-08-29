"use client";

import { useEffect, useRef } from "react";

/**
 * Location plus the live New York clock. The clock is driven imperatively, the
 * same way the static site does it, so only the digits that actually changed
 * get the roll animation and the pulse restarts in sync with each tick.
 *
 * The hero passes its own className to reach the frame's 12px light setting; the
 * default below is the type this row has everywhere else.
 */
const DEFAULT_CLASS =
  "text-muted mb-3 flex items-center gap-1.5 text-sm leading-[1.5] font-normal whitespace-nowrap to-sm:min-h-6 to-sm:flex-wrap to-sm:whitespace-normal";

export default function LiveStatus({ className }: { className?: string }) {
  const timeRef = useRef<HTMLTimeElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const dayNightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let previous = "";

    function update() {
      const time = timeRef.current;
      if (!time) return;

      const now = new Date().toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      if (now === previous) return;

      const previousChars = previous.split("");
      time.replaceChildren(
        ...now.split("").map((char, index) => {
          const span = document.createElement("span");
          span.className =
            previous !== "" && previousChars[index] !== char
              ? "time-digit changing"
              : "time-digit";
          span.textContent = char;
          return span;
        }),
      );

      previous = now;

      const dayNight = dayNightRef.current;
      if (dayNight) {
        const hour = parseInt(
          new Date().toLocaleString("en-US", {
            timeZone: "America/New_York",
            hour: "numeric",
            hour12: false,
          }),
          10,
        );
        const isDay = hour >= 7 && hour < 19;
        dayNight.classList.toggle("is-day", isDay);
        dayNight.classList.toggle("is-night", !isDay);
      }

      // Restart the beat in sync with the tick (reflow trick).
      const live = liveRef.current;
      if (live) {
        live.classList.remove("is-beating");
        void live.offsetWidth;
        live.classList.add("is-beating");
      }
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className ?? DEFAULT_CLASS} aria-label="Current location and local time">
      <span ref={liveRef} className="hero-live" aria-hidden="true" />
      <span>New York, NY</span>
      <span className="opacity-40" aria-hidden="true">
        /
      </span>
      <time ref={timeRef} className="local-time" id="local-time" />
      <span ref={dayNightRef} className="hero-daynight" aria-hidden="true">
        <svg
          className="dn-sun"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
        </svg>
        <svg
          className="dn-moon"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
        </svg>
      </span>
    </div>
  );
}
