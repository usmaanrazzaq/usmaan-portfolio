import type { Metadata } from "next";
import HomeShell from "@/components/HomeShell";
import PlaygroundContent from "@/components/PlaygroundContent";

// The Playground-only layout. Everything else — chrome, type, tokens — is
// shared with the homepage.
import "@/styles/paper-playground.css";

const description = "Playground by Usmaan Razzaq — personal and client design work.";

export const metadata: Metadata = {
  title: "Playground | Usmaan Razzaq",
  description,
  alternates: { canonical: "/playground/" },
  openGraph: {
    url: "/playground/",
    title: "Playground | Usmaan Razzaq",
    description,
  },
  twitter: {
    title: "Playground | Usmaan Razzaq",
    description,
  },
};

export default function Playground() {
  return (
    <HomeShell className="paper-projects" labelledBy="playground-title" current="playground">
      <PlaygroundContent />
    </HomeShell>
  );
}
