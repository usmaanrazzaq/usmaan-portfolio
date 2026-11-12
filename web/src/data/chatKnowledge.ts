/**
 * What the homepage chat knows: every topic a visitor can ask about, the words
 * that point at it, and what Usmaan says back. src/lib/chatMatcher.ts decides
 * which topic a message is about; this file is only the content.
 *
 * Writing a topic:
 * - `phrases` are matched on whole words, so "work" never fires on "workflow".
 *   A longer phrase outweighs a shorter one, so "how do you work" beats "work".
 *   Plurals match their singular ("projects" hits "project").
 * - `replies` holds one or more variants. Each variant is the run of bubbles
 *   sent in order; asking the same thing again moves on to the next variant.
 * - `more` names the topic that "yes", "sure", or "tell me more" leads to when
 *   it is the next thing the visitor says.
 * - `action` runs once the last bubble has landed (see ChatCommand).
 * - `bare` words fire this topic only when they are the whole message ("about"
 *   on its own opens the About page; "tell me about Rented" does not).
 *
 * Off limits, by design: rates and personal details. Those topics exist only
 * to steer the conversation back to the work.
 */

import { HERO_CHAT, type ChatCommand, type ChatIcon } from "./heroChat";
import { projects, type Project } from "./projects";

/** A plain text bubble, or a link bubble. */
export type ReplyBubble = string | { text: string; href: string; icon?: ChatIcon };

export type Intent = {
  id: string;
  phrases?: string[];
  bare?: string[];
  replies: ReplyBubble[][];
  more?: string;
  action?: ChatCommand;
  /** Scales every phrase's score; project names are worth more than most words. */
  weight?: number;
  /** "yes" and "no" mean something only in light of the previous reply. */
  kind?: "affirm" | "decline";
};

/** One of the hero's own link bubbles (LinkedIn, Resume, ...), by its id. */
function heroLink(id: string): ReplyBubble {
  const message = HERO_CHAT.find((candidate) => candidate.id === id);
  if (!message?.href) throw new Error(`heroChat has no link bubble "${id}"`);
  return { text: message.text, href: message.href, icon: message.icon };
}

/* ------------------------------------------------------------------------ */
/* Projects                                                                  */
/* ------------------------------------------------------------------------ */

/**
 * The extra words each project answers to, and what is said about it. A
 * project added to projects.ts without an entry here still answers to its
 * title, with its description as the reply.
 */
const PROJECT_TALK: Partial<
  Record<Project["slug"], { aliases: string[]; lines: string[] }>
> = {
  shifts: {
    aliases: ["shifts", "shift", "shift management", "scheduling", "scheduling app", "schedule app"],
    lines: [
      "Shifts is a team scheduling app: one calm calendar for planning who works when, for teams of five or five hundred.",
      "I designed it and built it, so the prototype is the product.",
    ],
  },
  rented: {
    aliases: ["rented", "rental", "rental app", "renting", "peer to peer"],
    lines: [
      "Rented is a peer-to-peer rental app for city renters. Borrow a drill instead of buying one.",
      "I was the sole product designer, working with a team of founders and engineers. I built a functioning prototype, and it runs live inside the case study.",
    ],
  },
  nmya: {
    aliases: [
      "nmya",
      "national muslim youth",
      "national muslim youth association",
      "muslim youth",
      "non profit",
      "nonprofit",
    ],
    lines: [
      "For the National Muslim Youth Association I led a full redesign of their website.",
      "I ran focus groups across ages, roles, and how much people already knew, then redesigned and built the site around what we heard.",
    ],
  },
  adsum: {
    aliases: ["adsum", "adsum nyc", "clothing brand", "size filter", "e commerce", "ecommerce"],
    lines: [
      "Adsum NYC is a Brooklyn clothing brand with 25K+ monthly visitors. I handle everything from Shopify UI/UX, campaign and social media designs.",
      "The result I point to most: a custom size filter that cut clicks on unavailable products by 35%.",
      "Alongside that, I've improved the site's UX across product pages, checkout, and search, all the way down to the mobile experience.",
    ],
  },
  dpr: {
    aliases: ["dpr", "dpr studio"],
    lines: [
      "DPR Studio is a California production studio: garments, brand identity, creative direction.",
      "I redesigned and built their custom Shopify site with the founder, research to shipped code.",
    ],
  },
  otrs: {
    aliases: ["otrs", "on the run", "on the run studio"],
    lines: [
      "On The Run Studio started as a visual reference account and grew into a 5,000+ community of designers and brands.",
      "Then a merch line, then a full design studio. It's where most of my taste got trained.",
    ],
  },
  wcm: {
    aliases: ["wcm", "wcm connect", "patient app", "healthcare", "health app"],
    lines: [
      "WCM Connect is a self-initiated concept: I redesigned a real patient app's onboarding, dashboard, and scheduling.",
      "The brief came from its App Store reviews. Users had already done the research; I just read it.",
    ],
  },
};

