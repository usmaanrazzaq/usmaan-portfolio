/**
 * The tapbacks a visitor leaves on the hero's chat bubbles.
 *
 * They are the visitor's own: kept in their browser, never sent anywhere, and
 * shown back to them on the next visit. A tiny external store rather than
 * component state so HomeChat can read it through useSyncExternalStore, which
 * renders the empty server snapshot first and so hydrates cleanly.
 */

export const REACTIONS = ["heart", "up", "down", "haha", "emphasis", "question"] as const;

export type Reaction = (typeof REACTIONS)[number];

export type Reactions = Readonly<Record<string, Reaction>>;

export const CHAT_REACTIONS_KEY = "chat-reactions";

const EMPTY: Reactions = {};

let cache: Reactions | null = null;
const listeners = new Set<() => void>();

function read(): Reactions {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(CHAT_REACTIONS_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object") return EMPTY;

    const out: Record<string, Reaction> = {};
    for (const [id, value] of Object.entries(parsed)) {
      if ((REACTIONS as readonly unknown[]).includes(value)) out[id] = value as Reaction;
    }
    return out;
  } catch {
    // Private mode, blocked storage, or a value something else wrote.
    return EMPTY;
  }
}

export function subscribeReactions(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getReactions(): Reactions {
  return (cache ??= read());
}

export function getServerReactions(): Reactions {
  return EMPTY;
}

/**
 * Sets, replaces, or (with null) removes the tapback on one bubble. Only ids
 * in `persist` are written to storage: a visitor's own typed bubbles are gone
 * on the next load, so their reactions live for the session only.
 */
export function setReaction(id: string, reaction: Reaction | null, persist: readonly string[]) {
  const next: Record<string, Reaction> = { ...getReactions() };
  if (reaction) next[id] = reaction;
  else delete next[id];
  cache = next;

  try {
    const stored = Object.fromEntries(Object.entries(next).filter(([key]) => persist.includes(key)));
    localStorage.setItem(CHAT_REACTIONS_KEY, JSON.stringify(stored));
  } catch {
    // Private mode or blocked storage: the reaction still shows for this visit.
  }

  listeners.forEach((listener) => listener());
}
