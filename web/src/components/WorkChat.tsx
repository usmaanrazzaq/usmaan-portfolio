"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CONTACT_OPEN_EVENT } from "@/components/ContactModal";
import {
  BUBBLE_RECEIVED,
  ChatBubble,
  TypedPlaceholder,
  spoken,
  typingMs,
  type Bubble,
} from "@/components/HomeChat";
import { loadReplies, prefetchPreferred, type LocaleCode, type LocaleReplies } from "@/data/chatLocales";
import { CHAT_PLACEHOLDERS, type ChatCommand } from "@/data/heroChat";
import type { WorkMeta } from "@/components/WorkSection";
import {
  INITIAL_CONTEXT,
  detectLanguage,
  replyLanguage,
  respond,
  type ChatContext,
} from "@/lib/chatMatcher";
import type { Reaction, Reactions } from "@/lib/chatReactions";
import { respondAboutWork } from "@/lib/workMatcher";

/** The same beats as the hero chat, so the two feel like one conversation partner. */
const PAUSE_MS = 120;
const COMMAND_DELAY_MS = 400;
/** An "open the case study" reply skips the typing and goes almost at once. */
const OPEN_DELAY_MS = 150;
const READ_DELAY_MS = 300;
const MAX_EXTRA = 30;
/** The nav's own reveal timings: a 500ms slide and a 400ms fade. */
const GLIDE_MS = 500;
const FADE_OUT_MS = 400;
/** How far below the pane's top a bubble starts to fade, and how faint it gets. */
const FADE_ZONE_PX = 110;
const FADE_FLOOR_LATEST = 0.85;
const FADE_FLOOR_OLDER = 0.4;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The hero's composer bar, while any of it is still on screen. */
function visibleHeroBar() {
  const bar = document.querySelector<HTMLElement>("[data-chat-bar]");
  if (!bar) return null;
  const rect = bar.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight ? rect : null;
}

/**
 * The chat, docked at the bottom of the screen while the work section is in
 * view. It glides down out of the hero's composer as the section arrives and
 * back up into it on the way out; with nothing of the hero on screen (a
 * `/#work` link, say) it simply rises into place.
 *
 * The conversation itself is keyed to the work in view, so moving to another
 * work starts it over: empty thread, the tab back on, fresh placeholders.
 */
