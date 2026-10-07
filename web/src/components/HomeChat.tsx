"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { CONTACT_OPEN_EVENT } from "@/components/ContactModal";
import LiveStatus from "@/components/LiveStatus";
import {
  CHAT_COMMANDS,
  CHAT_HINT,
  HERO_CHAT,
  type ChatIcon,
  type ChatMessage,
} from "@/data/heroChat";
import {
  REACTIONS,
  getReactions,
  getServerReactions,
  setReaction,
  subscribeReactions,
  type Reaction,
} from "@/lib/chatReactions";

/** A scripted bubble, a visitor's own (`from: "me"`), or a reply to one. */
type Bubble = ChatMessage & { from?: "me" };

/** Only the scripted bubbles outlive a reload, so only their tapbacks are stored. */
const SCRIPTED_IDS = HERO_CHAT.map((message) => message.id);

/** The beat before the first typing dots, so the header lands first. */
const START_DELAY_MS = 500;
/** The breath between one bubble landing and the next being "typed". */
const PAUSE_MS = 120;
/** How long a visitor's own bubble sits before its command runs. */
const COMMAND_DELAY_MS = 400;
const REPLY_DELAY_MS = 900;
const LONG_PRESS_MS = 450;
/** Enough of a visitor's side of the thread to scroll back through. */
const MAX_EXTRA = 30;

/** Longer messages take longer to "type"; the link bubbles arrive as a burst. */
function typingMs(message: ChatMessage) {
  return message.href ? 320 : Math.min(1300, 520 + message.text.length * 6);
}

const REACTION_LABELS: Record<Reaction, string> = {
  heart: "Heart",
  up: "Thumbs up",
  down: "Thumbs down",
  haha: "Ha ha",
  emphasis: "Emphasis",
  question: "Question",
};

const BUBBLE_BASE =
  "home-chat__bubble flex items-center gap-[5px] rounded-xl px-3 py-2 text-sm leading-[18px] font-normal [overflow-wrap:anywhere]";
const BUBBLE_RECEIVED = `${BUBBLE_BASE} bg-bubble text-ink rounded-bl-xs`;
const BUBBLE_SENT = `${BUBBLE_BASE} bg-bubble-sent rounded-br-xs text-white`;

/**
 * The homepage hero, ported from the "Hero v1" Paper frame: a message thread
 * from Usmaan. The scripted bubbles are sent one at a time behind typing dots,
 * every bubble takes an iMessage-style tapback, and the composer is a small
 * command line: "portfolio" scrolls to the work stack, "about", "playground",
 * and "references" open those pages, "contact" opens the contact modal.
 *
 * The server renders the finished thread, hidden, and the sequence replays it
 * once this mounts. Without JS (the <noscript> rule), with reduced motion (the
 * media query in paper-home.css), or when the script arrives after the CSS
 * fallback has already shown it, the finished thread simply stays.
 */
