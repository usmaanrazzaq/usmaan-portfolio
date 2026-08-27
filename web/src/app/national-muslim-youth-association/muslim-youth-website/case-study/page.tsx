import type { Metadata } from "next";
import NmyaCaseStudy from "@/components/NmyaCaseStudy";

// Same order the static page links them in: the shared case study styles, the
// chart and metric animations, the NMYA-only overrides, then the dark theme.
import "@/styles/paper-cs.css";
import "@/styles/paper-cs-charts.css";
import "@/styles/paper-cs-nmya.css";
import "@/styles/paper-cs-theme.css";

// The route nests under the project directory the static site used, so the
// live URL has to keep resolving.
export const metadata: Metadata = {
  title: "National Muslim Youth Association - Case Study",
  description: "Case study: Redesigning a non-profit site to better serve Muslim youth.",
  alternates: {
    canonical: "/national-muslim-youth-association/muslim-youth-website/case-study/",
  },
};

export default function NmyaCaseStudyPage() {
  return <NmyaCaseStudy />;
}
