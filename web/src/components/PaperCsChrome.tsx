"use client";

import { useEffect } from "react";
import type { ReactNode, Ref } from "react";

/**
 * The frame every paper case study shares: the `paper-cs-route` body class the
 * copied CSS keys its background off, and the Back pill. Lightboxes stay with
 * the individual case study, since Rented enlarges charts and WCM enlarges
 * images.
 */
export default function PaperCsChrome({
  className,
  ref,
  children,
}: {
  className?: string;
  ref?: Ref<HTMLElement>;
  children: ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add("paper-cs-route");
    return () => document.body.classList.remove("paper-cs-route");
  }, []);

  return (
    <main
      className={className ? `paper-cs ${className}` : "paper-cs"}
      aria-labelledby="cs-title"
      ref={ref}
    >
      {/* Not next/link: the Rented prototype script mounts itself once per
          document load, so a client-side navigation would leave the homepage
          showcase sitting on its fallback image. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className="paper-cs__back" href="/">
        <svg width="18" height="18" viewBox="0 0 21.6 21.6" aria-hidden="true">
          <path
            d="M12.6 16.2L7.2 10.8 12.6 5.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </a>

      {children}
    </main>
  );
}
