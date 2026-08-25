import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import ContactModal from "@/components/ContactModal";
import SiteChrome from "@/components/SiteChrome";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const description =
  "Portfolio of Usmaan Razzaq — Product Designer based in Queens, NY. Designing digital experiences that feel effortless.";

export const metadata: Metadata = {
  metadataBase: new URL("https://usmaanrazzaq.design"),
  title: "Usmaan Razzaq — Product Designer",
  description,
  openGraph: {
    type: "website",
    url: "https://usmaanrazzaq.design/",
    title: "Usmaan Razzaq — Product Designer",
    description,
    siteName: "Usmaan Razzaq",
    images: [{ url: "/iOS Icon.png", width: 180, height: 180 }],
  },
  twitter: {
    card: "summary",
    title: "Usmaan Razzaq — Product Designer",
    description,
    images: ["/iOS Icon.png"],
  },
  icons: {
    icon: [{ url: "/Favicon.png", sizes: "48x48" }],
    apple: [{ url: "/iOS Icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  // The blocking theme script rewrites this before first paint when the
  // visitor's stored preference is dark.
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* A plain link, not a CSS import, so the Rented widget's HTML, JS, and
            CSS stay one unit synced from the static site. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/shared/rented-prototype.css" />
      </head>
      <body className="bg-page text-ink min-h-screen">
        <section
          className="paper-home mx-auto w-[min(1512px,100%)] px-gutter pt-7 pb-20 font-sans text-base leading-[1.55] to-md:px-5 to-md:pt-5 to-md:pb-16"
          aria-labelledby="home-title"
        >
          <SiteChrome />
          {children}
        </section>

        <ContactModal />

        {/* The Rented showcase widget is shared with the static case study, so it
            stays a plain script that mounts itself into [data-rp-embed]. */}
        <Script src="/shared/rented-prototype.js" strategy="afterInteractive" />
        <Analytics />
      </body>
    </html>
  );
}
