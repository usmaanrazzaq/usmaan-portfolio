/**
 * The selected work list, copied verbatim from the homepage markup in the
 * static site. `slug` feeds the `data-work` attribute the media washes key off,
 * so it must keep matching the selectors in styles/paper-home.css.
 *
 * Rented, WCM, Adsum, and On The Run Studio case study hrefs resolve to Next
 * routes. The rest still point at the static HTML pages at the repo root; those
 * routes have not been migrated yet.
 */

export type ProjectMedia =
  | { kind: "image"; src: string; alt?: string; lazy?: boolean }
  | { kind: "video"; src: string; label: string; poster?: string }
  | { kind: "rented-showcase"; fallbackSrc: string };

export type Project = {
  slug: "rented" | "nmya" | "adsum" | "otrs" | "wcm";
  title: string;
  date: string;
  headline: string;
  description: string;
  caseHref: string;
  siteHref?: string;
  mediaLabel: string;
  media: ProjectMedia;
};

export const MEDIA_WIDTH = 906;
export const MEDIA_HEIGHT = 612;

export const projects: Project[] = [
  {
    slug: "rented",
    title: "Rented",
    date: "Nov 2024 - Feb 2025",
    headline: "Designing a peer-to-peer rental experience for urban renters",
    description:
      "Lead the UI design and developed a functioning prototype for a peer-to-peer rental app. I worked along a team of engineers / founders to bring their apps vision to life through Design, research, and prototyping.",
    caseHref: "/rented/rented/",
    mediaLabel: "Read Rented case study",
    media: { kind: "rented-showcase", fallbackSrc: "/images/home-rented-showcase.webp" },
  },
  {
    slug: "nmya",
    title: "National Muslim Youth Association",
    date: "Nov 2023 - Nov 2025",
    headline: "Redesigning a non-profit site to better serve Muslim youth.",
    description:
      "I led a redesign overhaul of the nonprofit association\u2019s website. I worked with stakeholders to better understand the longstanding issues, their goals for the website, and the problems they faced. I conducted user research through three to five focus groups with participants from different demographics, including age, roles, and knowledge levels. I used the feedback and research findings to redesign and develop the nonprofit\u2019s website while proposing a migration from WordPress to Webflow.",
    caseHref: "/national-muslim-youth-association/muslim-youth-website/case-study",
    siteHref: "https://atfal-website.vercel.app/",
    mediaLabel: "Read National Muslim Youth Association case study",
    media: {
      kind: "video",
      src: "/video/NMYA-Video-Display.mov",
      poster: "/images/home-nmya-showcase.webp",
      label: "National Muslim Youth Association website showcase",
    },
  },
  {
    slug: "adsum",
    title: "Adsum NYC",
    date: "Nov 2025 - Present",
    headline: "Product design & Marketing for a Brooklyn-based brand.",
    description:
      "For a Brooklyn-based clothing brand serving 15K+ monthly active visitors, I designed a custom size filter that cut clicks to unavailable products by 35%.",
    caseHref: "/adsum/",
    siteHref: "https://adsumnyc.com/",
    mediaLabel: "Read Adsum NYC case study",
    media: {
      kind: "video",
      src: "/video/Adsum-SS26-Vid.mov",
      label: "Adsum NYC SS26 product and landing page showcase",
    },
  },
  {
    slug: "otrs",
    title: "On The Run Studio",
    date: "Mar 2021 - Aug 2026",
    headline: "Creating a brand and a Design Studio.",
    description:
      "What started as a visual reference account grew into a 5,000+ community of designers, studios, and brands — then a merch line, then a full design studio. Community insight now drives every client engagement.",
    caseHref: "/on-the-run-studio/on-the-run-studio/otrs-case-study/",
    siteHref: "https://on-the-run-studio-site.vercel.app/",
    mediaLabel: "Read On The Run Studio case study",
    media: {
      kind: "video",
      src: "/video/OTRS-Final-Display.mov",
      label: "On The Run Studio website showcase",
    },
  },
  {
    slug: "wcm",
    title: "WCM Connect App",
    date: "Personal Project",
    headline:
      "A self-initiated concept redesign of an existing patient app's onboarding, dashboard, and scheduling, based on public App Store reviews.",
    description:
      "WCM Connect App is a self-initiated concept redesign I did of an existing app on the app store. I researched the problems and issues real users were facing through reviews on the app store, online discussions, and feedback. I focused on redesigning and improving the onboarding, dashboard, and scheduling.",
    caseHref: "/wcm-connect/",
    mediaLabel: "Read WCM Connect App case study",
    media: {
      kind: "image",
      src: "/images/home-wcm-showcase.webp?v=20260720-2144",
      lazy: true,
    },
  },
];
