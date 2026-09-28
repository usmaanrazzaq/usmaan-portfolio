/**
 * Runtime shared by the self-running case study demos (Rented, Shifts): the
 * on-screen gate, the stack-load re-arm, and — for the Shifts demos — a beat
 * timeline, a typewriter, and canvas fitting.
 */

const reduceQuery =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

export function prefersReduce() {
  return !!reduceQuery?.matches;
}

/** Re-arms a stack-load entrance: add the intro class, then drop it next frame. */
export function prime(el: Element | null) {
  if (!el) return;
  el.classList.add("is-intro");
  void (el as HTMLElement).offsetWidth;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.remove("is-intro");
    });
  });
}

export type Lifecycle = {
  /** Begins the loop. */
  start: () => void;
  /** Pauses the loop and returns to the pre-entrance state. */
  stop: () => void;
  /** The resting state used when motion is not wanted. */
  settle: () => void;
};

/**
 * Runs a demo only while it is on screen and the tab is visible, which is what
 * keeps several looping timers off the main thread for a long page.
 */
export function runWhileVisible(root: Element, { start, stop, settle }: Lifecycle) {
  if (prefersReduce()) {
    settle();
    return () => {};
  }

  let inView = false;

  const observer =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (inView) return;
                inView = true;
                if (!document.hidden) start();
              } else {
                if (!inView) return;
                inView = false;
                stop();
              }
            });
          },
          { threshold: 0.35 },
        )
      : null;

  if (observer) {
    observer.observe(root);
  } else {
    inView = true;
    start();
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stop();
    } else if (inView) {
      start();
    }
  }

  function onReduceChange() {
    if (prefersReduce()) {
      stop();
      settle();
    } else if (inView) {
      start();
    }
  }

  document.addEventListener("visibilitychange", onVisibilityChange);
  reduceQuery?.addEventListener("change", onReduceChange);

  return () => {
    observer?.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    reduceQuery?.removeEventListener("change", onReduceChange);
    stop();
  };
}

/** Applies `mutate` with transitions off, so a reset lands instantly. */
export function snap(el: HTMLElement, mutate: () => void) {
  el.classList.add("is-snap");
  mutate();
  void el.offsetWidth;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.remove("is-snap");
    });
  });
}

/** One moment in a demo, `at` ms after the loop starts. */
export type Beat = { at: number; run: () => void };

/**
 * Types `text` into the field's `[data-val]` child, one character per beat.
 * The field carries `is-typing` (caret) while it runs and `has-value` after.
 */
export function typeBeats(field: HTMLElement | null, text: string, at: number, msPerChar = 55): Beat[] {
  const val = field?.querySelector<HTMLElement>("[data-val]");
  if (!field || !val) return [];

  const beats: Beat[] = [
    {
      at,
      run: () => {
        val.textContent = "";
        field.classList.add("is-typing", "has-value");
      },
    },
  ];
  for (let n = 1; n <= text.length; n++) {
    beats.push({ at: at + n * msPerChar, run: () => (val.textContent = text.slice(0, n)) });
  }
  beats.push({
    at: at + text.length * msPerChar + 350,
    run: () => field.classList.remove("is-typing"),
  });
  return beats;
}

type BeatLoop = {
  /** Snaps back to the empty, pre-demo state. */
  reset: () => void;
  beats: Beat[];
  /** When the filled state starts fading out. */
  leaveAt: number;
  /** Full cycle length; the next cycle starts from `reset`. */
  loopMs: number;
};

/**
 * Plays `beats` on one timer chain and repeats. Reduced motion jumps straight
 * to the filled end state by running every beat at once.
 */
export function loopBeats(root: Element, canvas: HTMLElement, { reset, beats, leaveAt, loopMs }: BeatLoop) {
  const sorted = [...beats].sort((a, b) => a.at - b.at);
  let timer: number | null = null;
  let running = false;
  let index = 0;
  let t0 = 0;

  function clearTimer() {
    if (timer === null) return;
    window.clearTimeout(timer);
    timer = null;
  }

  function restore() {
    snap(canvas, () => {
      canvas.classList.remove("is-leaving");
      reset();
    });
  }

  function tick() {
    timer = null;
    if (!running) return;
    const elapsed = performance.now() - t0;
    while (index < sorted.length && sorted[index].at <= elapsed) sorted[index++].run();

    if (index < sorted.length) {
      timer = window.setTimeout(tick, sorted[index].at - elapsed);
    } else if (elapsed < leaveAt) {
      timer = window.setTimeout(tick, leaveAt - elapsed);
    } else if (!canvas.classList.contains("is-leaving")) {
      canvas.classList.add("is-leaving");
      timer = window.setTimeout(cycle, Math.max(0, loopMs - elapsed));
    }
  }

  function cycle() {
    timer = null;
    if (!running) return;
    restore();
    index = 0;
    t0 = performance.now();
    tick();
  }

  restore();

  return runWhileVisible(root, {
    start() {
      if (running || prefersReduce()) return;
      running = true;
      clearTimer();
      cycle();
    },
    stop() {
      running = false;
      clearTimer();
      restore();
    },
    settle() {
      restore();
      sorted.forEach((beat) => beat.run());
    },
  });
}

/**
 * Scales a fixed-size canvas so it spans `fraction` of the frame's width, as
 * the component did on its 800px Paper artboard, without outgrowing the frame.
 */
export function fitCanvas(root: HTMLElement, canvas: HTMLElement, fraction: number) {
  function fit() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (!w || !h || !root.clientWidth) return;
    const scale = Math.min((root.clientWidth * fraction) / w, (root.clientHeight * 0.94) / h);
    canvas.style.setProperty("--shd-scale", scale.toFixed(4));
  }

  fit();

  if (typeof ResizeObserver === "undefined") {
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }

  const observer = new ResizeObserver(fit);
  observer.observe(root);
  return () => observer.disconnect();
}