function projectIntents(): Intent[] {
  return projects.flatMap((project) => {
    const talk = PROJECT_TALK[project.slug];
    const lines = talk?.lines ?? [project.description];
    const aliases = [project.title.toLowerCase(), ...(talk?.aliases ?? [])];
    const caseId = `project-${project.slug}-open`;

    const offer = project.caseHref
      ? "Want to read the case study?"
      : project.siteHref
        ? "Want to see the live site?"
        : null;

    const intent: Intent = {
      id: `project-${project.slug}`,
      phrases: aliases,
      weight: 3,
      replies: [[...lines, ...(offer ? [offer] : [])]],
      more: offer ? caseId : undefined,
    };

    // What "yes" to the offer does: open the case study, or hand over the
    // live site as a link bubble (an outside site should not replace this tab).
    const open: Intent | null = project.caseHref
      ? {
          id: caseId,
          replies: [["Opening it up."]],
          action: { open: project.caseHref },
        }
      : project.siteHref
        ? {
            id: caseId,
            replies: [["Here you go.", { text: project.title, href: project.siteHref }]],
          }
        : null;

    return open ? [intent, open] : [intent];
  });
}

/* ------------------------------------------------------------------------ */
/* Topics                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * Order matters only for ties: an earlier topic wins. Small talk, then the
 * navigation topics, then "yes" and "no" sit at the end, so a question that
 * also says "hi", mentions "work", or opens with "sure" goes to the topic it is
 * really about.
 */
