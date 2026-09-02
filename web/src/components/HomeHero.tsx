import LiveStatus from "@/components/LiveStatus";
import Socials from "@/components/Socials";
import { heroSkies } from "@/data/heroSkies";
import { getArenaSkies } from "@/lib/arena";
import { HERO_SKY_ID, heroSkyScript } from "@/lib/heroSky";

/** Always on disk, so the plate has something to show before the picker runs. */
const PAPER_SKY = "/hero/home-hero-sky.webp";

/**
 * The homepage hero, ported from the "Postcard - Update" Paper frame: a cream
 * panel with a baked Halftone Dots texture (paper grain, ghosted stamp, dotted
 * center line) behind a 540px text column and a 500px sky plate.
 *
 * The inner layout is the frame's own 1141×600. On viewports narrower than
 * that, the whole card scales as a unit so the copy and the plate are not
 * clipped. Below 768px it unwraps into a stacked column instead.
 *
 * Colours all resolve through the --home-* tokens.
 */
export default async function HomeHero() {
  // The Are.na channel is the source; the local manifest is the fallback when
  // that fetch fails or the channel is empty.
  const arena = await getArenaSkies();
  const pool = arena.length > 0 ? arena : heroSkies;

  return (
    <div className="home-hero-postcard home-enter-panel [--enter-delay:100ms]">
      <h1 id="home-title" className="sr-only">
        Usmaan Razzaq
      </h1>

      <div className="home-hero-postcard__scale">
        <div className="home-hero-postcard__inner">
          {/* The shader is baked with its cream ground, grain, stamp, and dotted
              rule. The frame is drawn light-only, and that cream would read as a
              pale wash on the dark panel — inverting it puts the ground back
              within a level of the panel and leaves just the marks showing. z-0
              keeps it under the copy and the sky plate, which both sit in later
              stacking layers. On the stacked mobile card, object-right crops
              to the grain-only half so the stamp and dotted rule stay off. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/home-hero-texture.webp"
            width={1141}
            height={600}
            alt=""
            aria-hidden="true"
            className="home-hero-postcard__texture home-enter-stamp pointer-events-none absolute inset-0 z-0 size-full object-cover [--enter-delay:600ms] dark:invert to-md:object-right"
          />

          <div className="relative z-10 flex h-[520px] w-[540px] min-w-0 shrink-0 flex-col justify-between gap-[25px] px-2.5 py-[25px] to-md:h-auto to-md:w-full to-md:gap-10 to-md:px-0">
            <div className="relative flex w-full min-w-0 flex-col items-start gap-5">
              <LiveStatus className="home-enter text-muted mb-3 flex items-center gap-1.5 text-xs leading-[1.5] font-light whitespace-nowrap [--enter-delay:360ms] to-sm:min-h-6 to-sm:flex-wrap to-sm:whitespace-normal" />

              <p className="home-enter text-ink w-full text-sm leading-[1.4] font-normal [--enter-delay:440ms]">
                {
                  "I'm Usmaan, a product designer based in New York, NY. I own the process end-to-end — research, design, and shipped code — as the sole designer working directly with engineers and founders, across consumer products, non-profits, and e-commerce."
                }
              </p>
            </div>

            <Socials className="home-enter [--enter-delay:520ms]" />
          </div>

          {/* The plate's image is chosen per load by the script below, out of the
              Are.na pool the server fetched. The Paper sky is rendered as the
              default so a failed fetch, an empty channel, or a visitor without JS
              still sees an image rather than a blank plate, and
              suppressHydrationWarning acknowledges the script rewriting the label
              -- the same deal layout.tsx makes on <html> for the theme script. The
              media wash sits underneath for the moment before the image arrives. */}
          <div
            id={HERO_SKY_ID}
            role="img"
            aria-label="Overcast sky"
            suppressHydrationWarning
            className="home-enter-plate relative z-10 h-[520px] w-[500px] shrink-0 bg-media bg-cover bg-center [--enter-delay:200ms] to-md:h-[280px] to-md:w-full to-md:flex-none"
            style={{
              "--hero-sky": `url(${PAPER_SKY})`,
              backgroundImage: "var(--hero-sky)",
            } as React.CSSProperties}
          />
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: heroSkyScript(pool) }} />
    </div>
  );
}
