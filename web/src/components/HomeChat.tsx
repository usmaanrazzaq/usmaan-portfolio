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

const QUICK_REPLIES = ["Portfolio", "About", "Playground", "Contact"];

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
 * command line: "portfolio" scrolls to the work stack, "about" and
 * "playground" open those pages, "contact" opens the contact modal.
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

  const reactions = useSyncExternalStore(subscribeReactions, getReactions, getServerReactions);

  const timers = useRef(new Set<number>());
  const nextId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
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
      }, REPLY_DELAY_MS);
      return;
    }

    if ("scroll" in command) {
      // Drop the keyboard on touch so the scroll is not fought by it. The URL
      // stays at `/`: writing the hash would make the next load skip the hero.
      inputRef.current?.blur();
      later(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      later(() => window.dispatchEvent(new Event(CONTACT_OPEN_EVENT)), COMMAND_DELAY_MS);
      return;
    }

    // A real navigation, like the nav's own links: the Rented prototype script
    // mounts once per document load, so the routes are never client-side.
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
            className="bg-media size-[50px] shrink-0 rounded-full border-[0.5px] border-[#b8b8b880] object-cover"
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

        <div
          ref={scrollRef}
          className={`home-chat__scroll${extra.length > 0 ? " is-scrollable" : ""}`}
          role="log"
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
        </div>

        <noscript>
          <style>{".home-chat__list.is-booting{visibility:visible;animation:none}"}</style>
        </noscript>
      </div>

      {/* The composer's commands as one-tap replies, for anyone who would
          rather not type: each is sent as the visitor's own bubble. */}
      <div
        className="home-chat__chips home-enter [--enter-delay:220ms]"
        role="group"
        aria-label="Quick replies"
      >
        {QUICK_REPLIES.map((reply) => (
          <button key={reply} type="button" onClick={() => sendMessage(reply)}>
            {reply}
          </button>
        ))}
      </div>

      <form
        className="home-chat__composer home-enter border-chat-border flex h-[50px] shrink-0 items-center justify-between gap-2 rounded-pill border-[0.5px] py-2 pr-2 pl-3 [--enter-delay:260ms]"
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type 'Portfolio' to see work"
          aria-label="Message Usmaan. Type portfolio, about, playground, or contact."
          autoComplete="off"
          autoCapitalize="off"
          enterKeyHint="send"
          maxLength={140}
          className="text-ink min-w-0 flex-1 bg-transparent text-sm leading-[18px] font-normal outline-none placeholder:text-[#929292]"
        />
        <button
          type="submit"
          aria-label="Send"
          className="bg-bubble-sent flex size-10 shrink-0 items-center justify-center rounded-pill text-white"
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
  );
}

/**
 * One bubble and its tapback. The corner button is the way in on a pointer or
 * keyboard; on touch, where nothing hovers, a long press opens the same picker.
 * A double click hearts a text bubble, as it does in Messages.
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

  const sent = bubble.from === "me";

  useEffect(() => {
    if (!open) return;

    const picker = pickerRef.current;
    (
      picker?.querySelector<HTMLButtonElement>('[aria-pressed="true"]') ??
      picker?.querySelector<HTMLButtonElement>("button")
    )?.focus();

    function onPointerDown(event: globalThis.PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) onClose();
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
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
            onDoubleClick={() => {
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

/** The system emoji for each reaction, the set Messages offers. */
const REACTION_EMOJI: Record<Reaction, string> = {
  heart: "\u2764\uFE0F",
  up: "\u{1F44D}",
  down: "\u{1F44E}",
  haha: "\u{1F602}",
  emphasis: "\u203C\uFE0F",
  question: "\u2753",
};

function ReactionGlyph({ reaction }: { reaction: Reaction }) {
  return (
    <span className="home-chat__emoji" aria-hidden="true">
      {REACTION_EMOJI[reaction]}
    </span>
  );
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
