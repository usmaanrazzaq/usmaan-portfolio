import type { Metadata } from "next";
import WcmCaseStudy from "@/components/WcmCaseStudy";

// Same order the static page links them in: the shared case study styles, the
// WCM-only overrides, then the dark theme. No charts sheet — this page has none.
import "@/styles/paper-cs.css";
import "@/styles/paper-cs-wcm.css";
import "@/styles/paper-cs-theme.css";

export const metadata: Metadata = {
  title: "WCM Connect App - Case Study",
  description:
    "Case study: A self-initiated concept redesign of an existing patient app's onboarding, dashboard, and scheduling.",
  alternates: { canonical: "/wcm-connect/" },
};

export default function WcmCaseStudyPage() {
  return <WcmCaseStudy />;
}
