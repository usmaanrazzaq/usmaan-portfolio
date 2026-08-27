import type { Metadata } from "next";
import RentedCaseStudy from "@/components/RentedCaseStudy";

// Same order the static page links them in: page styles, then the shared chart
// and metric animations, then the dark theme overrides.
import "@/styles/paper-cs.css";
import "@/styles/paper-cs-charts.css";
import "@/styles/paper-cs-theme.css";

export const metadata: Metadata = {
  title: "Rented - Case Study",
  description:
    "Case study: Designing a peer-to-peer rental experience for urban renters.",
  alternates: { canonical: "/rented/rented/" },
};

export default function RentedCaseStudyPage() {
  return <RentedCaseStudy />;
}
