import type { Metadata } from "next";
import OtrsCaseStudy from "@/components/OtrsCaseStudy";

// Same order the static page links them in: the shared case study styles, the
// chart and metric animations, the OTRS-only overrides, then the dark theme.
import "@/styles/paper-cs.css";
import "@/styles/paper-cs-charts.css";
import "@/styles/paper-cs-otrs.css";
import "@/styles/paper-cs-theme.css";

// The folder name repeats because the static site nests the case study inside
// its own project directory; the live URL has to keep resolving.
export const metadata: Metadata = {
  title: "On The Run Studio - Case Study",
  description: "Case study: Creating a brand and a design studio — On The Run Studio.",
  alternates: { canonical: "/on-the-run-studio/on-the-run-studio/otrs-case-study/" },
};

export default function OtrsCaseStudyPage() {
  return <OtrsCaseStudy />;
}
