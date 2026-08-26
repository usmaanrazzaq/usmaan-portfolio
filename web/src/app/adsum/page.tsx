import type { Metadata } from "next";
import AdsumCaseStudy from "@/components/AdsumCaseStudy";

// Same order the static page links them in: the shared case study styles, the
// chart and metric animations, the Adsum-only overrides, then the dark theme.
import "@/styles/paper-cs.css";
import "@/styles/paper-cs-charts.css";
import "@/styles/paper-cs-adsum.css";
import "@/styles/paper-cs-theme.css";

export const metadata: Metadata = {
  title: "Adsum NYC - Case Study",
  description:
    "Case study: Product design, campaigns, and marketing for Adsum NYC, a Brooklyn-based DTC clothing brand.",
  alternates: { canonical: "/adsum/" },
};

export default function AdsumCaseStudyPage() {
  return <AdsumCaseStudy />;
}
