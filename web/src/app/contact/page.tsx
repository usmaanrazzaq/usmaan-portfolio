import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import HomeShell from "@/components/HomeShell";

export const metadata: Metadata = {
  title: "Contact | Usmaan Razzaq",
};

/**
 * /contact/ is the homepage with the contact modal open over it. ContactModal
 * reads the path on mount and opens itself.
 */
export default function Contact() {
  return (
    <HomeShell>
      <HomeContent />
    </HomeShell>
  );
}
