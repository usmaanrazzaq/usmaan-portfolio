/**
 * The *fallback* pool for the hero's right-hand plate.
 *
 * The live source is the Are.na channel in lib/arena.ts; this list is only used
 * when that fetch fails or the channel comes back empty, so the plate is never
 * blank. One entry is picked at random on every fresh page load — see
 * lib/heroSky.ts for why that has to happen in the browser rather than here.
 *
 * To change what the hero normally shows, add to the Are.na channel, not here.
 *
 * ── Adding an image ──────────────────────────────────────────────────────────
 * 1. Save the file into `web/public/hero/` (tracked in git, and untouched by
 *    scripts/sync-public.mjs, so nothing else needs to change).
 * 2. Add one line below.
 *
 * The plate renders 500×520 on desktop and full-width × 280 on mobile, always
 * `background-size: cover` and centred — so supply roughly square-to-portrait
 * WebP around 1000×1040 (2×) and expect the edges to be cropped. The original
 * sky is 188KB; that is a sensible ceiling.
 *
 * `alt` is read out by screen readers: the plate is exposed as role="img" and
 * the picker rewrites its aria-label to match whichever image it chose. Write a
 * real description, not a filename.
 *
 * An entry whose file is not on disk yet just 404s on that one plate. It is
 * safe to list an image before you have added it.
 */

export type HeroSky = {
  /** Absolute path under web/public. */
  src: string;
  /** What the image shows, for the plate's aria-label. */
  alt: string;
};

export const heroSkies: HeroSky[] = [
  { src: "/hero/home-hero-sky.webp", alt: "Overcast sky" },
  {
    src: "/hero/home-hero-townhouse.webp",
    alt: "Steel-framed townhouse facade with curtained windows above brick",
  },
  {
    src: "/hero/home-hero-chapel.webp",
    alt: "A concrete field chapel standing alone in snow",
  },
  {
    src: "/hero/home-hero-light.webp",
    alt: "A trapezoid of sunlight falling across a grey interior wall",
  },
  {
    src: "/hero/home-hero-pavilion.webp",
    alt: "A glass and steel pavilion among bare trees in snow",
  },
  {
    src: "/hero/home-hero-spiral.webp",
    alt: "A stone spiral curling into a shallow lake",
  },
  {
    src: "/hero/home-hero-steel.webp",
    alt: "Two people standing inside curved steel plates in a fabrication shop",
  },
  {
    src: "/hero/home-hero-lamp.webp",
    alt: "A person sitting on the floor of a near-empty room beside a tall lamp",
  },
  {
    src: "/hero/home-hero-interior.webp",
    alt: "A modernist living room looking out onto snow-covered trees",
  },
];
