/**
 * Decides what the work section's chat says back. It answers about the work in
 * view (or another project the visitor names) from src/data/workChat.ts, and
 * hands anything else (contact, resume, small talk, "yes" to an offer) to the
 * homepage chat's own matcher, so the two chats never disagree.
 *
 * Like `respond`, this is pure: message and conversation in, reply out.
 */

import type { ReplyBubble } from "@/data/chatKnowledge";
import type { LocaleReplies } from "@/data/chatLocales";
import { projects, type Project } from "@/data/projects";
import { FACET_PHRASES, WORK_TALK, type WorkFacet } from "@/data/workChat";
import { respond, words, type ChatContext, type ChatReply } from "@/lib/chatMatcher";

type Slug = Project["slug"];

/**
 * General topics that win even when a facet word rides along: "how do I
 * contact you" is about contacting, not the process.
 */
const DEFER = new Set([
  "name", "location", "bot", "hire", "rates", "personal", "contact", "resume", "socials",
  "linkedin", "instagram", "github", "twitter", "arena", "thanks", "bye", "compliment",
  "critique", "joke", "test", "help", "explorations", "references", "site",
  "about-open", "explorations-open", "references-open", "contact-open", "decline",
]);

/** Tie order: "how long" is about the role, plain "how" about the process. */
const FACET_ORDER = ["outcomes", "problem", "role", "process"] as const;

const COMPILED_FACETS = FACET_ORDER.map((facet) => ({
  facet,
  phrases: FACET_PHRASES[facet].map((phrase) => words(phrase).join(" ")),
}));

/** The facet whose words the message uses most; ties go to the earlier one. */
export function pickFacet(text: string): WorkFacet | null {
  const folded = ` ${words(text).join(" ")} `;
  let best: WorkFacet | null = null;
  let bestScore = 0;
  for (const { facet, phrases } of COMPILED_FACETS) {
    const score = phrases.filter((phrase) => folded.includes(` ${phrase} `)).length;
    if (score > bestScore) {
      best = facet;
      bestScore = score;
    }
  }
  return best;
}

/** The project a general reply was about, from its topic id. */
function projectOf(intent: string | null): Slug | null {
  const match = intent?.match(/^project-([a-z]+)(-open)?$/);
  if (!match) return null;
  return projects.some((project) => project.slug === match[1]) ? (match[1] as Slug) : null;
}

function offerFor(project: Project): string | null {
  if (project.caseHref) return "Want to read the case study?";
  if (project.siteHref) return "Want to see the live site?";
  return null;
}

/** Words asking to go to the work itself: "show me the case study", "take me to the site". */
const CASE_WORDS = ["case study", "case", "study", "full story", "read more", "write up", "writeup"];
const SITE_WORDS = ["website", "site", "live site", "live", "link", "url"];
const GO_WORDS = ["show", "take", "open", "see", "view", "go", "read", "link", "send", "where"];

function asksFor(text: string): { want: "case" | "site"; strong: boolean } | null {
  const folded = ` ${words(text).join(" ")} `;
  const has = (list: string[]) =>
    list.some((phrase) => folded.includes(` ${words(phrase).join(" ")} `));
  const site = has(SITE_WORDS);
  const study = has(CASE_WORDS);
  if (!site && !study) return null;
  // "The case study" on its own is a request too; "what does the site do" is not.
  const strong = has(GO_WORDS);
  if (!strong && words(text).length > 3) return null;
  return { want: study ? "case" : "site", strong };
}

/** Opens the case study, or hands over the live site as a link bubble. */
function openWork(project: Project, want: "case" | "site", context: ChatContext): ChatReply {
  const reply = (bubbles: ReplyBubble[], action?: ChatReply["action"]): ChatReply => ({
    intent: `work-${project.slug}-open`,
    bubbles,
    lang: "en",
    action,
    context: { ...context, offer: null, misses: 0 },
  });
  const site = project.siteHref && { text: project.title, href: project.siteHref };

  if (want === "case" && project.caseHref) {
    return reply([`Opening the ${project.shortTitle} case study.`], { open: project.caseHref });
  }
  if (want === "site" && site) return reply(["Here's the live site.", site]);
  if (project.caseHref) {
    return reply(
      [`${project.shortTitle} doesn't have a live site to show, so here's the case study instead.`],
      { open: project.caseHref },
    );
  }
  if (site) {
    return reply([`There's no case study for ${project.shortTitle} yet, but here's the live site.`, site]);
  }
  return reply([`There's nothing to open for ${project.shortTitle} yet.`]);
}

export function respondAboutWork(
  slug: Slug,
  text: string,
  context: ChatContext,
  locale: LocaleReplies | null = null,
): ChatReply {
  const general = respond(text, context, locale);
  const facet = pickFacet(text);
  const named = projectOf(general.intent);

  // "Show me the case study" means this work's, unless another is named. A
  // question about the outcomes or the problem still gets its answer, even
  // when it mentions the case study.
  const ask = asksFor(text);
  const answers = facet === "outcomes" || facet === "problem";
  if (ask && (ask.strong ? !answers : !facet)) {
    const project = projects.find((candidate) => candidate.slug === (named ?? slug))!;
    return openWork(project, ask.want, general.context);
  }

  // "Yes" to the case-study offer, and topics that are not about the work,
  // are the homepage chat's to answer.
  if (general.intent && DEFER.has(general.intent)) return general;
  if (general.intent?.endsWith("-open") && !facet) return general;

  const target = named ?? slug;
  const aboutWork =
    facet !== null ||
    general.intent === null ||
    general.intent === "work" ||
    general.intent === `project-${slug}`;
  if (!aboutWork && !named) return general;

  const project = projects.find((candidate) => candidate.slug === target)!;
  const asked = facet ?? "overview";
  const key = `work-${target}-${asked}`;
  const openId = `project-${target}-open`;
  const offer = offerFor(project);

  // The offer goes on once, not after every answer about the same work.
  const bubbles: ReplyBubble[] = [...WORK_TALK[target][asked]];
  if (offer && context.offer !== openId) bubbles.push(offer);

  return {
    intent: key,
    bubbles,
    lang: "en",
    context: {
      ...general.context,
      offer: offer ? openId : null,
      misses: 0,
      seen: { ...context.seen, [key]: (context.seen[key] ?? 0) + 1 },
    },
  };
}
