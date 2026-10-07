/**
 * The script for the homepage hero's chat thread, in the order it is sent.
 *
 * `id` is the key a visitor's tapback is stored under (lib/chatReactions.ts),
 * so renaming one drops the reactions left on that bubble. A message with an
 * `href` is sent as a link bubble.
 */

export type ChatIcon = "linkedin" | "instagram" | "github" | "x" | "resume";

export type ChatMessage = {
  id: string;
  text: string;
  href?: string;
  icon?: ChatIcon;
};

export const HERO_CHAT: ChatMessage[] = [
  { id: "intro", text: "Hi! I'm Usmaan" },
  {
    id: "bio",
    text: "I'm a product designer based in New York, NY. I own the process end-to-end, research, design, and shipped code, as the sole designer working directly with engineers and founders, across consumer products, non-profits, and e-commerce.",
  },
  { id: "connect", text: "Connect with me:" },
  {
    id: "linkedin",
    text: "LinkedIn",
    href: "https://www.linkedin.com/in/usmaan-razzaq-9886511b1/",
    icon: "linkedin",
  },
  {
    id: "instagram",
    text: "Instagram",
    href: "https://www.instagram.com/usmaanrzqdesign",
    icon: "instagram",
  },
  { id: "github", text: "GitHub", href: "https://github.com/usmaanrazzaq", icon: "github" },
  { id: "x", text: "X (Twitter)", href: "https://x.com/usmaanrzq", icon: "x" },
  {
    id: "resume",
    text: "Resume",
    href: "/Usmaan-Razzaq-Resume.pdf?v=20260823-2000",
    icon: "resume",
  },
  { id: "arena", text: "Are.na", href: "https://www.are.na/usmaan-r/channels" },
];

/**
 * What the composer understands. `scroll` stays on the page and moves to the
 * element with that id; `open` is a full document navigation; `contact` opens
 * the contact modal over the page.
 */
export type ChatCommand = { scroll: string } | { open: string } | { contact: true };

export const CHAT_COMMANDS: Record<string, ChatCommand> = {
  portfolio: { scroll: "work" },
  work: { scroll: "work" },
  about: { open: "/about/" },
  playground: { open: "/playground/" },
  contact: { contact: true },
};

/** The reply to anything the composer does not understand. */
export const CHAT_HINT = "Try 'portfolio', 'about', 'playground', or 'contact'.";
