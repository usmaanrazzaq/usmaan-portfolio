import type { Metadata } from "next";
import HomeShell from "@/components/HomeShell";
import ReferencesContent from "@/components/ReferencesContent";
import { LOCAL_REFERENCES } from "@/data/references";
import { getArenaReferences } from "@/lib/arena";

// The References-only layout. Everything else — chrome, type, tokens — is
// shared with the homepage. Deliberately unlinked: no nav tab points here.
import "@/styles/paper-references.css";

const description =
  "References by Usmaan Razzaq — a selection of images used as design inspiration.";

export const metadata: Metadata = {
  title: "References | Usmaan Razzaq",
  description,
  alternates: { canonical: "/references/" },
  openGraph: {
    url: "/references/",
    title: "References | Usmaan Razzaq",
    description,
  },
  twitter: {
    title: "References | Usmaan Razzaq",
    description,
  },
};

export default async function References() {
  // Both Are.na channels, newest connection first; the Paper images if Are.na
  // is unreachable.
  const arena = await getArenaReferences();
  const references = arena.length ? arena : LOCAL_REFERENCES;

  return (
    <HomeShell className="paper-references" labelledBy="references-title" current={null}>
      <ReferencesContent references={references} />
    </HomeShell>
  );
}