export default function WorkChat({ work, docked }: { work: WorkMeta; docked: boolean }) {
  const dockRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Timed like the nav's own reveal (paper-home.css, "Hero chrome"), and run
  // as browser animations of transform and opacity, so they stay smooth while
  // the page scrolls. On the way down the composer glides out of the hero's
  // bar to the foot of the screen, a fixed destination it always lands on. On
  // the way up nothing chases the scroll: the docked composer folds its tab,
  // drops back, and fades, while the hero's own bar fades in where it belongs.
  useLayoutEffect(() => {
    const dock = dockRef.current;
    const root = document.documentElement;
    if (!dock) return;
    if (first.current) {
      first.current = false;
      if (!docked) return;
    }

    const reduce = prefersReducedMotion();
    const bar = dock.querySelector<HTMLElement>(".work-chat__bar");
    const animates = !reduce && bar !== null && typeof bar.animate === "function";

    if (docked) {
      dock.classList.remove("is-leaving");
      dock.classList.add("is-shown");
      root.setAttribute("data-work-docked", "");
      if (!animates) return;
      const hero = visibleHeroBar();
      const to = bar!.getBoundingClientRect();
      const frames = hero
        ? [
            { transform: `translate(${hero.left - to.left}px, ${hero.top - to.top}px)` },
            { transform: "none" },
          ]
        : [
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "none" },
          ];
      const animation = bar!.animate(frames, { duration: GLIDE_MS, easing: EASE });
      return () => animation.cancel();
    }

    // `is-shown` is set here rather than rendered, so it can outlast `docked`
    // while the fade plays; the hero's bar starts fading in straight away.
    dock.classList.add("is-leaving");
    root.removeAttribute("data-work-docked");
    const hide = () => dock.classList.remove("is-shown", "is-leaving");
    if (!animates) {
      hide();
      return;
    }
    const animation = bar!.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: "translateY(8px)" },
      ],
      { duration: FADE_OUT_MS, easing: EASE, fill: "forwards" },
    );
    animation.onfinish = () => {
      hide();
      animation.cancel();
    };
    return () => animation.cancel();
  }, [docked]);

  useEffect(() => () => document.documentElement.removeAttribute("data-work-docked"), []);

  // The thread may grow up to the foot of the work's media and no further, so
  // its faded top edge is where older bubbles go, not over the work. Kept up to
  // date through the snap scroll and any resize.
  useEffect(() => {
    const dock = dockRef.current;
    const media = document.querySelector<HTMLElement>(`#work-${work.slug} .paper-home__case-media`);
    if (!dock || !media) return;

    let frame = 0;
    function measure() {
      frame = 0;
      const bar = dock!.querySelector<HTMLElement>(".work-chat__bar");
      if (!bar) return;
      const gap = parseFloat(getComputedStyle(dock!).rowGap) || 0;
      const room = bar.getBoundingClientRect().top - gap - media!.getBoundingClientRect().bottom;
      const height = Math.max(160, Math.min(499, Math.round(room)));
      dock!.style.setProperty("--work-thread-max", `${height}px`);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [work.slug]);

  return (
    <div
      ref={dockRef}
      className="work-chat"
      inert={!docked}
    >
      <WorkConversation key={work.slug} work={work} leaving={!docked} />
    </div>
  );
}

function WorkConversation({ work, leaving }: { work: WorkMeta; leaving: boolean }) {
  const [extra, setExtra] = useState<Bubble[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  // Whether questions are about this work; the tab's close button turns it off.
  const [scoped, setScoped] = useState(true);
  const [status, setStatus] = useState("");
  const [statusLang, setStatusLang] = useState<LocaleCode>("en");
  const [reactions, setReactions] = useState<Reactions>({});
  const [openFor, setOpenFor] = useState<string | null>(null);

  const timers = useRef(new Set<number>());
  const nextId = useRef(0);
  const turn = useRef(0);
  const conversation = useRef<ChatContext>(INITIAL_CONTEXT);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // On the way back to the hero the composer speaks generally again, as the
  // hero's own does, even before the tab is closed.
  const aboutWork = scoped && !leaving;
  const phrases = useMemo(
    () =>
      aboutWork
        ? [
            `Ask me about my work at ${work.shortTitle}`,
            `Ask me about the outcomes for ${work.shortTitle}`,
            `Ask me about the problem at ${work.shortTitle}`,
          ]
        : CHAT_PLACEHOLDERS,
    [aboutWork, work.shortTitle],
  );

  function later(run: () => void, ms: number) {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      run();
    }, ms);
    timers.current.add(id);
  }

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  // New bubbles land at the bottom; keep them in view.
  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    scroll.scrollTop = scroll.scrollHeight;
    fadeRows();
  }, [extra.length, typing]);

  // Bubbles thin out as they near the top of the pane, toward the work. The
  // latest question and everything after it, its answer, stay nearly solid;
  // older turns fade further.
  function fadeRows() {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const rows = Array.from(scroll.querySelectorAll<HTMLElement>(".work-chat__list > li"));
    let latest = 0;
    rows.forEach((row, index) => {
      if (row.classList.contains("is-sent")) latest = index;
    });
    const top = scroll.getBoundingClientRect().top;
    rows.forEach((row, index) => {
      const floor = index >= latest ? FADE_FLOOR_LATEST : FADE_FLOOR_OLDER;
      const near = (row.getBoundingClientRect().top - top) / FADE_ZONE_PX;
      const amount = Math.min(1, Math.max(0, near));
      row.style.opacity = String(floor + (1 - floor) * amount);
    });
  }

  function addExtra(bubble: Bubble) {
    setExtra((previous) => [...previous, bubble].slice(-MAX_EXTRA));
  }

  function run(command: ChatCommand) {
    if ("scroll" in command) {
      document
        .getElementById(command.scroll)
        ?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
      return;
    }
    if ("contact" in command) {
      window.dispatchEvent(new Event(CONTACT_OPEN_EVENT));
      return;
    }
    window.location.assign(command.open);
  }

  function answer(text: string, locale: LocaleReplies | null) {
    const reply = scoped
      ? respondAboutWork(work.slug, text, conversation.current, locale)
      : respond(text, conversation.current, locale);
    conversation.current = reply.context;
    const lang = reply.lang === "en" ? undefined : reply.lang;
    if (reply.action && !("open" in reply.action)) inputRef.current?.blur();

    const messages: Bubble[] = reply.bubbles.map((bubble) =>
      typeof bubble === "string"
        ? { text: bubble, id: `work-reply-${nextId.current++}`, lang }
        : { ...bubble, id: `work-reply-${nextId.current++}` },
    );

    function deliver(index: number) {
      setTyping(true);
      later(() => {
        addExtra(messages[index]);
        if (index + 1 < messages.length) {
          later(() => deliver(index + 1), PAUSE_MS);
          return;
        }
        setTyping(false);
        setStatusLang(reply.lang);
        setStatus(`Usmaan: ${reply.bubbles.map((bubble) => spoken(bubble, locale)).join(" ")}`);
        const action = reply.action;
        if (action) later(() => run(action), COMMAND_DELAY_MS);
      }, typingMs(messages[index]));
    }

    // Asked to open a page: no typing dots, no pause. The reply lands at once
    // so the visitor sees it was understood, and the page opens right after.
    const action = reply.action;
    if (action && "open" in action) {
      messages.forEach(addExtra);
      setStatusLang(reply.lang);
      setStatus(`Usmaan: ${reply.bubbles.map((bubble) => spoken(bubble, locale)).join(" ")}`);
      later(() => run(action), OPEN_DELAY_MS);
      return;
    }

    deliver(0);
  }

  /** The reply, worked out now, if it opens a page: those skip the read beat. */
  function opensPage(text: string) {
    const reply = scoped
      ? respondAboutWork(work.slug, text, conversation.current)
      : respond(text, conversation.current);
    return reply.action !== undefined && "open" in reply.action;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    // The newest message wins: whatever the last one left pending is dropped.
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.clear();
    const current = ++turn.current;
    setTyping(false);
    setStatus("");
    setDraft("");
    setOpenFor(null);

    const written = detectLanguage(text);
    addExtra({
      id: `work-visitor-${nextId.current++}`,
      text,
      from: "me",
      lang: written && written !== "en" ? written : undefined,
    });

    if (opensPage(text)) {
      answer(text, null);
      return;
    }

    let locale: LocaleReplies | null | undefined;
    let read = false;
    const ready = () => {
      if (read && locale !== undefined) answer(text, locale);
    };
    later(() => {
      read = true;
      ready();
    }, READ_DELAY_MS);
    void loadReplies(replyLanguage(text, conversation.current)).then((loaded) => {
      if (current !== turn.current) return;
      locale = loaded;
      ready();
    });
  }

  function react(id: string, reaction: Reaction) {
    setReactions((previous) => {
      const next: Record<string, Reaction> = { ...previous };
      if (previous[id] === reaction) delete next[id];
      else next[id] = reaction;
      return next;
    });
    setOpenFor(null);
  }

  const hasThread = extra.length > 0 || typing;

  return (
    <>
      <div
        ref={scrollRef}
        className={`work-chat__thread${hasThread ? " is-shown" : ""}`}
        aria-hidden={!hasThread}
        onScroll={fadeRows}
      >
        <ol className="work-chat__list" aria-label={`Conversation about ${work.title}`}>
          {extra.map((bubble) => (
            <ChatBubble
              key={bubble.id}
              bubble={bubble}
              reaction={reactions[bubble.id]}
              open={openFor === bubble.id}
              onOpen={() => setOpenFor(bubble.id)}
              onClose={() => setOpenFor(null)}
              onReact={(reaction) => react(bubble.id, reaction)}
            />
          ))}
          {typing && (
            <li className="home-chat__row" aria-hidden="true">
              <div className={`${BUBBLE_RECEIVED} home-chat__typing`}>
                <span />
                <span />
                <span />
              </div>
            </li>
          )}
        </ol>
      </div>

      <p className="sr-only" role="status" aria-live="polite" lang={statusLang}>
        {status}
      </p>

      <form
        className="work-chat__bar home-chat__composer home-chat__glass flex h-11.25 w-full min-w-0 items-center gap-2 rounded-pill px-2 to-md:px-1.5"
        onSubmit={handleSubmit}
      >
        {scoped && (
          <button
            type="button"
            className="work-chat__tab"
            onClick={() => {
              // Closing the tab closes the conversation about this work too:
              // the thread clears, and a reply still being typed is dropped.
              timers.current.forEach((id) => window.clearTimeout(id));
              timers.current.clear();
              turn.current++;
              setExtra([]);
              setTyping(false);
              setReactions({});
              setOpenFor(null);
              setStatus("");
              setScoped(false);
              conversation.current = { ...conversation.current, offer: null };
              inputRef.current?.focus();
            }}
            aria-label={`Stop asking about ${work.title}`}
            title={`Stop asking about ${work.title}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="truncate">{work.title}</span>
          </button>
        )}

        <span className="relative flex min-w-0 flex-1 pl-1">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onFocus={() => {
              setFocused(true);
              prefetchPreferred();
            }}
            onBlur={() => setFocused(false)}
            aria-label={
              scoped
                ? `Ask Usmaan about ${work.title}: the outcomes, the problem, or the process.`
                : "Message Usmaan. Ask a question, or type about, explorations, references, or contact."
            }
            dir="auto"
            autoComplete="off"
            autoCapitalize="off"
            enterKeyHint="send"
            maxLength={140}
            className="text-ink min-w-0 flex-1 bg-transparent text-sm leading-[18px] font-normal outline-none"
          />
          {!draft && !focused && (
            <TypedPlaceholder
              key={aboutWork ? work.slug : "general"}
              focused={focused}
              phrases={phrases}
            />
          )}
        </span>

        <button
          type="submit"
          aria-label="Send"
          className="bg-bubble-sent flex size-7.5 shrink-0 items-center justify-center rounded-pill text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5L12 19" />
            <path d="M6 11L12 5L18 11" />
          </svg>
        </button>
      </form>
    </>
  );
}
