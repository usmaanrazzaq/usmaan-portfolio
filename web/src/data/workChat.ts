/**
 * What the work section's chat says about the work in view. Each project has
 * five facets a visitor can ask about; src/lib/workMatcher.ts picks one from
 * the question. Replies are short, first person, and lead with the point, the
 * same voice as chatKnowledge.ts, whose PROJECT_TALK these build on.
 *
 * English only: a question in another language still gets these, and a
 * question that is not about the work goes to the homepage chat's matcher,
 * which does speak the visitor's language.
 */

import type { Project } from "@/data/projects";

export type WorkFacet = "overview" | "outcomes" | "problem" | "process" | "role";

export const WORK_FACETS: WorkFacet[] = ["overview", "outcomes", "problem", "process", "role"];

/** The words that point a question at each facet. Overview is the fallback. */
export const FACET_PHRASES: Record<Exclude<WorkFacet, "overview">, string[]> = {
  outcomes: [
    "outcome", "outcomes", "result", "results", "impact", "metric", "metrics", "numbers",
    "success", "successful", "achieve", "achieved", "measure", "kpi", "data", "growth",
    "improve", "improved", "launch", "launched", "learn", "learned", "learnings", "takeaway",
  ],
  problem: [
    "problem", "problems", "challenge", "challenges", "issue", "issues", "pain", "pain point",
    "why", "goal", "goals", "brief", "struggle", "struggling", "broken", "wrong", "need",
    "needs", "context", "background", "hard", "difficult",
  ],
  process: [
    "process", "how", "approach", "solve", "solved", "solution", "research", "method",
    "methods", "test", "testing", "tested", "usability", "interview", "interviews",
    "focus group", "iterate", "iteration", "design decisions", "decision", "decisions",
    "build", "built", "workflow", "steps", "prototype", "wireframe", "wireframes",
  ],
  role: [
    "role", "team", "responsible", "responsibilities", "owned", "work with", "worked with",
    "timeline", "how long", "duration", "client", "founder", "tools", "stack",
    "figma", "webflow", "shopify", "framer",
  ],
};

export type WorkTalk = Record<WorkFacet, string[]>;

