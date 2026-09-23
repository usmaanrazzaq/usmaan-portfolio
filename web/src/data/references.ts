/** One image on the References page, from Are.na or the local fallback. */
export type Reference = {
  id: string;
  /** The grid image. */
  src: string;
  /** Optional responsive candidates for the grid image. */
  srcSet?: string;
  /** The lightbox image; larger than `src` where the source offers one. */
  full: string;
  width: number;
  height: number;
  /**
   * True when the source has no stored dimensions (a few older Are.na
   * blocks). width/height are then a square guess, used only to place the
   * image in a column; the browser sizes the image itself once it loads.
   */
  unsized?: boolean;
  alt: string;
};

/**
 * The eight images from the Paper "Main" frame, newest-first like the Are.na
 * feed. Shown only when Are.na can't be reached.
 */
export const LOCAL_REFERENCES: Reference[] = [
  {
    src: "/images/references/snowy-building.webp",
    width: 784,
    height: 560,
    alt: "A rammed-earth chapel standing alone in a snowy field",
  },
  {
    src: "/images/references/black-white-building.webp",
    width: 1000,
    height: 1241,
    alt: "Blurred black and white photograph of dark skyscrapers",
  },
  {
    src: "/images/references/wooden-room.webp",
    width: 1000,
    height: 1000,
    alt: "A study seen through a plaster doorway, with bookshelves and a desk",
  },
  {
    src: "/images/references/metal-frame.webp",
    width: 841,
    height: 1190,
    alt: "Hester Fell's Autoprogettazione table in a concrete yard, with printed notes",
  },
  {
    src: "/images/references/church-interior.webp",
    width: 723,
    height: 1086,
    alt: "Timber church interior with a pitched roof, tall windows, and rows of pews",
  },
  {
    src: "/images/references/wooden-boxes.webp",
    width: 1000,
    height: 667,
    alt: "Six wooden wall boxes arranged in a grid on a white wall",
  },
  {
    src: "/images/references/leather-chair.webp",
    width: 1000,
    height: 1025,
    alt: "Brown leather lounge chair beside a bookcase and white stair railing",
  },
  {
    src: "/images/references/window-person.webp",
    width: 753,
    height: 1044,
    alt: "Illustration of a person at an ornate bay window",
  },
].map((image) => ({ ...image, id: image.src, full: image.src }));
