import type { Metadata } from "next";
import { SHARE_OPEN_GRAPH, SHARE_TWITTER } from "@/lib/share";
import HomeShell from "@/components/HomeShell";
import ExplorationsContent from "@/components/ExplorationsContent";

// The Explorations-only layout. Everything else — chrome, type, tokens — is
// shared with the homepage.
import "@/styles/paper-explorations.css";

const description = "Explorations by Usmaan Razzaq — personal and client design work.";

export const metadata: Metadata = {
  title: "Explorations | Usmaan Razzaq",
  description,
  alternates: { canonical: "/explorations/" },
  // Spread back in so link previews show the site icon, not a scraped image.
  openGraph: {
    ...SHARE_OPEN_GRAPH,
    url: "/explorations/",
    title: "Explorations | Usmaan Razzaq",
    description,
  },
  twitter: {
    ...SHARE_TWITTER,
    title: "Explorations | Usmaan Razzaq",
    description,
  },
};

export default function Explorations() {
  return (
    <HomeShell className="paper-projects" labelledBy="explorations-title" current="explorations">
      <ExplorationsContent />
    </HomeShell>
  );
}