export const WORK_TALK: Record<Project["slug"], WorkTalk> = {
  shifts: {
    overview: [
      "Shifts is a team scheduling app: one calm calendar for planning who works when. I designed it and built it, so the prototype is the product.",
      "Ask me about the problem, how I approached it, or what happened when a real team used it.",
    ],
    outcomes: [
      "A local nonprofit ran its event security team on Shifts for four days: about 15 people across 3 teams and 20 to 30 shifts.",
      "For the first time they could see coverage at a glance, without a spreadsheet. The gap they hit was communication, so team invites and shift notifications are next.",
    ],
    problem: [
      "Volunteer-heavy teams fall between two kinds of tool: employee schedulers priced per paid seat, and volunteer apps that are good at signups but weak at day-to-day ops.",
      "So coordinators run schedules on spreadsheets and group texts, and nobody can see who's working when. That's how you get double bookings and understaffed days.",
    ],
    process: [
      "I framed the core failure as \"managers can't see coverage without a spreadsheet\" and cut everything else from v1: no swaps, reminders, payroll, or mobile claims.",
      "The UI takes its cues from Linear and Notion rather than legacy schedulers. After the nonprofit test I logged bugs in Linear, shipped a notes field, and backlogged invites and notifications.",
    ],
    role: [
      "Solo, end to end: research, product design, and the code. July to October 2026.",
    ],
  },
  rented: {
    overview: [
      "Rented is a peer-to-peer rental app for city renters. Borrow a drill instead of buying one.",
      "Ask me about what was broken in other rental apps, how I tested it, or the results.",
    ],
    outcomes: [
      "First-task completion went from 71% to 100% between testing rounds, and onboarding takes under a minute.",
      "Every returning participant went to the new Best Match section first, and the engineers got 30+ dev-ready screens.",
    ],
    problem: [
      "Existing rental apps get onboarding, roles, and browsing wrong. Some over-verify before you can look around, some barely verify at all.",
      "And every one forces you to be either a renter or a lister, when people are both.",
    ],
    process: [
      "Two rounds of moderated testing, 7 sessions, walking people from resale apps they knew through competitors to our prototype.",
      "Three patterns held: minimal search wins, everyone switches roles, and long catalogs lose people. So onboarding is SSO plus one category prompt, profiles treat both roles equally, and browse gained Best Match and suggestion tags.",
    ],
    role: [
      "Sole product designer alongside the founders and engineers, November 2024 through handoff in February 2025. I also built the working prototype that runs inside the case study.",
    ],
  },
  nmya: {
    overview: [
      "For the National Muslim Youth Association I led a full redesign of their website and moved it off a malware-prone WordPress install onto Webflow.",
      "Ask me about what was wrong with the old site, the research, or the results.",
    ],
    outcomes: [
      "Within months of the June 2024 launch, traffic rose 30%, page views 15%, and returning visitors 10 to 15%.",
      "Key pages went from five or six clicks away to two or three, and the malware cycle that kept taking the site offline ended with the move.",
    ],
    problem: [
      "Years of content piled on without cleanup. Parents couldn't find teaching materials, teachers couldn't find class resources, and youth skipped the site entirely.",
      "On top of that, the WordPress build had malware, so even maintaining it was risky. I was hired to maintain it and proposed a rebuild instead.",
    ],
    process: [
      "I ran three to five focus groups across ages, roles, and how much people already knew. They wanted clearer paths to updates, easier access to materials, and a better mobile experience.",
      "I wireframed around those, got board approval, then built it in Webflow with a new IA and design system, mobile and tablet first.",
    ],
    role: [
      "Lead designer and developer, working with the association's stakeholders and board, November 2023 to November 2025.",
    ],
  },
  adsum: {
    overview: [
      "Adsum NYC is a Brooklyn clothing brand with 25K+ monthly visitors. I design and ship the Shopify storefront with the founder, plus campaigns and email.",
      "Ask me about the size filter, the problem it solved, or how I work with the founder.",
    ],
    outcomes: [
      "The size filter I built from scratch cut clicks on sold-out sizes by 35%.",
      "And the launch emails I design open at 43.8%, against an industry average of about 33%.",
    ],
    problem: [
      "Shoppers kept landing on sizes that were already sold out, which is a fast way to lose a sale.",
      "Product pages were also dense: size charts, shipping, and returns all competed with the description.",
    ],
    process: [
      "I built a filter that only surfaces in-stock sizes on collection pages, and folded size charts, shipping, and returns into accordions so the description leads and checkout is closer.",
      "Around that, I design collection pages for each release, event, and sale, plus the Black Friday and Cyber Monday campaigns.",
    ],
    role: [
      "Sole designer, working directly with the founder in Shopify since November 2025. Ongoing.",
    ],
  },
  dpr: {
    overview: [
      "DPR Studio is a California production studio: garments, brand identity, creative direction.",
      "I redesigned and built their custom Shopify site with the founder, research to shipped code.",
    ],
    outcomes: [
      "The outcome is the live site: a custom Shopify build that presents the studio's services the way the founder wanted. There's no case study yet, but you can see it for yourself.",
    ],
    problem: [
      "The studio needed a site that matched the level of its client work and explained what it does across garment design, branding, and production.",
    ],
    process: [
      "I owned it end to end with the founder: research, then design, then building the custom Shopify theme myself.",
    ],
    role: [
      "Sole designer and developer, working directly with the founder since June 2025.",
    ],
  },
  otrs: {
    overview: [
      "On The Run Studio started in March 2021 as my personal moodboard account. It's where most of my taste got trained.",
      "Ask me how it grew, or what it turned into.",
    ],
    outcomes: [
      "It grew from 50 to 5,000 followers in about a year and a half, and the merch I designed sold as far as France, Spain, and the U.K.",
      "It's now the full-service design studio I run, taking brands from concept through launch.",
    ],
    problem: [
      "It started as no problem at all, just a place to collect what inspired me. The challenge came later: turning a community into products, then into a business.",
    ],
    process: [
      "I curated daily, then designed small merch runs from the community's taste, starting with a Unisphere tee and a mug.",
      "Rebuilding the studio site across Shopify, Squarespace, and Framer taught me the platforms clients actually use, which is now the agency's foundation.",
    ],
    role: [
      "Founder and designer, March 2021 to now: curation, merch, branding, and the studio's web work.",
    ],
  },
  wcm: {
    overview: [
      "WCM Connect is a self-initiated concept: I redesigned a real patient app's onboarding, dashboard, and scheduling.",
      "Ask me about the problems patients had, how I approached it, or what came out of it.",
    ],
    outcomes: [
      "A simpler onboarding, a dashboard built around patients' most common tasks, and a clearer scheduling flow, plus a small component system to keep it consistent.",
      "It's a concept, so there are no launch numbers, but the case study walks through every decision.",
    ],
    problem: [
      "The App Store reviews told the story: login failures and confusing verification, medications and appointments buried too many taps deep, and too little feedback to know if something worked.",
    ],
    process: [
      "I started from the reviews, not assumptions, and set three goals: simplify onboarding without losing trust, make key info immediate on the dashboard, and make scheduling easy end to end.",
      "Every screen follows one primary action per view, with type, spacing, and contrast that work for every age and comfort level.",
    ],
    role: [
      "Solo personal project: research, UX, and UI.",
    ],
  },
};