export default function HomeChat() {
  const [booted, setBooted] = useState(false);
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [extra, setExtra] = useState<Bubble[]>([]);
  const [draft, setDraft] = useState("");
  const [openFor, setOpenFor] = useState<string | null>(null);
  // What a screen reader is told about the visitor's own turns. The scripted
  // thread is never announced: it is there to be read, not narrated at them.
  const [status, setStatus] = useState("");

  const reactions = useSyncExternalStore(subscribeReactions, getReactions, getServerReactions);

  const timers = useRef(new Set<number>());
  const nextId = useRef(0);
  const scrollRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTop = useRef<number | null>(null);

  function later(run: () => void, ms: number) {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      run();
    }, ms);
    timers.current.add(id);
  }

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.clear();
  }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function send(index: number) {
      setTyping(true);
      later(() => {
        setCount(index + 1);
        if (index + 1 === HERO_CHAT.length) setTyping(false);
        else later(() => send(index + 1), PAUSE_MS);
      }, typingMs(HERO_CHAT[index]));
    }

    // The sequence only plays when this has the thread from the start. If it
    // is already on screen (the CSS fallback gave up waiting for a slow
    // script, or reduced motion never hid it), blanking it to type it out
    // again would be a step backwards, so settle on the finished thread.
    const list = listRef.current;
    const shown = !list || getComputedStyle(list).visibility === "visible";
    const settle = reduce || shown;

    later(() => {
      setBooted(true);
      setCount(settle ? HERO_CHAT.length : 0);
      if (!settle) later(() => send(0), START_DELAY_MS);
    }, 0);

    return clearTimers;
  }, []);

  // Each arrival grows the thread, which moves everything already in it. Play
  // that move instead of letting it jump: start the list where it was and ease
  // it to where it now is. offsetTop ignores the transform, so a bubble landing
  // mid-animation still measures the real layout.
  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    const list = listRef.current;
    if (!scroll || !list) return;

    scroll.scrollTop = scroll.scrollHeight;
    const top = list.offsetTop - scroll.scrollTop;
    const from = lastTop.current;
    lastTop.current = top;

    if (!booted || from === null || from === top || typeof list.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    list.animate([{ transform: `translateY(${from - top}px)` }, { transform: "none" }], {
      duration: 360,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    });
  }, [booted, count, typing, extra.length]);

  function addExtra(bubble: Bubble) {
    setExtra((previous) => [...previous, bubble].slice(-MAX_EXTRA));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft.trim());
  }

  function sendMessage(text: string) {
    if (!text) return;

    // The newest message is the one that counts: whatever the last one left
    // pending (its hint, its scroll, its navigation) is dropped, so two quick
    // sends cannot both run or leave the typing dots behind.
    clearTimers();
    setTyping(false);
    setStatus("");

    // Writing in before the script has finished skips to the end of it.
    if (!booted || count < HERO_CHAT.length) {
      setBooted(true);
      setCount(HERO_CHAT.length);
    }

    setDraft("");
    setOpenFor(null);
    addExtra({ id: `visitor-${nextId.current++}`, text, from: "me" });

    const word = text
      .toLowerCase()
      .match(/[a-z]+/g)
      ?.find((candidate) => Object.hasOwn(CHAT_COMMANDS, candidate));
    const command = word ? CHAT_COMMANDS[word] : null;

    if (!command) {
      setTyping(true);
      later(() => {
        addExtra({ id: `reply-${nextId.current++}`, text: CHAT_HINT });
        setTyping(false);
        setStatus(`Usmaan: ${CHAT_HINT}`);
      }, REPLY_DELAY_MS);
      return;
    }

    if ("scroll" in command) {
      // Drop the keyboard on touch so the scroll is not fought by it. The URL
      // stays at `/`: writing the hash would make the next load skip the hero.
      inputRef.current?.blur();
      later(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setStatus("Showing selected work.");
        document
          .getElementById(command.scroll)
          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      }, COMMAND_DELAY_MS);
      return;
    }

    if ("contact" in command) {
      // The modal takes focus and hands it back on close, so let go of the
      // field first or the keyboard reopens under it on touch.
      inputRef.current?.blur();
      later(() => {
        setStatus("Opening the contact form.");
        window.dispatchEvent(new Event(CONTACT_OPEN_EVENT));
      }, COMMAND_DELAY_MS);
      return;
    }

    // A real navigation, like the nav's own links: the Rented prototype script
    // mounts once per document load, so the routes are never client-side.
    setStatus(`Opening the ${word} page.`);
    later(() => window.location.assign(command.open), COMMAND_DELAY_MS);
  }

  function react(id: string, reaction: Reaction) {
    setReaction(id, reactions[id] === reaction ? null : reaction, SCRIPTED_IDS);
    setOpenFor(null);
  }

  const scripted: Bubble[] = booted ? HERO_CHAT.slice(0, count) : HERO_CHAT;
  const bubbles = [...scripted, ...extra];

  return (
    <div className="home-chat">
      <header className="flex shrink-0 flex-col items-start gap-2.5 py-2.5">
        <div className="home-enter flex items-center gap-2.5 [--enter-delay:100ms]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/usmaan-avatar.jpg"
            width={50}
            height={50}
            alt=""
            className="home-chat__avatar bg-media size-[50px] shrink-0 rounded-full border-[0.5px] border-[#b8b8b880] object-cover"
          />
          <h1 id="home-title" className="text-ink text-sm leading-[18px] font-normal">
            Usmaan Razzaq
          </h1>
        </div>

        <LiveStatus className="home-enter text-muted mb-3 flex items-center gap-1.5 self-stretch text-xs leading-[1.5] font-light whitespace-nowrap [--enter-delay:180ms] to-sm:min-h-6 to-sm:flex-wrap to-sm:whitespace-normal" />
      </header>

      <div className="home-chat__thread">
        {/* The finished script, laid out but never shown: it holds the thread
            open at its final height, so the bubbles arriving above it move
            nothing outside the thread and a short screen still fits them all. */}
        <ol className="home-chat__list home-chat__ghost" aria-hidden="true">
          {HERO_CHAT.map((message) => (
            <li key={message.id} className="home-chat__row">
              <div className="home-chat__wrap">
                <div className={BUBBLE_RECEIVED}>
                  {message.icon && <span className="size-3.5 shrink-0" />}
                  <span>{message.text}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* A labelled section, not a live log: a log would read all nine
            scripted bubbles out as they land. The status line below speaks for
            the visitor's own turns instead. */}
        <section
          ref={scrollRef}
          className={`home-chat__scroll${extra.length > 0 ? " is-scrollable" : ""}`}
          aria-label="Messages from Usmaan"
        >
          <ol ref={listRef} className={`home-chat__list${booted ? "" : " is-booting"}`}>
            {bubbles.map((bubble) => (
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
        </section>

        <p className="sr-only" role="status" aria-live="polite">
          {status}
        </p>

        <noscript>
          <style>{".home-chat__list.is-booting{visibility:visible;animation:none}"}</style>
        </noscript>
      </div>

      <div className="home-chat__bar home-enter relative flex shrink-0 items-start gap-[5px] [--enter-delay:260ms]">
        <ChatMenu />

        <form
          className="home-chat__composer home-chat__glass flex h-10 min-w-0 flex-1 items-center justify-between gap-2 rounded-pill pr-2 pl-3"
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type 'Portfolio' to see work"
            aria-label="Message Usmaan. Type portfolio, about, playground, references, or contact."
            autoComplete="off"
            autoCapitalize="off"
            enterKeyHint="send"
            maxLength={140}
            className="text-ink min-w-0 flex-1 bg-transparent text-sm leading-[18px] font-normal outline-none placeholder:text-[#929292]"
          />
          <button
            type="submit"
            aria-label="Send"
            className="bg-bubble-sent flex size-[35px] shrink-0 items-center justify-center rounded-pill text-white"
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
      </div>
    </div>
  );
}

const MENU_ID = "home-chat-menu";
const MENU = "home-chat__menu home-chat__glass";

/** The site's routes, with the frame's 16px line icons (24px viewBox paths). */
const MENU_ITEMS = [
  {
    label: "Home",
    // The spec's document-top fragment, as the nav's own Home tab uses here.
    href: "#top",
    paths: [
      "M5 9.5V20C5 20.552 5.448 21 6 21H18C18.552 21 19 20.552 19 20V9.5",
      "M14 15H10V21H14V15Z",
      "M3 11L12 3L21 11",
    ],
  },
  {
    label: "About",
    href: "/about/",
    paths: [
      "M12 11C14.209 11 16 9.209 16 7C16 4.791 14.209 3 12 3C9.791 3 8 4.791 8 7C8 9.209 9.791 11 12 11Z",
      "M19 21V19C19 16.791 17.209 15 15 15H9C6.791 15 5 16.791 5 19V21",
    ],
  },
  {
    label: "Playground",
    href: "/playground/",
    paths: [
      "M12 18C11.172 18 10.5 18.871 10.5 19.944C10.5 21.333 12 23 12 23C12 23 13.5 21.333 13.5 19.944C13.5 18.871 12.828 18 12 18Z",
      "M12 8H12.01",
      "M10.5 14.5H13.5M10.5 14.5L8 17.5L5 12.5L8.839 11M10.5 14.5C10.045 13.931 9.279 12.648 8.839 11M13.5 14.5C14.167 13.667 15.5 11.3 15.5 8.5C15.5 5.7 13.167 3 12 2C10.833 3 8.5 5.7 8.5 8.5C8.5 9.389 8.634 10.234 8.839 11M13.5 14.5C13.955 13.931 14.721 12.648 15.161 11L19 12.5L16 17.5L13.5 14.5Z",
    ],
  },
  {
    label: "References",
    href: "/references/",
    // The microscope's tilted barrel is a rotated rect, not a path.
    barrel: true,
    paths: [
      "M10.793 8C15.077 8.601 21.868 12.83 15.793 21",
      "M6.292 16H10.293",
      "M3.292 21H21.293",
    ],
  },
  {
    label: "Contact",
    // ContactModal intercepts this link and opens over the page.
    href: "/contact/",
    paths: [
      "M3 6C3 5.448 3.448 5 4 5H20C20.552 5 21 5.448 21 6V18C21 18.552 20.552 19 20 19H4C3.448 19 3 18.552 3 18V6Z",
      "M4 6L12 13L20 6",
    ],
  },
];

function MenuIcon({ paths, barrel }: { paths: string[]; barrel?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      {barrel && (
        <rect
          x="7.234"
          y="2.615"
          width="4.727"
          height="8.273"
          rx="1"
          transform="rotate(15 7.234 2.615)"
        />
      )}
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/**
 * The button beside the composer and the menu it opens: the site's routes in a
 * frosted card that rises from the button, for the stretch of the homepage
 * where the nav itself is out of the way. The links are plain anchors, like
 * the nav's, so every route is a real document load.
 */
function ChatMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    function onPointerDown(event: globalThis.PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function handleMenuKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    const links = Array.from(event.currentTarget.querySelectorAll("a"));
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    event.preventDefault();
    links[(index + step + links.length) % links.length]?.focus();
  }

  return (
    <div
      ref={wrapRef}
      className="relative shrink-0"
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        setOpen(false);
        buttonRef.current?.focus();
      }}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (open && next instanceof Node && !event.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="home-chat__menu-button home-chat__glass text-ink flex size-10 items-center justify-center rounded-pill"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpen((value) => !value)}
      >
        <MenuIcon paths={MENU_ITEMS[0].paths} />
      </button>

      {/* Always mounted, so closing can be played as well as opening. Closed,
          it is visibility:hidden, which also takes it out of the tab order and
          the accessibility tree. */}
      <nav
        ref={menuRef}
        id={MENU_ID}
        className={open ? `${MENU} is-open` : MENU}
        aria-label="Site"
        onKeyDown={handleMenuKeyDown}
      >
        {MENU_ITEMS.map((item) => (
          <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
            <MenuIcon paths={item.paths} barrel={"barrel" in item} />
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

/**
 * One bubble and its tapback. The corner button is the way in on a pointer or
 * keyboard. On touch, where nothing hovers, a tap on a text bubble opens the
 * same picker, and a long press does on any bubble (a tap on a link bubble has
 * to stay the link). A double click with a mouse hearts a text bubble, as it
 * does in Messages.
 */
function ChatBubble({
  bubble,
  reaction,
  open,
  onOpen,
  onClose,
  onReact,
}: {
  bubble: Bubble;
  reaction: Reaction | undefined;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onReact: (reaction: Reaction) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const press = useRef<{ timer: number; x: number; y: number } | null>(null);
  const swallowClick = useRef(false);
  const lastPointer = useRef("mouse");

  const sent = bubble.from === "me";

  // A layout effect, so the picker is placed before it is first painted.
  useLayoutEffect(() => {
    if (!open) return;

    const picker = pickerRef.current;
    // The picker hangs off the bubble's left edge, which on a short bubble
    // already carries it out past the corner button. A bubble wider than the
    // picker would leave it stranded at the far end from that button, so
    // there it lines up with the bubble's right edge instead.
    const wrap = wrapRef.current;
    if (picker && wrap) picker.classList.toggle("is-end", wrap.offsetWidth > picker.offsetWidth);

    (
      picker?.querySelector<HTMLButtonElement>('[aria-pressed="true"]') ??
      picker?.querySelector<HTMLButtonElement>("button")
    )?.focus();

    function onPointerDown(event: globalThis.PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) onClose();
    }

    document.addEventListener("pointerdown", onPointerDown);

    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      // The picker held focus and is now gone. If nothing else took it (a click
      // on empty page, say), hand it back to the button that opened the picker
      // rather than leaving it on <body>.
      requestAnimationFrame(() => {
        const active = document.activeElement;
        if (!active || active === document.body) trigger?.focus({ preventScroll: true });
      });
    };
    // onClose is a fresh closure each render; it only ever clears the open id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => cancelPress(), []);

  function cancelPress() {
    if (!press.current) return;
    window.clearTimeout(press.current.timer);
    press.current = null;
  }

  function handlePointerDown(event: PointerEvent) {
    swallowClick.current = false;
    lastPointer.current = event.pointerType;
    if (event.pointerType === "mouse") return;

    cancelPress();
    press.current = {
      x: event.clientX,
      y: event.clientY,
      timer: window.setTimeout(() => {
        press.current = null;
        // The press was for the picker, so the link under it must not open.
        swallowClick.current = true;
        onOpen();
      }, LONG_PRESS_MS),
    };
  }

  function handlePointerMove(event: PointerEvent) {
    const start = press.current;
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) cancelPress();
  }

  function handlePickerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    const buttons = Array.from(event.currentTarget.querySelectorAll("button"));
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const step = event.key === "ArrowRight" ? 1 : -1;
    event.preventDefault();
    buttons[(index + step + buttons.length) % buttons.length]?.focus();
  }

  function choose(next: Reaction) {
    onReact(next);
    triggerRef.current?.focus();
  }

  const pressHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: cancelPress,
    onPointerCancel: cancelPress,
    onPointerLeave: cancelPress,
    onContextMenu: (event: React.MouseEvent) => {
      if (press.current || swallowClick.current) event.preventDefault();
    },
    onClickCapture: (event: React.MouseEvent) => {
      if (!swallowClick.current) return;
      swallowClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };

  const content = (
    <>
      {bubble.icon && <ChatIconGlyph icon={bubble.icon} />}
      <span>{bubble.text}</span>
    </>
  );

  return (
    <li className={`home-chat__row${sent ? " is-sent" : ""}`}>
      <div
        ref={wrapRef}
        className={`home-chat__wrap${reaction ? " has-reaction" : ""}${open ? " is-open" : ""}`}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || !open) return;
          onClose();
          triggerRef.current?.focus();
        }}
        onBlur={(event) => {
          // Tabbing on past the picker closes it; focus is already on its way
          // to the next control, so there is nothing to restore.
          const next = event.relatedTarget;
          if (open && next instanceof Node && !event.currentTarget.contains(next)) onClose();
        }}
      >
        {bubble.href ? (
          <a
            href={bubble.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BUBBLE_RECEIVED} no-underline`}
            {...pressHandlers}
          >
            {content}
          </a>
        ) : (
          <p
            className={sent ? BUBBLE_SENT : BUBBLE_RECEIVED}
            onClick={() => {
              // Touch and pen only: a mouse has the corner button on hover.
              if (lastPointer.current === "mouse") return;
              if (open) onClose();
              else onOpen();
            }}
            onDoubleClick={() => {
              // On touch the first tap has already opened the picker.
              if (lastPointer.current !== "mouse") return;
              window.getSelection()?.removeAllRanges();
              onReact("heart");
            }}
            {...pressHandlers}
          >
            {sent && <span className="sr-only">You: </span>}
            {content}
          </p>
        )}

        <button
          ref={triggerRef}
          type="button"
          className="home-chat__tapback"
          aria-label={
            reaction
              ? `Your reaction: ${REACTION_LABELS[reaction]}. Change reaction`
              : "Add reaction"
          }
          aria-expanded={open}
          onClick={() => (open ? onClose() : onOpen())}
        >
          {reaction ? <ReactionGlyph reaction={reaction} /> : <AddReactionGlyph />}
        </button>

        {open && (
          <div
            ref={pickerRef}
            className="home-chat__picker"
            role="group"
            aria-label="Reactions"
            onKeyDown={handlePickerKeyDown}
          >
            {REACTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-label={REACTION_LABELS[option]}
                aria-pressed={reaction === option}
                onClick={() => choose(option)}
              >
                <ReactionGlyph reaction={option} />
              </button>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

/**
 * The six tapbacks, drawn the way current iOS does: its own coloured marks
 * rather than the emoji keyboard's. The thumbs are the system emoji, which is
 * what iOS uses too; the heart and the three lettered marks are drawn here so
 * they keep their pink, blue, red, and purple on every platform.
 */
function ReactionGlyph({ reaction }: { reaction: Reaction }) {
  switch (reaction) {
    case "heart":
      return (
        <svg className="home-chat__glyph-heart" viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <linearGradient id="home-chat-heart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffa3d1" />
              <stop offset="1" stopColor="#ff5aa9" />
            </linearGradient>
          </defs>
          <path
            fill="url(#home-chat-heart)"
            d="M12 21.2c-.4 0-.8-.1-1.1-.4C6.3 17.300 2 13.700 2 9.300 2 6.300 4.300 4 7.200 4c1.900 0 3.700 1 4.800 2.600C13.100 5 14.900 4 16.800 4 19.700 4 22 6.300 22 9.300c0 4.400-4.300 8-8.900 11.500-.3.300-.7.400-1.100.4Z"
          />
        </svg>
      );
    case "up":
      return (
        <span className="home-chat__emoji" aria-hidden="true">
          {"\u{1F44D}"}
        </span>
      );
    case "down":
      return (
        <span className="home-chat__emoji" aria-hidden="true">
          {"\u{1F44E}"}
        </span>
      );
    case "haha":
      return (
        <span className="home-chat__glyph-text home-chat__glyph-text--haha" aria-hidden="true">
          HA
          <br />
          HA
        </span>
      );
    case "emphasis":
      return (
        <span className="home-chat__glyph-text home-chat__glyph-text--emphasis" aria-hidden="true">
          !!
        </span>
      );
    case "question":
      return (
        <span className="home-chat__glyph-text home-chat__glyph-text--question" aria-hidden="true">
          ?
        </span>
      );
  }
}

function AddReactionGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 11v1a10 10 0 1 1-9-10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01M15 9h.01" />
      <path d="M16 5h6M19 2v6" />
    </svg>
  );
}

/**
 * The link bubbles' 14px marks. LinkedIn and Instagram keep their brand
 * colours, as the frame draws them; the rest take the bubble's ink so they
 * survive the dark theme.
 */
function ChatIconGlyph({ icon }: { icon: ChatIcon }) {
  const size = { width: 14, height: 14, className: "shrink-0", "aria-hidden": true } as const;

  switch (icon) {
    case "linkedin":
      return (
        <svg {...size} viewBox="0 0 256 256">
          <path
            fill="#0A66C2"
            d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
          />
        </svg>
      );
    case "instagram":
      // Four stacked gradients: kept as a file rather than inlined.
      // eslint-disable-next-line @next/next/no-img-element
      return <img {...size} src="/hero/icon-instagram.svg" alt="" />;
    case "github":
      return (
        <svg {...size} viewBox="0 0 1024 1024" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28s87.04 5.76 128 17.28c97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0"
          />
        </svg>
      );
    case "x":
      return (
        <svg {...size} viewBox="0 0 1200 1227" fill="currentColor">
          <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
        </svg>
      );
    case "resume":
      return (
        <svg
          {...size}
          viewBox="0 0 21 21"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.375 3.5C4.375 3.017 4.767 2.625 5.25 2.625H12.25L16.625 7V17.5C16.625 17.983 16.233 18.375 15.75 18.375H5.25C4.767 18.375 4.375 17.983 4.375 17.5V3.5Z" />
          <path d="M11.375 2.625V7.875H16.625" />
          <path d="M13.125 11.375L7.875 11.375" />
          <path d="M8.75 7.875L7.875 7.875" />
          <path d="M13.125 14.875L7.875 14.875" />
        </svg>
      );
  }
}
