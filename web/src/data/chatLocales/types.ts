/**
 * The shapes behind the homepage chat's other languages. English lives in
 * src/data/chatKnowledge.ts and stays the source of truth; every other
 * language is split in two:
 *
 * - `keywords/<code>.ts`: the words that point at each topic, bundled with
 *   the matcher, because finding the topic (and the language) needs them all.
 * - `replies/<code>.ts`: what is said back, loaded only once that language
 *   turns up (see ./index.ts), so the homepage does not carry seven scripts.
 *
 * Any topic a language leaves out falls back to English, so adding an English
 * topic never breaks another language; it just answers in English there until
 * it is translated.
 */

import type { ReplyBubble } from "@/data/chatKnowledge";
import type { Project } from "@/data/projects";

export type LocaleCode = "en" | "de" | "fr" | "es" | "pt" | "te" | "ur" | "ja";
export type OtherLocale = Exclude<LocaleCode, "en">;

export type LocaleKeywords = {
  /** Extra phrases per topic id, matched exactly like the English ones. */
  phrases: Record<string, string[]>;
  /** Extra one-word commands per topic id ("kontakt" opens the contact form). */
  bare?: Record<string, string[]>;
  /** Words that do not change what a lone command word means ("zeig mir"). */
  filler?: string[];
  /**
   * Common words that give the language away even when no topic matched.
   * Latin-script languages only; the others are told apart by their script.
   * Keep them distinctive: a word shared with another language here only
   * makes the guess a tie, and a tie keeps the language the chat was using.
   */
  stopwords?: string[];
};

export type LocaleReplies = {
  /** Replies per topic id, each a list of variants, as in chatKnowledge.ts. */
  topics: Record<string, ReplyBubble[][]>;
  /** What is said about each project; the offer line is added after. */
  projects: Partial<Record<Project["slug"], string[]>>;
  misses: ReplyBubble[][];
  handoff: ReplyBubble[];
  ui: {
    /** "Want to read the case study?" */
    offerCase: string;
    /** "Want to see the live site?" */
    offerSite: string;
    /** "Opening it up." */
    openingCase: string;
    /** "Here you go." */
    hereYouGo: string;
    /** Said before leaving for a page, which is only in English. */
    pageInEnglish: string;
    /** Said before the contact form opens, which is only in English. */
    formInEnglish: string;
    /** The "Hey!" put before an answer to a greeting that came with a question. */
    hello: string;
    /** How a link bubble is read out: "Link: LinkedIn." */
    link: (text: string) => string;
  };
};

export type LocaleInfo = {
  code: LocaleCode;
  /** The language's own name for itself, as the picker shows it. */
  name: string;
  dir: "ltr" | "rtl";
  /** Said when the visitor picks this language in the menu. */
  switched: string;
  /** Said, in this language, when the visitor goes back to "auto". */
  auto: string;
};
