import type { HeroSky } from "@/data/heroSkies";
import type { Reference } from "@/data/references";

/** The public channel the hero plate draws from. */
export const ARENA_CHANNEL = "spaces-buildings-and-things";

/** Are.na's maximum page size, and the value short-page detection is measured against. */
const PER_PAGE = 100;

/** Runaway guard: the API reports no total, so the only stop signal is a short page. */
const MAX_PAGES = 20;

/** The list is cached for an hour; the random pick happens per load, in the browser. */
const REVALIDATE_SECONDS = 3600;

/** Used when a block carries no human-written description of its own. */
const GENERIC_ALT = "Image from the Spaces, Buildings and Things collection on Are.na";

type ArenaBlock = {
  class?: string;
  description?: string | null;
  image?: {
    large?: { url?: string };
    display?: { url?: string };
    original?: { url?: string };
  } | null;
};

function urlFor(block: ArenaBlock): string | undefined {
  const image = block.image;
  if (!image) return undefined;
  return image.large?.url || image.display?.url || image.original?.url || undefined;
}

/**
 * Block titles are a mix of filenames ("original_bca805….jpg") and URL slugs
 * ("john-pawson-home-farm-costswolds-aucoot-favourit"), so they would put junk
 * in the plate's aria-label. Descriptions are hand-written where they exist;
 * otherwise name the source rather than invent a description of the image.
 */
function altFor(block: ArenaBlock): string {
  const description = block.description?.trim();
  return description ? description : GENERIC_ALT;
}

/** Fisher-Yates, so the capped subset is an unbiased sample of the channel. */
function shuffle<T>(items: T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * The hero pool, read from the public Are.na channel on the server.
 *
 * Unauthenticated: the channel is public, so there is no key and nothing
 * secret to keep out of the browser. The browser never calls the Are.na API at
 * all — it only picks an index out of the list this inlines.
 *
 * The endpoint returns no `length` or `total_pages`, so pagination can only
 * stop on a short page.
 *
 * Any failure returns an empty list; HomeHero falls back to the local pool.
 */
export async function getArenaSkies(): Promise<HeroSky[]> {
  const blocks: ArenaBlock[] = [];

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await fetch(
        `https://api.are.na/v2/channels/${ARENA_CHANNEL}/contents?per=${PER_PAGE}&page=${page}`,
        { next: { revalidate: REVALIDATE_SECONDS } },
      );
      if (!response.ok) throw new Error(`are.na responded ${response.status}`);

      const contents: ArenaBlock[] = (await response.json())?.contents ?? [];
      blocks.push(...contents);

      // A short page is the last page.
      if (contents.length < PER_PAGE) break;
    }
  } catch (error) {
    console.warn("[arena] channel fetch failed, falling back to the local pool:", error);
    return [];
  }

  const skies: HeroSky[] = [];
  for (const block of blocks) {
    if (block.class !== "Image") continue;
    const src = urlFor(block);
    if (!src) continue;
    skies.push({ src, alt: altFor(block) });
  }

  // The whole channel is inlined rather than capped. Measured on a real build:
  // 138 images is ~61KB of HTML that gzips to ~10KB, since Are.na's URLs share
  // a long base64 prefix. Cap this with a .slice() if the raw HTML ever matters
  // more than showing the whole channel. Shuffled so the browser's picker sees
  // no ordering bias.
  return shuffle(skies);
}

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
 * One channel's blocks that carry an image, from the v3 API. v3 rather than the v2 the hero
 * uses because it carries each image's dimensions (so the grid reserves space
 * before images load), real alt text, and pagination metadata.
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
 * Unauthenticated, like the hero: the channels are public. Any failure returns
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
