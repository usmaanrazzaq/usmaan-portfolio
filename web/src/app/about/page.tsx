import type { Metadata } from "next";
import { SHARE_OPEN_GRAPH, SHARE_TWITTER } from "@/lib/share";
import AboutContent from "@/components/AboutContent";
import HomeShell from "@/components/HomeShell";

// The About-only layout. Everything else — chrome, type, tokens — is shared
// with the homepage.
import "@/styles/paper-about.css";

const description =
  "About Usmaan Razzaq — Product Designer and Front-End Developer based in Queens, NY.";

export const metadata: Metadata = {
  title: "About | Usmaan Razzaq",
  description,
  alternates: { canonical: "/about/" },
  // Spread back in so link previews show the site icon, not a scraped image.
  openGraph: {
    ...SHARE_OPEN_GRAPH,
    url: "/about/",
    title: "About — Usmaan Razzaq, Product Designer",
    description,
  },
  twitter: {
    ...SHARE_TWITTER,
    title: "About — Usmaan Razzaq, Product Designer",
    description,
  },
};

export default function About() {
  return (
    <HomeShell className="paper-about" labelledBy="about-title" current="about">
      <AboutContent />
    </HomeShell>
  );
}
