import type { Metadata } from "next";
import ShiftsCaseStudy from "@/components/ShiftsCaseStudy";

// paper-cs-wcm.css is here for its image lightbox rules; its media rules are
// scoped to `.paper-cs--wcm` and do not reach this page.
import "@/styles/paper-cs.css";
import "@/styles/paper-cs-wcm.css";
import "@/styles/paper-cs-shifts.css";
import "@/styles/paper-cs-theme.css";

export const metadata: Metadata = {
  title: "Shifts Web App - Case Study",
  description:
    "Case study: Designing a simple and modern shifts management application for small to large scale teams.",
  alternates: { canonical: "/shifts/" },
};

export default function ShiftsCaseStudyPage() {
  return <ShiftsCaseStudy />;
}
