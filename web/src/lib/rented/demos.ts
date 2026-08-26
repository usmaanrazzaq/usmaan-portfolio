/**
 * The three self-running demos embedded in the Rented case study, ported from
 * rented-suggestions-demo.js, rented-profile-tabs-demo.js, and
 * rented-listings-demo.js in the static site.
 *
 * Timings, thresholds, and reduced-motion behaviour are unchanged. The only
 * difference is that each mount returns a teardown, so React can stop the
 * loops instead of the scripts running for the life of the document.
 */

const reduceQuery =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

function prefersReduce() {
  return !!reduceQuery?.matches;
}

/** Re-arms a stack-load entrance: add the intro class, then drop it next frame. */
function prime(el: Element | null) {
  if (!el) return;
  el.classList.add("is-intro");
  void (el as HTMLElement).offsetWidth;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.remove("is-intro");
    });
  });
}

type Lifecycle = {
  /** Begins the loop. */
  start: () => void;
  /** Pauses the loop and returns to the pre-entrance state. */
  stop: () => void;
  /** The resting state used when motion is not wanted. */
  settle: () => void;
};

/**
 * Runs a demo only while it is on screen and the tab is visible, which is what
 * keeps three looping timers off the main thread for a page this long.
 */
function runWhileVisible(root: Element, { start, stop, settle }: Lifecycle) {
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

/**
 * Shared by the suggestions and listings demos: both simply replay one
 * stack-load entrance on a loop, holding the loaded state in between.
 */
function loopStage(root: Element, stage: Element, holdMs: number, resetGapMs: number) {
  let timer: number | null = null;
  let running = false;

  function clearTimer() {
    if (timer === null) return;
    window.clearTimeout(timer);
    timer = null;
  }

  function cycle() {
    timer = null;
    if (!running) return;

    prime(stage);
    timer = window.setTimeout(() => {
      timer = null;
      if (!running) return;
      stage.classList.add("is-intro");
      timer = window.setTimeout(cycle, resetGapMs);
    }, holdMs);
  }

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
      stage.classList.add("is-intro");
    },
    settle() {
      stage.classList.remove("is-intro");
    },
  });
}

/** Suggestion chips stacking in above the search field. */
export function mountSuggestionsDemo(root: Element) {
  const stage = root.querySelector(".rsd__stage");
  if (!stage) return () => {};

  return loopStage(root, stage, 2100, 320);
}

/** Search results stacking into view, scaled to fit the wide slot. */
export function mountListingsDemo(root: Element) {
  const host = root.querySelector<HTMLElement>(".rld");
  const stage = root.querySelector("[data-rld-stage]");
  if (!host || !stage) return () => {};

  const canvas = host;
  const CANVAS_W = 391;
  const CANVAS_H = 560;
  const GUTTER = 40;

  function fit() {
    const w = root.clientWidth - GUTTER;
    const h = root.clientHeight - GUTTER;
    if (w <= 0 || h <= 0) return;
    const scale = Math.min(w / CANVAS_W, h / CANVAS_H);
    canvas.style.setProperty("--rld-scale", Math.min(Math.max(scale, 0.45), 1.6).toFixed(4));
  }

  fit();

  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(root);
  } else {
    window.addEventListener("resize", fit);
  }

  const stopLoop = loopStage(root, stage, 2200, 320);

  return () => {
    stopLoop();
    resizeObserver?.disconnect();
    window.removeEventListener("resize", fit);
  };
}

/** Profile tabs cycling Listed → History → Review with a tap ripple. */
export function mountProfileTabsDemo(root: Element) {
  const TAP_LEAD = 200;
  const HOLD_LISTED = 2100;
  const HOLD_OTHER = 2000;
  const HOLD_BACK = 1500;

  const tabsRoot = root.querySelector<HTMLElement>("[data-rpd-tabs]");
  const btns = tabsRoot
    ? Array.from(tabsRoot.querySelectorAll<HTMLElement>("[data-rpd-tab]"))
    : [];
  const panels = btns.map((btn) =>
    root.querySelector<HTMLElement>(`[data-rpd-panel="${btn.getAttribute("data-rpd-tab")}"]`),
  );
  const tapEl = root.querySelector<HTMLElement>("[data-rpd-tap]");
  const stage = root.querySelector(".rpd");

  if (!tabsRoot || btns.length !== 3 || panels.some((panel) => !panel)) return () => {};

  const tabsEl = tabsRoot;

  let tabIndex = 0;
  let timer: number | null = null;
  let running = false;

  function clearTimer() {
    if (timer === null) return;
    window.clearTimeout(timer);
    timer = null;
  }

  function hideTap() {
    tapEl?.classList.remove("is-on");
  }

  function showTap(target: HTMLElement | undefined) {
    if (!tapEl || !stage || !target) return;
    const stageRect = stage.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    if (!targetRect.width || !stageRect.width) return;

    tapEl.style.left = `${targetRect.left + targetRect.width / 2 - stageRect.left}px`;
    tapEl.style.top = `${targetRect.top + targetRect.height / 2 - stageRect.top}px`;
    tapEl.classList.remove("is-on");
    void tapEl.offsetWidth;
    tapEl.classList.add("is-on");
  }

  function setTab(index: number) {
    if (index === tabIndex) return;
    tabIndex = index;
    tabsEl.style.setProperty("--tab", String(index));
    tabsEl.setAttribute("data-tab", String(index));

    btns.forEach((btn, n) => {
      const selected = n === index;
      btn.classList.toggle("is-active", selected);
      const panel = panels[n];
      if (!panel) return;
      panel.hidden = !selected;
      if (selected) {
        panel.classList.add("is-active");
        prime(panel);
      } else {
        panel.classList.remove("is-active", "is-intro");
      }
    });
  }

  function resetToListedIntro() {
    tabIndex = 0;
    tabsEl.style.setProperty("--tab", "0");
    tabsEl.setAttribute("data-tab", "0");
    btns.forEach((btn, n) => {
      btn.classList.toggle("is-active", n === 0);
      const panel = panels[n];
      if (!panel) return;
      panel.hidden = n !== 0;
      panel.classList.toggle("is-active", n === 0);
      panel.classList.toggle("is-intro", n === 0);
    });
  }

  function after(ms: number, fn: () => void) {
    clearTimer();
    timer = window.setTimeout(() => {
      timer = null;
      if (!running) return;
      fn();
    }, ms);
  }

  function goHistory() {
    showTap(btns[1]);
    after(TAP_LEAD, () => {
      setTab(1);
      after(HOLD_OTHER, goReview);
    });
  }

  function goReview() {
    showTap(btns[2]);
    after(TAP_LEAD, () => {
      setTab(2);
      after(HOLD_OTHER, goListed);
    });
  }

  function goListed() {
    showTap(btns[0]);
    after(TAP_LEAD, () => {
      setTab(0);
      after(HOLD_BACK, goHistory);
    });
  }

  return runWhileVisible(root, {
    start() {
      if (running || prefersReduce()) return;
      running = true;
      clearTimer();
      resetToListedIntro();
      after(400, () => {
        prime(panels[0]);
        after(HOLD_LISTED, goHistory);
      });
    },
    stop() {
      running = false;
      clearTimer();
      hideTap();
      resetToListedIntro();
    },
    settle() {
      resetToListedIntro();
      panels.forEach((panel) => panel?.classList.remove("is-intro"));
    },
  });
}
