import type { HeroSky } from "@/data/heroSkies";

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
