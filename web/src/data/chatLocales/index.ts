/**
 * The homepage chat's languages: what the picker lists, and the replies for
 * each, fetched the first time that language is needed. English is built in
 * (src/data/chatKnowledge.ts), so it never loads anything.
 */

import type { LocaleCode, LocaleInfo, LocaleReplies, OtherLocale } from "./types";

export type { LocaleCode, LocaleInfo, LocaleReplies } from "./types";

/** In the order the picker shows them. */
export const LOCALES: LocaleInfo[] = [
  {
    code: "en",
    name: "English",
    dir: "ltr",
    switched: "I'll reply in English.",
    auto: "I'll reply in whatever language you write in.",
  },
  {
    code: "de",
    name: "Deutsch",
    dir: "ltr",
    switched: "Ich antworte ab jetzt auf Deutsch.",
    auto: "Ich antworte in der Sprache, in der du schreibst.",
  },
  {
    code: "fr",
    name: "Français",
    dir: "ltr",
    switched: "Je réponds en français à partir de maintenant.",
    auto: "Je réponds dans la langue dans laquelle tu écris.",
  },
  {
    code: "es",
    name: "Español",
    dir: "ltr",
    switched: "Desde ahora te respondo en español.",
    auto: "Te respondo en el idioma en que escribas.",
  },
  {
    code: "pt",
    name: "Português",
    dir: "ltr",
    switched: "A partir de agora, respondo em português.",
    auto: "Respondo no idioma em que você escrever.",
  },
  {
    code: "te",
    name: "తెలుగు",
    dir: "ltr",
    switched: "ఇకపై తెలుగులో జవాబిస్తాను.",
    auto: "మీరు ఏ భాషలో రాస్తే ఆ భాషలోనే జవాబిస్తాను.",
  },
  {
    code: "ur",
    name: "اردو",
    dir: "rtl",
    switched: "اب سے جواب اردو میں ملیں گے۔",
    auto: "اب جواب اسی زبان میں ملیں گے جس میں آپ لکھیں۔",
  },
  {
    code: "ja",
    name: "日本語",
    dir: "ltr",
    switched: "ここからは日本語でお答えします。",
    auto: "書かれた言語でお答えします。",
  },
];

export const LOCALE_BY_CODE = new Map(LOCALES.map((locale) => [locale.code, locale]));

export function isLocaleCode(value: unknown): value is LocaleCode {
  return typeof value === "string" && LOCALE_BY_CODE.has(value as LocaleCode);
}

const LOADERS: Record<OtherLocale, () => Promise<{ default: LocaleReplies }>> = {
  de: () => import("./replies/de"),
  fr: () => import("./replies/fr"),
  es: () => import("./replies/es"),
  pt: () => import("./replies/pt"),
  te: () => import("./replies/te"),
  ur: () => import("./replies/ur"),
  ja: () => import("./replies/ja"),
};

const loaded = new Map<OtherLocale, Promise<LocaleReplies | null>>();

/**
 * A language's replies, or null for English or when the download fails (the
 * chat then answers in English). A failure is forgotten, so the next message
 * tries again.
 */
export function loadReplies(code: LocaleCode): Promise<LocaleReplies | null> {
  if (code === "en") return Promise.resolve(null);
  let pending = loaded.get(code);
  if (!pending) {
    pending = LOADERS[code]()
      .then((module) => module.default)
      .catch(() => {
        loaded.delete(code);
        return null;
      });
    loaded.set(code, pending);
  }
  return pending;
}

/**
 * Starts loading the languages the visitor's browser asks for, so a reply in
 * one of them is usually ready before the visitor has finished typing.
 */
export function prefetchPreferred() {
  if (typeof navigator === "undefined") return;
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of preferred) {
    const code = tag?.slice(0, 2).toLowerCase();
    if (isLocaleCode(code) && code !== "en") void loadReplies(code);
  }
}
