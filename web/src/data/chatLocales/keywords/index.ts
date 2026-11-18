/**
 * Every other language's keywords, bundled with the matcher: finding the
 * topic, and telling the languages apart, needs all of them at once. The
 * replies are the heavy part and load on demand (../index.ts).
 */

import type { LocaleKeywords, OtherLocale } from "../types";
import de from "./de";
import es from "./es";
import fr from "./fr";
import ja from "./ja";
import pt from "./pt";
import te from "./te";
import ur from "./ur";

export const KEYWORDS: Record<OtherLocale, LocaleKeywords> = { de, fr, es, pt, te, ur, ja };
