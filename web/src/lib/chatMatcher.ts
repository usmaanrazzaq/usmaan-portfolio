/**
 * Decides what the homepage chat says back. `respond` is pure: it takes the
 * visitor's message and the conversation so far, and returns the bubbles to
 * send, an optional command to run after them, and the conversation's next
 * state. The content lives in src/data/chatKnowledge.ts.
 *
 * Matching is deliberately simple. A message is lowercased and split into
 * words; each topic scores the number of distinct words its phrases cover,
 * times its weight, and the best score wins (ties go to the earlier topic). A
 * word matches its plural, and a long word survives one typo.
 */

import {
  HANDOFF,
  INTENTS,
  MISSES,
  MISSES_BEFORE_HANDOFF,
  type Intent,
  type ReplyBubble,
} from "@/data/chatKnowledge";
import type { ChatCommand } from "@/data/heroChat";

export type ChatContext = {
  /** The topic a "yes" would lead to: whatever the last reply offered. */
  offer: string | null;
  /** Misses in a row, so the second one can hand off to the real Usmaan. */
  misses: number;
  /** How often each topic (and the miss reply) has been used, to vary the wording. */
  seen: Readonly<Record<string, number>>;
};

export const INITIAL_CONTEXT: ChatContext = { offer: null, misses: 0, seen: {} };

export type ChatReply = {
  /** The topic answered, or null for a miss. */
  intent: string | null;
  bubbles: ReplyBubble[];
  action?: ChatCommand;
  context: ChatContext;
};

/** Words that do not change what a lone command word means ("show me the work"). */
const FILLER = new Set(
  "a at can check go i just let lets look me my open out page please see show some take the to view want your".split(
    " ",
  ),
);

export function words(text: string): string[] {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['‘’`]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** Within one edit (insert, delete, substitute, or swap two neighbours). */
function oneEditApart(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.slice(i + 1) === b.slice(i + 1)) return true; // substitute
  if (a.slice(i + 1) === b.slice(i)) return true; // a has an extra letter
  if (a.slice(i) === b.slice(i + 1)) return true; // b has an extra letter
  return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2); // swap
}

/** 1 for the same word, a little less for a typo of it, 0 otherwise. */
function likeness(word: string, target: string) {
  if (word === target) return 1;
  if (target.length >= 3 && (word === `${target}s` || target === `${word}s`)) return 1;
  if (word.length >= 6 && target.length >= 6 && oneEditApart(word, target)) return 0.75;
  return 0;
}

type Compiled = { intent: Intent; phrases: string[][]; bare: string[] };

const COMPILED: Compiled[] = INTENTS.map((intent) => ({
  intent,
  phrases: (intent.phrases ?? []).map(words),
  bare: intent.bare ?? [],
}));

const BY_ID = new Map(INTENTS.map((intent) => [intent.id, intent]));

/** The distinct words of the message this topic's phrases account for. */
function score({ intent, phrases }: Compiled, tokens: string[]) {
  const covered = new Map<number, number>();

  for (const phrase of phrases) {
    for (let start = 0; start + phrase.length <= tokens.length; start++) {
      const parts = phrase.map((word, offset) => likeness(tokens[start + offset], word));
      if (parts.some((part) => part === 0)) continue;
      parts.forEach((part, offset) => {
        const at = start + offset;
        covered.set(at, Math.max(covered.get(at) ?? 0, part));
      });
    }
  }

  let total = 0;
  covered.forEach((part) => (total += part));
  return total * (intent.weight ?? 1);
}

function bareMatch(tokens: string[]) {
  const meaningful = tokens.filter((token) => !FILLER.has(token));
  if (meaningful.length !== 1) return null;
  const [word] = meaningful;
  return COMPILED.find(({ bare }) => bare.some((target) => likeness(word, target) > 0))?.intent ?? null;
}

function bestMatch(tokens: string[]) {
  let best: Intent | null = null;
  let bestScore = 0;
  for (const compiled of COMPILED) {
    const value = score(compiled, tokens);
    if (value > bestScore) {
      best = compiled.intent;
      bestScore = value;
    }
  }
  return best;
}

function variant<T>(options: T[], count: number) {
  return options[count % options.length];
}

export function respond(text: string, context: ChatContext): ChatReply {
  const tokens = words(text);
  const matched = tokens.length > 0 ? (bareMatch(tokens) ?? bestMatch(tokens)) : null;

  // "Yes" takes up whatever was just offered; "no" turns it down. With nothing
  // on offer, they get their own small replies.
  let intent = matched;
  if (intent?.kind === "affirm" && context.offer) intent = BY_ID.get(context.offer) ?? intent;

  if (!intent) {
    const misses = context.misses + 1;
    const seenMisses = context.seen.miss ?? 0;
    const handoff = misses >= MISSES_BEFORE_HANDOFF;
    return {
      intent: null,
      bubbles: handoff ? HANDOFF : variant(MISSES, seenMisses),
      context: {
        offer: handoff ? "contact-open" : null,
        misses: handoff ? 0 : misses,
        seen: handoff ? context.seen : { ...context.seen, miss: seenMisses + 1 },
      },
    };
  }

  const count = context.seen[intent.id] ?? 0;
  let bubbles = variant(intent.replies, count);

  // "Hi, what do you use to design?" answers the question, but says hello.
  if (intent.id !== "greeting" && tokens.length > 1) {
    const greeting = COMPILED.find((compiled) => compiled.intent.id === "greeting");
    if (greeting && score(greeting, tokens.slice(0, 2)) > 0) bubbles = ["Hey!", ...bubbles];
  }

  return {
    intent: intent.id,
    bubbles,
    action: intent.action,
    context: {
      offer: intent.more ?? null,
      misses: 0,
      seen: { ...context.seen, [intent.id]: count + 1 },
    },
  };
}