const TOPICS: Intent[] = [
  // Who, what, where.
  {
    id: "name",
    phrases: ["your name", "whats your name", "who is this", "how do you say your name", "pronounce"],
    replies: [["Usmaan. Two a's, one m. It's the most common typo in my inbox."]],
  },
  {
    id: "who",
    phrases: [
      "who are you",
      "who is usmaan",
      "about you",
      "about yourself",
      "introduce yourself",
      "what do you do",
      "what you do",
      "tell me about you",
      "your story",
      "your role",
      "product designer",
    ],
    replies: [
      [
        "I'm a product designer in New York. I take products from research to design to shipped code, usually as the only designer on the team.",
        "Want the longer version?",
      ],
      ["Still Usmaan, still a product designer.", "Type 'about' for the full story."],
    ],
    more: "about-open",
  },
  {
    id: "location",
    phrases: [
      "where are you",
      "where are you from",
      "where are you based",
      "based",
      "location",
      "located",
      "new york",
      "nyc",
      "city",
      "timezone",
      "time zone",
      "what time",
    ],
    replies: [
      ["New York. The clock under my name is live, so you can tell whether I'm awake."],
    ],
  },
  {
    id: "background",
    phrases: [
      "background",
      "experience",
      "how long",
      "how many years",
      "years of experience",
      "education",
      "school",
      "study",
      "studied",
      "college",
      "degree",
      "university",
      "qualifications",
      "career",
    ],
    replies: [
      [
        "I'm studying for a BFA in Design at Queens College.",
        "Since 2021 I've designed for consumer apps, non-profits, and e-commerce, from Rented to Adsum NYC.",
      ],
    ],
    more: "about-open",
  },
  {
    id: "now",
    phrases: [
      "working on",
      "currently",
      "right now",
      "these days",
      "lately",
      "latest",
      "recent",
      "most recent",
      "current role",
      "current job",
      "where do you work",
    ],
    replies: [
      [
        "Right now I'm the product designer at Adsum NYC, a Brooklyn clothing brand.",
        "And I just wrapped Shifts, a scheduling app for teams. Want to hear about Adsum?",
      ],
    ],
    more: "project-adsum",
  },

  // How the work happens.
  {
    id: "process",
    phrases: [
      "process",
      "approach",
      "workflow",
      "how do you work",
      "how you work",
      "how do you design",
      "methodology",
      "method",
      "design process",
      "where do you start",
      "steps",
    ],
    replies: [
      [
        "End to end. I start with research, design in Figma, then build it myself or right alongside the engineers.",
        "Because I ship the code too, nothing gets lost between the mockup and the product.",
      ],
      ["Short version: research, design, build, then back to research once real people use it."],
    ],
  },
  {
    id: "research",
    phrases: [
      "research",
      "user research",
      "interviews",
      "focus group",
      "usability",
      "testing users",
      "user testing",
      "personas",
      "data",
      "metrics",
    ],
    replies: [
      [
        "Research is where I start. For NMYA I ran focus groups across ages and roles; for WCM I read hundreds of App Store reviews.",
        "Want to hear about NMYA?",
      ],
    ],
    more: "project-nmya",
  },
  {
    id: "code",
    phrases: [
      "code",
      "coding",
      "can you code",
      "do you code",
      "develop",
      "developer",
      "development",
      "frontend",
      "front end",
      "engineering",
      "programming",
      "react",
      "next js",
      "nextjs",
      "typescript",
      "javascript",
      "html",
      "css",
      "tailwind",
      "build",
    ],
    replies: [
      [
        "Yes, I code. This site is Next.js, TypeScript, and Tailwind.",
        "I've shipped a custom Shopify build for DPR Studio and built the NMYA and Shifts sites too, so engineers never have to guess what I meant.",
      ],
    ],
  },
  {
    id: "tools",
    phrases: [
      "tools",
      "tool",
      "figma",
      "software",
      "stack",
      "tech stack",
      "apps do you use",
      "what do you use",
      "adobe",
      "framer",
      "shopify",
      "webflow",
      "sketch",
    ],
    replies: [
      [
        "Figma for design. A code editor for everything after.",
        "Next.js, TypeScript, and Tailwind on the build side, and Shopify when there's something to sell.",
      ],
    ],
  },
  {
    id: "team",
    phrases: [
      "team",
      "engineers",
      "developers",
      "founders",
      "stakeholders",
      "collaborate",
      "collaboration",
      "work with others",
      "solo",
    ],
    replies: [
      [
        "I'm usually the only designer, working right next to engineers and founders.",
        "Speaking both design and code means fewer handoff docs that nobody reads.",
      ],
    ],
  },
  {
    id: "mobile",
    phrases: ["mobile", "ios", "android", "app design", "apps", "mobile app", "phone"],
    replies: [
      [
        "Plenty. Rented and Shifts are both apps, and WCM Connect is a patient app redesign.",
        "Want to start with Rented? It has a working prototype in the case study.",
      ],
    ],
    more: "project-rented",
  },
  {
    id: "clients",
    phrases: [
      "clients",
      "client",
      "companies",
      "brands",
      "industries",
      "industry",
      "who have you worked with",
      "worked with",
    ],
    replies: [
      [
        "Consumer apps, a national non-profit, and fashion and e-commerce brands.",
        "Adsum NYC, DPR Studio, Rented, and the National Muslim Youth Association, among others. Type 'portfolio' to see them.",
      ],
    ],
  },
  {
    id: "favourite",
    phrases: [
      "favorite project",
      "favourite project",
      "favorite",
      "favourite",
      "proudest",
      "most proud",
      "best project",
      "best work",
    ],
    replies: [
      [
        "On The Run Studio. It's the one I've been building the longest, since 2021.",
        "Want the story?",
      ],
    ],
    more: "project-otrs",
  },
  {
    id: "hardest",
    phrases: [
      "hardest",
      "challenge",
      "challenges",
      "challenging",
      "difficult",
      "toughest",
      "biggest problem",
      "mistake",
      "failure",
      "learned",
      "lesson",
    ],
    replies: [
      [
        "NMYA. Lots of stakeholders, lots of opinions, and a WordPress site that had outgrown itself.",
        "Focus groups gave everyone the same evidence to agree on. Want to hear how it went?",
      ],
    ],
    more: "project-nmya",
  },
  {
    id: "inspiration",
    phrases: [
      "inspiration",
      "inspire",
      "inspires",
      "inspired",
      "influence",
      "influences",
      "heroes",
      "idols",
      "admire",
      "dieter rams",
      "rams",
      "vignelli",
    ],
    replies: [
      [
        "Dieter Rams, Massimo Vignelli, Jan Tschichold, John Pawson, Peter Zumthor. Less, but better.",
        "I keep the rest on the References page. Want me to redirect you?",
      ],
    ],
    more: "references-open",
  },
  {
    id: "philosophy",
    phrases: [
      "philosophy",
      "good design",
      "design principles",
      "principles",
      "minimal",
      "minimalism",
      "minimalist",
      "aesthetic",
      "swiss",
      "style",
      "taste",
      "believe",
    ],
    replies: [
      [
        "Good design isn't just how something looks. It's how it works and how it makes people feel.",
        "Visually I lean Swiss: grids, restraint, and nothing that hasn't earned its place.",
      ],
    ],
  },
  {
    id: "explorations",
    phrases: [
      "explorations",
      "exploration",
      "experiments",
      "experiment",
      "playground",
      "side projects",
      "side project",
      "personal projects",
      "explorations page",
    ],
    replies: [
      [
        "Explorations is where I keep personal experiments, like a GoodReads genre onboarding prototype and a redesign of the Claude Code sidebar.",
        "Want me to redirect you?",
      ],
    ],
    more: "explorations-open",
  },
  {
    id: "references",
    phrases: ["references", "reference", "references page", "moodboard", "mood board"],
    replies: [
      [
        "References is a collection of images I use as design inspiration: a visual picture of how I think about design.",
        "It's built from my Are.na channels and grows as I add to them. Want me to redirect you?",
      ],
    ],
    more: "references-open",
  },
  {
    id: "site",
    phrases: [
      "this site",
      "this website",
      "your site",
      "your website",
      "this portfolio",
      "this chat",
      "who made this",
      "how did you make",
      "how did you build",
      "built this",
      "made this",
    ],
    replies: [
      [
        "I designed and built it. Next.js under the hood, Swiss restraint on top.",
        "The chat is a small script of mine, not a live line to my phone. Sadly for both of us.",
      ],
    ],
  },
  {
    id: "bot",
    phrases: [
      "are you a bot",
      "bot",
      "robot",
      "are you real",
      "real person",
      "is this real",
      "is this ai",
      "are you ai",
      "ai",
      "chatgpt",
      "gpt",
      "claude",
      "automated",
      "human",
    ],
    replies: [
      [
        "Honest answer: you're talking to a scripted version of me.",
        "The real one answers through the contact form. Type 'contact' and it'll open.",
      ],
    ],
    more: "contact-open",
  },

  // Getting in touch.
  {
    id: "hire",
    phrases: [
      "hire",
      "hire you",
      "hiring",
      "available",
      "availability",
      "open to work",
      "looking for work",
      "freelance",
      "contract",
      "full time",
      "part time",
      "opportunity",
      "opportunities",
      "job",
      "role for you",
      "work together",
      "work with you",
      "work with me",
      "recruiter",
      "interview",
      "remote",
      "in person",
      "work in person",
      "work remotely",
      "work in new york",
      "onsite",
      "on site",
      "hybrid",
      "relocate",
      "relocation",
      "willing to move",
    ],
    replies: [
      [
        "I'm currently open to full-time, freelance, or contract work: in person in New York, remote, or relocating.",
        "The contact form goes straight to me. Want me to open it?",
      ],
    ],
    more: "contact-open",
  },
  {
    id: "rates",
    phrases: [
      "rate",
      "rates",
      "hourly",
      "price",
      "pricing",
      "cost",
      "costs",
      "charge",
      "how much",
      "salary",
      "budget",
      "quote",
      "fee",
      "fees",
      "compensation",
    ],
    replies: [
      [
        "That depends on the project, so it's a conversation rather than a chat bubble.",
        "Want to open the contact form and tell me what you're working on?",
      ],
    ],
    more: "contact-open",
  },
  {
    id: "personal",
    phrases: [
      "how old",
      "age",
      "birthday",
      "married",
      "wife",
      "husband",
      "girlfriend",
      "boyfriend",
      "dating",
      "family",
      "kids",
      "religion",
      "religious",
      "address",
      "where do you live",
      "phone number",
      "your number",
    ],
    replies: [
      ["I keep the personal side off the portfolio.", "Happy to talk design all day, though."],
      ["Still off the record.", "Ask me about a project instead?"],
    ],
  },
  {
    id: "contact",
    phrases: [
      "email",
      "e mail",
      "mail",
      "reach you",
      "get in touch",
      "contact you",
      "message you",
      "talk to you",
      "speak to you",
      "call",
      "meeting",
      "book",
      "schedule a call",
    ],
    replies: [["The contact form lands straight in my inbox.", "Opening it for you."]],
    action: { contact: true },
  },
  {
    id: "resume",
    phrases: ["resume", "cv", "curriculum vitae"],
    replies: [["Here it is.", heroLink("resume")]],
  },
  {
    id: "socials",
    phrases: ["socials", "social media", "social", "follow you", "where can i follow"],
    replies: [
      [
        "Pick your platform:",
        heroLink("linkedin"),
        heroLink("instagram"),
        heroLink("github"),
        heroLink("x"),
      ],
    ],
  },
  { id: "linkedin", phrases: ["linkedin"], weight: 2, replies: [[heroLink("linkedin")]] },
  { id: "instagram", phrases: ["instagram", "insta", "ig"], weight: 2, replies: [[heroLink("instagram")]] },
  { id: "github", phrases: ["github", "git hub"], weight: 2, replies: [[heroLink("github")]] },
  { id: "twitter", phrases: ["twitter", "tweet", "on x"], weight: 2, replies: [[heroLink("x")]] },
  { id: "arena", phrases: ["arena", "are na"], weight: 2, replies: [[heroLink("arena")]] },

  // Small talk. A greeting that comes with a question loses to the
  // question; the matcher says hello first.
  {
    id: "greeting",
    phrases: [
      "hi",
      "hello",
      "hey",
      "heya",
      "hiya",
      "yo",
      "sup",
      "howdy",
      "greetings",
      "salam",
      "salaam",
      "assalamu alaikum",
      "good morning",
      "good afternoon",
      "good evening",
      "hi there",
      "hey there",
    ],
    replies: [
      ["Hey! Thanks for stopping by.", "Ask me about my work, my process, or any project. Or type 'portfolio' to jump to it."],
      ["Hello again.", "What would you like to know?"],
    ],
  },
  {
    id: "how-are-you",
    phrases: [
      "how are you",
      "how r u",
      "how are u",
      "hows it going",
      "how is it going",
      "how are things",
      "how you doing",
      "how have you been",
      "whats up",
      "wassup",
      "whats good",
    ],
    replies: [
      ["Doing well, thanks. Somewhere between a Figma file and a pull request, as usual.", "What can I help you with?"],
      ["Still good. Still designing.", "Anything you want to know about the work?"],
    ],
  },
  {
    id: "thanks",
    phrases: ["thanks", "thank you", "thx", "ty", "cheers", "appreciate", "appreciate it"],
    replies: [["Anytime."], ["Of course. Thanks for looking around."]],
  },
  {
    id: "bye",
    phrases: ["bye", "goodbye", "good bye", "see you", "see ya", "cya", "later", "gotta go", "good night"],
    replies: [["Thanks for stopping by. Come back soon, there's usually something new."]],
  },
  {
    id: "compliment",
    phrases: [
      "nice",
      "cool",
      "love",
      "love it",
      "amazing",
      "awesome",
      "great",
      "beautiful",
      "impressive",
      "clean",
      "dope",
      "fire",
      "sick",
      "wow",
      "nice work",
      "great work",
      "love your work",
      "well done",
    ],
    replies: [
      ["Thank you, that genuinely made my day.", "If you liked that, the case studies go deeper."],
      ["You're too kind. Keep going and I'll start believing it."],
    ],
  },
  {
    id: "critique",
    phrases: ["bad", "ugly", "boring", "sucks", "hate", "terrible", "worst", "meh"],
    replies: [
      [
        "Noted. Critique is just free research.",
        "If you've got specifics, the contact form gets them to me. Type 'contact'.",
      ],
    ],
  },
  {
    id: "joke",
    phrases: ["joke", "tell me a joke", "funny", "make me laugh", "something funny"],
    replies: [
      ["How many designers does it take to change a lightbulb?", "Does it have to be a lightbulb?"],
      ["I asked a developer to center a div once.", "We're still in touch. The div isn't."],
    ],
  },
  {
    id: "test",
    phrases: ["test", "testing", "asdf", "lorem", "lorem ipsum", "hello world"],
    replies: [["Test received. Everything's working, including me."]],
  },
  {
    id: "help",
    phrases: ["help", "what can i ask", "what can you do", "what should i ask", "options", "commands", "menu"],
    replies: [
      [
        "Ask me about my process, a project like Rented or Adsum, what I'm working on, or how to reach me.",
        "Or type 'portfolio', 'about', 'explorations', 'references', or 'contact'.",
      ],
    ],
  },

  // Navigation. These fire on their own word alone ("explorations", "show me
  // the references"); a question about a page gets its topic above instead,
  // which offers to go there.
  {
    id: "work",
    bare: ["portfolio", "work", "projects", "project"],
    phrases: [
      "portfolio",
      "see work",
      "see your work",
      "show me",
      "case studies",
      "case study",
      "projects",
      "selected work",
      "work",
    ],
    replies: [["Here's the work."]],
    action: { scroll: "work" },
  },
  {
    id: "about-open",
    bare: ["about"],
    phrases: ["about page", "about me page", "more about you", "longer version", "full story"],
    replies: [["Taking you to the About page."]],
    action: { open: "/about/" },
  },
  {
    id: "explorations-open",
    bare: ["explorations", "exploration", "playground", "experiments"],
    replies: [["Opening Explorations."]],
    action: { open: "/explorations/" },
  },
  {
    id: "references-open",
    bare: ["references", "reference"],
    replies: [["Opening References."]],
    action: { open: "/references/" },
  },
  {
    id: "contact-open",
    bare: ["contact"],
    phrases: ["contact form", "contact page"],
    replies: [["Opening the contact form."]],
    action: { contact: true },
  },

  // Follow-ups. Their own replies are used only when nothing was offered.
  {
    id: "affirm",
    kind: "affirm",
    phrases: [
      "yes",
      "yeah",
      "yea",
      "yep",
      "yup",
      "sure",
      "ok",
      "okay",
      "please",
      "definitely",
      "of course",
      "go on",
      "go ahead",
      "more",
      "tell me more",
      "sounds good",
      "absolutely",
      "why not",
    ],
    replies: [
      ["Love the enthusiasm.", "Ask me about my process, a project, or what I'm working on."],
      ["Agreed. On what, I'm not sure, but agreed.", "Try asking about a project, like 'Rented' or 'Adsum'."],
    ],
  },
  {
    id: "decline",
    kind: "decline",
    phrases: ["no", "nope", "nah", "no thanks", "not now", "maybe later", "not really"],
    replies: [
      ["No worries.", "I'll be here if you think of anything."],
      ["Fair enough."],
    ],
  },
];

export const INTENTS: Intent[] = [...projectIntents(), ...TOPICS];

/** What is said when nothing matched, in turn. */
export const MISSES: ReplyBubble[][] = [
  ["Hmm, that one's not in my script.", "Try asking about my process, a project like Rented, or what I'm working on."],
  ["I'm a scripted version of me, so that went over my head.", "Type 'help' to see what I can answer."],
  ["Good question. Wrong chat, though.", "Try 'portfolio', 'about', or 'contact'."],
];

/** After this many misses in a row, the reply offers the real Usmaan instead. */
export const MISSES_BEFORE_HANDOFF = 2;

export const HANDOFF: ReplyBubble[] = [
  "That sounds like a question for the real me.",
  "Want me to open the contact form?",
];
