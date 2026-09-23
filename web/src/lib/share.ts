import type { Metadata } from "next";

/**
 * The link-preview image: the site icon, as in the root layout.
 *
 * Next merges metadata shallowly, so a page that sets its own `openGraph` or
 * `twitter` replaces the layout's wholesale and loses this image. Messaging
 * apps then fall back to scraping an image off the page. Pages that override
 * either key spread these back in.
 */
export const SHARE_IMAGE = { url: "/iOS Icon.png", width: 180, height: 180 };

export const SHARE_OPEN_GRAPH = {
  type: "website",
  siteName: "Usmaan Razzaq",
  images: [SHARE_IMAGE],
} satisfies Metadata["openGraph"];

export const SHARE_TWITTER = {
  card: "summary",
  images: [SHARE_IMAGE.url],
} satisfies Metadata["twitter"];
