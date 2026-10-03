"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import DemoLightbox, { useDemoLightbox } from "@/components/DemoLightbox";
import {
  mountListingsDemo,
  mountProfileTabsDemo,
  mountSuggestionsDemo,
} from "@/lib/rented/demos";

/** The demos read `--i` off each item to stagger the stack-load entrance. */
function step(index: number) {
  return { "--i": index } as CSSProperties;
}

function Suggestions() {
  return (
    <div className="rsd" aria-hidden="true">
      <div className="rsd__stage is-intro">
        <ul className="rsd__chips">
          <li style={step(0)}>
            <span className="rsd__chip">Hand Tools</span>
          </li>
          <li style={step(1)}>
            <span className="rsd__chip">Audio Equipment</span>
          </li>
          <li style={step(2)}>
            <span className="rsd__chip">Kitchen Appliances</span>
          </li>
          <li style={step(3)}>
            <span className="rsd__chip">Tents &amp; Events Spaces</span>
          </li>
        </ul>
        <div className="rsd__search">
          <span className="rsd__placeholder">Search for a product</span>
          <span className="rsd__actions">
            <svg className="rsd__mic" viewBox="0 0 10 16" width="10" height="16" focusable="false">
              <path
                d="M5 1.05a2.05 2.05 0 0 0-2.05 2.05v5.56a2.05 2.05 0 1 0 4.1 0V3.1A2.05 2.05 0 0 0 5 1.05Z"
                fill="none"
                stroke="#939393"
                strokeWidth="0.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 7.3v1.39a4 4 0 0 0 8 0V7.3"
                fill="none"
                stroke="#939393"
                strokeWidth="0.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 13.5v2.2M2.5 15.7h5"
                fill="none"
                stroke="#939393"
                strokeWidth="0.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="rsd__send">
              <svg viewBox="0 0 15 15" width="15" height="15" focusable="false">
                <circle cx="7.5" cy="7.5" r="7.5" fill="none" stroke="#fff" strokeWidth="0.67" />
                <path
                  d="M7.5 11.67V3.33M4.17 6.67 7.5 3.33l3.33 3.34"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="0.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function ProfileTabs() {
  return (
    <div className="rpd" aria-hidden="true">
      <div className="rpd__tabs" data-rpd-tabs data-tab="0" style={{ "--tab": 0 } as CSSProperties}>
        <span className="rpd__thumb" />
        <span className="rpd__btn is-active" data-rpd-tab="0">Listed</span>
        <span className="rpd__btn" data-rpd-tab="1">History</span>
        <span className="rpd__btn" data-rpd-tab="2">Review</span>
      </div>

      <div className="rpd__panels">
        <div className="rpd__panel is-active is-intro" data-rpd-panel="0">
          <ul className="rpd__grid">
            <li style={step(0)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/rented-proto/studio.webp" width="176" height="195" alt="" loading="lazy" />
              <span>Studio Equipment</span>
            </li>
            <li style={step(1)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/rented-proto/easel-field.webp" width="176" height="195" alt="" loading="lazy" />
              <span>Painting Equipment</span>
            </li>
            <li style={step(2)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/rented-proto/mower.webp?v=20260803-trim" width="176" height="195" alt="" loading="lazy" />
              <span>Lawn Mower</span>
            </li>
          </ul>
        </div>

        <div className="rpd__panel" data-rpd-panel="1" hidden>
          <ul className="rpd__rows">
            <li style={step(0)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/rented-proto/easel-field.webp" width="52" height="58" alt="" loading="lazy" />
              <div>
                <h4>Painting Equipment</h4>
                <p>Lent to Maya R. · Mar 2 – 6</p>
              </div>
              <span className="rpd__amount">$60</span>
            </li>
            <li style={step(1)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/rented-proto/studio.webp" width="52" height="58" alt="" loading="lazy" />
              <div>
                <h4>Studio Equipment</h4>
                <p>Lent to Devon K. · Feb 14 – 16</p>
              </div>
              <span className="rpd__amount">$180</span>
            </li>
            <li style={step(2)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/rented-proto/mower.webp?v=20260803-trim" width="52" height="58" alt="" loading="lazy" />
              <div>
                <h4>Lawn Mower</h4>
                <p>Lent to Priya S. · Jan 28</p>
              </div>
              <span className="rpd__amount">$25</span>
            </li>
          </ul>
        </div>

        <div className="rpd__panel" data-rpd-panel="2" hidden>
          <ul className="rpd__reviews">
            <li style={step(0)}>
              <span className="rpd__who">Maya R.</span>
              <span className="rpd__score">★★★★★</span>
              <p>
                Easel was in great shape and John met me halfway across town. Would rent
                again.
              </p>
            </li>
            <li style={step(1)}>
              <span className="rpd__who">Devon K.</span>
              <span className="rpd__score">★★★★☆</span>
              <p>
                Studio setup was exactly as pictured. Clear instructions for pickup and
                drop-off.
              </p>
            </li>
            <li style={step(2)}>
              <span className="rpd__who">Priya S.</span>
              <span className="rpd__score">★★★★★</span>
              <p>
                Quick replies and a fair price. Made borrowing the mower completely
                painless.
              </p>
            </li>
          </ul>
        </div>
      </div>

      <span className="rpd__tap" data-rpd-tap />
    </div>
  );
}

function Listings() {
  return (
    <div className="rld" aria-hidden="true">
      <div className="rld__fit">
        <div className="rld__canvas">
          <div className="rld__searchbar">
            <div className="rld__field">
              <span className="rld__query">Painting Equipment</span>
              <svg className="rld__clear" viewBox="0 0 9 9" width="9" height="9" focusable="false">
                <path d="M9 0 0 9M0 0l9 9" fill="none" stroke="#2B2B2B" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="rld__cancel">Cancel</span>
          </div>

          <div className="rld__stage is-intro" data-rld-stage>
            <article className="rld__card rld__card--best" style={step(0)}>
              <ul className="rld__tags">
                <li className="rld__tag rld__tag--match">Best Match</li>
                <li className="rld__tag rld__tag--near">Close By</li>
                <li className="rld__tag rld__tag--price">Best Price</li>
              </ul>
              <div className="rld__body">
                <div className="rld__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/rented-proto/easel.webp" width="203" height="203" alt="" loading="lazy" />
                </div>
                <div className="rld__copy">
                  <h3>Painting easel and stand</h3>
                  <p>
                    Sturdy beechwood easel that fits canvases up to 48&quot;. Adjustable
                    height, tilting top, and built-in brush tray. Folds flat for storage.
                    Perfect for weekend painters and art students.
                  </p>
                  <p className="rld__price">Daily : $12 / Weekly: $60</p>
                </div>
              </div>
            </article>

            <article className="rld__card" style={step(1)}>
              <div className="rld__body">
                <div className="rld__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/rented-proto/sprayer.webp" width="249" height="195" alt="" loading="lazy" />
                </div>
                <div className="rld__copy">
                  <h3>House Painting Equipment</h3>
                  <p>
                    High-output sprayer for walls, fences, decks, and ceilings. Handles
                    latex, oil-based paints, and stains with a smooth finish. Includes 25-ft
                    hose and adjustable tip.
                  </p>
                  <p className="rld__price">Daily : $15 / Weekly: $75</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

type Size = { w: number; h: number };

type Demo = {
  label: string;
  className: string;
  Canvas: () => ReactNode;
  mount: (root: Element) => () => void;
  /** The frame's size in the lightbox before it is scaled to fit. */
  size: Size;
  phoneSize?: Size;
};

/** Phones get the lightbox frame at the width of the screen, steps below. */
const PHONE_QUERY = "(max-width: 640px)";
const MAX_SCALE = 2;

const DEMOS: Demo[] = [
  {
    label: "Rented suggestion chips stacking in above the search field",
    className: "paper-cs__suggestions",
    Canvas: Suggestions,
    mount: mountSuggestionsDemo,
    size: { w: 352, h: 383 },
  },
  {
    label: "Rented profile tabs cycling through Listed, History, and Review",
    className: "paper-cs__profile-tabs",
    Canvas: ProfileTabs,
    mount: mountProfileTabsDemo,
    size: { w: 352, h: 383 },
  },
  {
    label: "Rented search results with product listings stacking into view",
    className: "paper-cs__shot--wide paper-cs__listings",
    Canvas: Listings,
    mount: mountListingsDemo,
    size: { w: 722, h: 640 },
    phoneSize: { w: 431, h: 600 },
  },
];

/** One demo in its frame, running for as long as it is mounted. */
function DemoFrame({
  demo,
  className = "",
  style,
  onOpen,
}: {
  demo: Demo;
  className?: string;
  style?: CSSProperties;
  onOpen?: (opener: HTMLElement) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { Canvas, mount } = demo;

  useEffect(() => {
    if (!ref.current) return;
    return mount(ref.current);
  }, [mount]);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!onOpen || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    onOpen(event.currentTarget);
  }

  return (
    <figure
      className={`paper-cs__shot ${demo.className} ${className}`.trim()}
      style={style}
      ref={ref}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `${demo.label} — enlarge` : demo.label}
      onClick={onOpen ? (event) => onOpen(event.currentTarget) : undefined}
      onKeyDown={onOpen ? onKeyDown : undefined}
    >
      <Canvas />
    </figure>
  );
}

/**
 * The enlarged copy. The demos are laid out in px, so rather than stretch the
 * frame (and leave the chips small inside it), the frame keeps its in-page
 * size and is scaled up as a whole to fit the screen.
 */
function EnlargedFrame({ demo }: { demo: Demo }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ size: Size; scale: number } | null>(null);

  useLayoutEffect(() => {
    const stage = ref.current?.parentElement;
    if (!stage) return;

    function measure() {
      const phone = window.matchMedia(PHONE_QUERY).matches;
      const size = (phone && demo.phoneSize) || demo.size;
      const room = phone ? window.innerHeight - 152 : window.innerHeight * 0.85;
      const scale = Math.min(stage!.clientWidth / size.w, room / size.h, MAX_SCALE);
      setFit({ size, scale });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [demo]);

  const size = fit?.size ?? demo.size;
  const scale = fit?.scale ?? 1;

  return (
    <div
      className="rented-lb lightbox-frame"
      ref={ref}
      style={{
        width: size.w * scale,
        height: size.h * scale,
        visibility: fit ? undefined : "hidden",
      }}
    >
      {fit && (
        <DemoFrame
          demo={demo}
          style={{ width: size.w, height: size.h, transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}

/**
 * The Research section's three self-running replicas of the Rented UI (a pair,
 * then one wide). Each opens in a lightbox that steps through all three.
 */
export default function RentedDemos() {
  const lightbox = useDemoLightbox(DEMOS.length);

  const frame = (order: number) => (
    <DemoFrame
      demo={DEMOS[order]}
      className="paper-cs__zoomable"
      onOpen={(el) => lightbox.open(order, el)}
    />
  );

  return (
    <>
      <div className="paper-cs__pair paper-cs__pair--demos">
        {frame(0)}
        {frame(1)}
      </div>

      {frame(2)}

      <DemoLightbox
        index={lightbox.index}
        count={DEMOS.length}
        noun="demo"
        onStep={lightbox.step}
        onClose={lightbox.close}
      >
        {lightbox.index !== null && (
          <EnlargedFrame key={lightbox.index} demo={DEMOS[lightbox.index]} />
        )}
      </DemoLightbox>
    </>
  );
}
