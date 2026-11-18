/**
 * Decides what the homepage chat says back. `respond` is pure: it takes the
 * visitor's message, the conversation so far, and (for a language other than
 * English) that language's replies, and returns the bubbles to send, an
 * optional command to run after them, and the conversation's next state. The
 * content lives in src/data/chatKnowledge.ts and src/data/chatLocales/.
 *
 * Matching is deliberately simple. A message is folded (lowercase, no
 * accents) and split into words; each topic scores the number of distinct
 * words its phrases cover, times its weight, and the best score wins (ties go
 * to the earlier topic). A Latin word matches its plural, and a long one
 * survives one typo. Every language's phrases are matched together, so a
 * message that mixes languages ("Rented について教えて") still finds its topic.
 *
 * The language of the reply is worked out separately (`replyLanguage`): from
 * the script for Telugu, Urdu and Japanese, and from telltale words for the
 * Latin-script languages. A message that gives nothing away ("ok", "Rented")
 * keeps the language the chat was already using.
 */

import {
  HANDOFF,
  INTENTS,
  MISSES,
  MISSES_BEFORE_HANDOFF,
  type Intent,
  type ReplyBubble,
} from "@/data/chatKnowledge";
import { KEYWORDS } from "@/data/chatLocales/keywords";
import type { LocaleCode, LocaleReplies, OtherLocale } from "@/data/chatLocales/types";
import type { ChatCommand } from "@/data/heroChat";

export type ChatContext = {
  /** The topic a "yes" would lead to: whatever the last reply offered. */
  offer: string | null;
  /** Misses in a row, so the second one can hand off to the real Usmaan. */
  misses: number;
  /** How often each topic (and the miss reply) has been used, to vary the wording. */
  seen: Readonly<Record<string, number>>;
  /** The language the chat is replying in. */
  lang: LocaleCode;
  /** Chosen in the menu, so it holds whatever the visitor types. */
  pinned: boolean;
};

export const INITIAL_CONTEXT: ChatContext = {
  offer: null,
  misses: 0,
  seen: {},
  lang: "en",
  pinned: false,
};

export type ChatReply = {
  /** The topic answered, or null for a miss. */
  intent: string | null;
  bubbles: ReplyBubble[];
  /** The language the bubbles are written in. */
  lang: LocaleCode;
  action?: ChatCommand;
  context: ChatContext;
};

const OTHER_LOCALES = Object.keys(KEYWORDS) as OtherLocale[];

/*
 * Built with `new RegExp` so the Unicode property escapes do not depend on the
 * compile target.
 */
const CJK = new RegExp("[\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}]", "u");
const TELUGU = new RegExp("\\p{Script=Telugu}", "u");
const ARABIC = new RegExp("\\p{Script=Arabic}", "u");
const NOT_A_LETTER = new RegExp("[^\\p{L}\\p{M}\\p{N}]+", "u");
const LATIN_WORD = /^[a-z0-9]+$/;

/** Japanese has no spaces between words, so it needs a real word breaker. */
const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter("ja", { granularity: "word" })
    : null;

/**
 * Folds a message into the words matching works on. Accents go (so "café"
 * matches "cafe"), as do the vowel marks Urdu leaves optional and the joiners
 * Telugu keyboards slip in; the letters Urdu and Arabic keyboards type
 * differently are made the same.
 */
