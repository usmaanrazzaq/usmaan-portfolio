import type { Reference } from "@/data/references";

/** Are.na's maximum page size, and the value short-page detection is measured against. */
const PER_PAGE = 100;

/** Runaway guard: the API reports no total, so the only stop signal is a short page. */
const MAX_PAGES = 20;

/* ------------------------------------------------------------------------ */
/* References page                                                          */
/* ------------------------------------------------------------------------ */

/** The public channels the References page merges, newest connection first. */
export const REFERENCE_CHANNELS = [
  "layouts-designs-elements",
  "spaces-buildings-and-things",
  "additional-for-references",
] as const;

/** New connections are eligible for a background refresh after one minute. */
const REFERENCES_REVALIDATE_SECONDS = 60;

/** Longer descriptions are notes rather than alt text. */
const MAX_ALT_LENGTH = 160;

type ArenaV3Size = { src?: string; width?: number; height?: number };

type ArenaV3Block = {
  id: number;
  description?: { plain?: string } | null;
  image?: {
    alt_text?: string | null;
    width?: number;
    height?: number;
    src?: string;
    small?: ArenaV3Size;
    medium?: ArenaV3Size;
    large?: ArenaV3Size;
  } | null;
  connection?: { connected_at?: string } | null;
};

type ArenaV3Page = {
  data?: ArenaV3Block[];
  meta?: { has_more_pages?: boolean };
};

type Connected = { reference: Reference; connectedAt: number };

/**
 * One channel's blocks that carry an image, from the v3 API, which carries
 * each image's dimensions (so the grid reserves space before images load),
 * real alt text, and pagination metadata.
 */
async function getChannelReferences(channel: string, title: string): Promise<Connected[]> {
  const out: Connected[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const response = await fetch(
      `https://api.are.na/v3/channels/${channel}/contents?per=${PER_PAGE}&page=${page}`,
      { next: { revalidate: REFERENCES_REVALIDATE_SECONDS } },
    );
    if (!response.ok) throw new Error(`are.na responded ${response.status} for ${channel}`);

    const body: ArenaV3Page = await response.json();
    for (const block of body.data ?? []) {
      const reference = toReference(block, title);
      if (!reference) continue;
      out.push({ reference, connectedAt: Date.parse(block.connection?.connected_at ?? "") || 0 });
    }

    if (!body.meta?.has_more_pages) break;
  }

  return out;
}

function toReference(block: ArenaV3Block, channelTitle: string): Reference | null {
  const image = block.image;
  // Images, plus the thumbnails Are.na keeps for links, embeds, and
  // attachments. Text blocks have no image and are left out.
  if (!image) return null;

  // A few older blocks have no stored dimensions; keep them, flagged.
  const unsized = !image.width || !image.height;
  const width = image.width || 1000;
  const height = image.height || 1000;
  const src = image.medium?.src || image.src;
  if (!src) return null;

  // The resized variants are "fit inside, without enlargement", so their
  // reported box can be larger than the image; clamp to the real width so the
  // srcset descriptors are honest.
  // Grid columns top out around 370px, so small and medium cover 1x and 2x;
  // large is kept for the lightbox only.
  const candidates = unsized
    ? []
    : [image.small, image.medium]
        .filter((size): size is Required<ArenaV3Size> => Boolean(size?.src && size.width))
        .map((size) => `${size.src} ${Math.min(size.width, width)}w`);

  const description = block.description?.plain?.trim();
  const alt =
    image.alt_text?.trim() ||
    (description && description.length <= MAX_ALT_LENGTH ? description : "") ||
    `Image from the ${channelTitle} channel on Are.na`;

  return {
    id: String(block.id),
    src,
    srcSet: candidates.length ? [...new Set(candidates)].join(", ") : undefined,
    full: image.large?.src || image.src || src,
    width,
    height,
    ...(unsized && { unsized }),
    alt,
  };
}

/**
 * Every image block connected to the reference channels, newest connection first
 * across all of them. A block connected to multiple channels appears once, at its most
 * recent connection.
 *
 * Unauthenticated: the channels are public. Any failure returns
 * an empty list and the page falls back to the local Paper images.
 */
export async function getArenaReferences(): Promise<Reference[]> {
  const titles: Record<(typeof REFERENCE_CHANNELS)[number], string> = {
    "layouts-designs-elements": "Layouts, Designs, Elements",
    "spaces-buildings-and-things": "Spaces, Buildings, and Things",
    "additional-for-references": "Additional for References",
  };

  let connected: Connected[];
  try {
    const channels = await Promise.all(
      REFERENCE_CHANNELS.map((channel) => getChannelReferences(channel, titles[channel])),
    );
    connected = channels.flat();
  } catch (error) {
    console.warn("[arena] reference channels fetch failed, falling back to local images:", error);
    return [];
  }

  connected.sort((a, b) => b.connectedAt - a.connectedAt);

  const seen = new Set<string>();
  return connected
    .filter(({ reference }) => !seen.has(reference.id) && seen.add(reference.id))
    .map(({ reference }) => reference);
}
