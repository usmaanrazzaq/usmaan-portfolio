import type { Metadata } from "next";
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
  openGraph: {
    url: "/about/",
    title: "About — Usmaan Razzaq, Product Designer",
    description,
  },
  twitter: {
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