export function words(text: string): string[] {
  const folded = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/[ً-ٰٟ‌‍]/g, "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ه/g, "ہ")
    .replace(/['‘’`]/g, "");

  if (segmenter && CJK.test(folded)) {
    return Array.from(segmenter.segment(folded))
      .filter((part) => part.isWordLike)
      .map((part) => part.segment);
  }
  return folded.split(NOT_A_LETTER).filter(Boolean);
}

/** Words that do not change what a lone command word means ("show me the work"). */
const FILLER = new Set([
  ..."a at can check go i just let lets look me my open out page please see show some take the to view want your".split(
    " ",
  ),
  ...OTHER_LOCALES.flatMap((code) => (KEYWORDS[code].filler ?? []).flatMap(words)),
]);

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

/** 1 for the same word, a little less for a typo or an inflection of it, 0 otherwise. */
function likeness(word: string, target: string) {
  if (word === target) return 1;
  if (LATIN_WORD.test(word) && LATIN_WORD.test(target)) {
    if (target.length >= 3 && (word === `${target}s` || target === `${word}s`)) return 1;
    if (word.length >= 6 && target.length >= 6 && oneEditApart(word, target)) return 0.75;
    return 0;
  }
  // Telugu and Urdu add endings to a word ("ప్రాజెక్టులు", "پروجیکٹس"), so
  // a long enough word stem stands for the word.
  if (
    target.length >= 4 &&
    word.startsWith(target) &&
    (TELUGU.test(target) || ARABIC.test(target))
  ) {
    return 0.9;
  }
  return 0;
}

type Compiled = { intent: Intent; phrases: string[][]; bare: string[] };

/** Each topic's phrases in every language, English first. */
const COMPILED: Compiled[] = INTENTS.map((intent) => ({
  intent,
  phrases: [
    ...(intent.phrases ?? []),
    ...OTHER_LOCALES.flatMap((code) => KEYWORDS[code].phrases[intent.id] ?? []),
  ].map(words),
  bare: [
    ...(intent.bare ?? []),
    ...OTHER_LOCALES.flatMap((code) => KEYWORDS[code].bare?.[intent.id] ?? []),
  ].flatMap(words),
}));

const BY_ID = new Map(INTENTS.map((intent) => [intent.id, intent]));

/** Which words of the message these phrases account for, and how well. */
function coverage(phrases: string[][], tokens: string[]) {
  const covered = new Map<number, number>();

  for (const phrase of phrases) {
    if (phrase.length === 0) continue;
    for (let start = 0; start + phrase.length <= tokens.length; start++) {
      const parts = phrase.map((word, offset) => likeness(tokens[start + offset], word));
      if (parts.some((part) => part === 0)) continue;
      parts.forEach((part, offset) => {
        const at = start + offset;
        covered.set(at, Math.max(covered.get(at) ?? 0, part));
      });
    }
  }

  return covered;
}

function score(compiled: Compiled, tokens: string[]) {
  let total = 0;
  coverage(compiled.phrases, tokens).forEach((part) => (total += part));
  return total * (compiled.intent.weight ?? 1);
}

function bareMatch(tokens: string[]) {
  const meaningful = tokens.filter((token) => !FILLER.has(token));
  if (meaningful.length !== 1) return null;
  const [word] = meaningful;
  return COMPILED.find(({ bare }) => bare.some((target) => likeness(word, target) > 0))?.intent ?? null;
}

function bestMatch(tokens: string[], among: Compiled[] = COMPILED): Intent | null {
  let best: Compiled | null = null;
  let bestScore = 0;
  for (const compiled of among) {
    const value = score(compiled, tokens);
    if (value > bestScore) {
      best = compiled;
      bestScore = value;
    }
  }
  if (!best?.intent.kind) return best?.intent ?? null;

  // "Yes" or "tell me more" wins on word count alone, so a real question
  // riding along with it ("tell me more about your process") would be lost to
  // whatever the last reply offered. If another topic matches any word the
  // follow-up does not account for, answer that topic instead.
  const own = coverage(best.phrases, tokens);
  const rest = tokens.map((_, at) => at).filter((at) => !own.has(at));
  if (rest.length === 0) return best.intent;
  const topical = among.filter(
    (compiled) =>
      !compiled.intent.kind && rest.some((at) => coverage(compiled.phrases, tokens).has(at)),
  );
  return bestMatch(tokens, topical) ?? best.intent;
}

/* ------------------------------------------------------------------------ */
/* Which language                                                            */
/* ------------------------------------------------------------------------ */

const LATIN_LOCALES = ["en", "de", "fr", "es", "pt"] as const;
type LatinLocale = (typeof LATIN_LOCALES)[number];

/** English words that only English uses; see LocaleKeywords.stopwords. */
const ENGLISH_STOPWORDS = [
  "the", "what", "whats", "you", "your", "youre", "is", "are", "how", "who", "where", "why",
  "and", "of", "tell", "can", "does", "did", "this", "that", "with", "have", "has", "about",
  "it", "im", "i", "would", "could", "like",
];

/**
 * Words every language here borrows from English, so they say nothing about
 * which one the visitor speaks: "super" or "ok" from a German speaker must not
 * switch the chat to English, nor "super" from an English speaker to German.
 */
const LOANWORDS = new Set(
  (
    "ok okay super top cool wow bravo show hi hey hello bye ciao design designer app apps " +
    "chat bot test team portfolio freelance remote online web site email mail ux ui figma " +
    "shopify webflow startup moodboard data personas interviews usability"
  ).split(" "),
);

/**
 * Each Latin language's own phrases, for telling them apart. English leaves
 * out names (projects, social sites), which say nothing about the language,
 * and any phrase another language also uses ("portfolio", "no").
 */
const OWN_PHRASES: Record<LatinLocale, string[][]> = (() => {
  const foreign = (code: Exclude<LatinLocale, "en">) => [
    ...Object.values(KEYWORDS[code].phrases).flat(),
    ...Object.values(KEYWORDS[code].bare ?? {}).flat(),
  ];
  const shared = new Set(
    (["de", "fr", "es", "pt"] as const).flatMap(foreign).map((phrase) => words(phrase).join(" ")),
  );
  const english = INTENTS.filter((intent) => !intent.weight)
    .flatMap((intent) => [...(intent.phrases ?? []), ...(intent.bare ?? [])])
    .map(words)
    .filter((phrase) => !shared.has(phrase.join(" ")));

  return {
    en: english,
    de: foreign("de").map(words),
    fr: foreign("fr").map(words),
    es: foreign("es").map(words),
    pt: foreign("pt").map(words),
  };
})();

/** Lowercase words with their accents kept, for the stopword check. */
function rawWords(text: string) {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/['‘’`]/g, "")
    .split(NOT_A_LETTER)
    .filter(Boolean);
}

const stopwords = (list: string[] = []) => new Set(list.flatMap(rawWords));

const STOPWORDS: Record<LatinLocale, Set<string>> = {
  en: stopwords(ENGLISH_STOPWORDS),
  de: stopwords(KEYWORDS.de.stopwords),
  fr: stopwords(KEYWORDS.fr.stopwords),
  es: stopwords(KEYWORDS.es.stopwords),
  pt: stopwords(KEYWORDS.pt.stopwords),
};

/**
 * The language a message is written in, or null when it does not say
 * ("ok", "Rented", "design"). Telugu, Urdu and Japanese are told by their
 * script; the Latin languages by which one's words cover the most of it.
 */
export function detectLanguage(text: string): LocaleCode | null {
  if (TELUGU.test(text)) return "te";
  if (ARABIC.test(text)) return "ur";
  if (CJK.test(text)) return "ja";

  const tokens = words(text);
  // Stopwords are checked with their accents on: "é" and "e" are different
  // words in Portuguese.
  const raw = rawWords(text);

  const scores = LATIN_LOCALES.map((code) => {
    // Summed, not counted, so a typo-level match ("contacto" for English
    // "contact") loses to the exact word in its own language.
    let value = 0;
    coverage(OWN_PHRASES[code], tokens).forEach((part, at) => {
      if (!LOANWORDS.has(tokens[at])) value += part;
    });
    for (const word of raw) if (STOPWORDS[code].has(word)) value++;
    if (code === "es" && /[¿¡]/.test(text)) value += 2;
    return { code, value };
  }).sort((a, b) => b.value - a.value);

  const [first, second] = scores;
  return first.value > 0 && first.value > second.value ? first.code : null;
}

/** The language to answer this message in. */
export function replyLanguage(text: string, context: ChatContext): LocaleCode {
  if (context.pinned) return context.lang;
  return detectLanguage(text) ?? context.lang;
}

/* ------------------------------------------------------------------------ */
/* Replying                                                                  */
/* ------------------------------------------------------------------------ */

function variant<T>(options: T[], count: number) {
  return options[count % options.length];
}

function repliesFor(intent: Intent, locale: LocaleReplies | null) {
  if (!locale) return intent.replies;
  return intent.localize?.(locale) ?? locale.topics[intent.id] ?? intent.replies;
}

/**
 * `locale` is the reply language's content, loaded by the caller (see
 * src/data/chatLocales/index.ts). Without it, the reply is in English.
 */
export function respond(
  text: string,
  context: ChatContext,
  locale: LocaleReplies | null = null,
): ChatReply {
  const wanted = replyLanguage(text, context);
  const content = wanted === "en" ? null : locale;
  const lang: LocaleCode = content ? wanted : "en";
  const nextLang = context.pinned ? context.lang : wanted;

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
      bubbles: handoff
        ? (content?.handoff ?? HANDOFF)
        : variant(content?.misses ?? MISSES, seenMisses),
      lang,
      context: {
        ...context,
        lang: nextLang,
        offer: handoff ? "contact-open" : null,
        misses: handoff ? 0 : misses,
        seen: handoff ? context.seen : { ...context.seen, miss: seenMisses + 1 },
      },
    };
  }

  const count = context.seen[intent.id] ?? 0;
  let bubbles = variant(repliesFor(intent, content), count);
  let seen: Record<string, number> = { ...context.seen, [intent.id]: count + 1 };

  // "Hi, what do you use to design?" answers the question, but says hello.
  if (intent.id !== "greeting" && tokens.length > 1) {
    const greeting = COMPILED.find((compiled) => compiled.intent.id === "greeting");
    if (greeting && score(greeting, tokens.slice(0, 2)) > 0) {
      bubbles = [content?.ui.hello ?? "Hey!", ...bubbles];
    }
  }

  // The pages and the contact form are only in English, so say so, once,
  // before sending someone to one.
  const action = intent.action;
  if (content && action && !("scroll" in action) && !seen.english) {
    bubbles = [...bubbles, "open" in action ? content.ui.pageInEnglish : content.ui.formInEnglish];
    seen = { ...seen, english: 1 };
  }

  return {
    intent: intent.id,
    bubbles,
    lang,
    action,
    context: {
      ...context,
      lang: nextLang,
      offer: intent.more ?? null,
      misses: 0,
      seen,
    },
  };
}
