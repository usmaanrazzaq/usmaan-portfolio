"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  initChartScrollTriggers,
  initMetricUnderlineScrollTriggers,
} from "@/lib/rented/charts";
import { initChartLightbox } from "@/lib/rented/lightbox";
import {
  mountListingsDemo,
  mountProfileTabsDemo,
  mountSuggestionsDemo,
} from "@/lib/rented/demos";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** The demos read `--i` off each item to stagger the stack-load entrance. */
function step(index: number) {
  return { "--i": index } as CSSProperties;
}

declare global {
  interface Window {
    RentedPrototype?: { init: () => void };
  }
}

export default function RentedCaseStudy() {
  const rootRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLElement>(null);
  const profileTabsRef = useRef<HTMLElement>(null);
  const listingsRef = useRef<HTMLElement>(null);

  // The copied CSS keys the page background and the hidden static-site nav off
  // this class, exactly as body.paper-cs-route does on the live page.
  useEffect(() => {
    document.body.classList.add("paper-cs-route");
    return () => document.body.classList.remove("paper-cs-route");
  }, []);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      initChartScrollTriggers(rootRef.current);
      initMetricUnderlineScrollTriggers(rootRef.current);
    },
    { scope: rootRef },
  );

  useEffect(() => {
    if (!rootRef.current || !overlayRef.current) return;
    return initChartLightbox(rootRef.current, overlayRef.current);
  }, []);

  useEffect(() => {
    const teardowns = [
      suggestionsRef.current && mountSuggestionsDemo(suggestionsRef.current),
      profileTabsRef.current && mountProfileTabsDemo(profileTabsRef.current),
      listingsRef.current && mountListingsDemo(listingsRef.current),
    ];

    return () => teardowns.forEach((teardown) => teardown && teardown());
  }, []);

  // The prototype script is shared with the static site and mounts itself into
  // every [data-rp-embed]. This covers the case where it finished loading
  // before this route hydrated; init() skips hosts it has already filled.
  useEffect(() => {
    window.RentedPrototype?.init();
  }, []);

  return (
    <>
      <main className="paper-cs" aria-labelledby="cs-title" ref={rootRef}>
        {/* Not next/link: the prototype script mounts itself once per document
            load, so a client-side navigation would leave the homepage showcase
            sitting on its fallback image. */}
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

        <header className="paper-cs__header">
          <h1 id="cs-title">Rented</h1>

          <dl className="paper-cs__meta">
            <div>
              <dt>Role</dt>
              <dd>Product Designer</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>Nov 2024 - Feb 2025</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>Product Design, User Research, Prototyping</dd>
            </div>
            <div>
              <dt>Collaborators</dt>
              <dd>Software Engineers, Founders</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>Figma, Play</dd>
            </div>
          </dl>

          <p className="paper-cs__lede">
            Designing a peer-to-peer rental experience for urban renters
          </p>
        </header>

        <section className="paper-cs__section" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Overview</h2>
          <div className="paper-cs__body">
            <p>
              Most people own tools and gear they use once, then store forever. Rented lets
              neighbors lend and borrow instead. I served as sole designer across onboarding,
              browse, PDPs, and profiles, from November 2024 through engineering handoff in
              February 2025.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="outcome-heading">
          <h2 id="outcome-heading">Outcome</h2>
          <div className="paper-cs__body">
            <p>
              The redesign successfully validated key product assumptions before development.
              Across 2 rounds of moderated usability testing (7 sessions), participants completed{" "}
              <span className="paper-cs__metric">onboarding in under one minute</span>, while
              iterative improvements increased{" "}
              <span className="paper-cs__metric">
                first-task completion from 71% to 100%
              </span>{" "}
              between testing rounds. Introducing personalized recommendations also improved early
              product discovery, with{" "}
              <span className="paper-cs__metric">
                100% of returning participants engaging with the new Best Match section first
              </span>
              . The project concluded with a developer-ready handoff of{" "}
              <span className="paper-cs__metric">30+ high-fidelity screens</span>, annotated
              components, and an interactive prototype.
            </p>
          </div>
        </section>

        <div className="paper-cs__proto" data-rp-embed="full">
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/home-rented-showcase.webp"
              width="722"
              height="488"
              alt="Three Rented mobile screens for search, profile, and browse"
            />
          </noscript>
        </div>

        <div className="paper-cs__charts" aria-label="Usability testing outcome metrics">
          <div className="chart-card" data-chart="rented-task-completion">
            <svg
              className="line-chart"
              viewBox="0 0 520 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Chart showing first-task completion rising from 71 percent in Round 1 to 100 percent in Round 2"
            >
              <line x1="60" y1="40" x2="490" y2="40" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="110" x2="490" y2="110" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="180" x2="490" y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="250" x2="490" y2="250" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <text x="48" y="44" textAnchor="end" className="chart-label">100%</text>
              <text x="48" y="114" textAnchor="end" className="chart-label">75%</text>
              <text x="48" y="184" textAnchor="end" className="chart-label">50%</text>
              <text x="48" y="254" textAnchor="end" className="chart-label">0%</text>
              <defs>
                <linearGradient id="rentedTaskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A90D9" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4A90D9" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                className="chart-area"
                d="M80,101 L152,95 L224,88 L296,72 L368,55 L440,44 L490,40 L490,250 L80,250 Z"
                fill="url(#rentedTaskGradient)"
              />
              <polyline
                className="chart-line"
                points="80,101 152,95 224,88 296,72 368,55 440,44 490,40"
                stroke="#4A90D9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <g className="chart-dots">
                <circle cx="80" cy="101" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="152" cy="95" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="224" cy="88" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="296" cy="72" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="368" cy="55" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="440" cy="44" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="490" cy="40" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
              </g>
              <text x="80" y="278" textAnchor="middle" className="chart-label">R1</text>
              <text x="224" y="278" textAnchor="middle" className="chart-label">Iterate</text>
              <text x="368" y="278" textAnchor="middle" className="chart-label">R2</text>
              <text x="490" y="278" textAnchor="middle" className="chart-label">100%</text>
              <text x="275" y="308" textAnchor="middle" className="chart-caption">
                First-task completion (71% → 100%)
              </text>
            </svg>
          </div>

          <div className="chart-card" data-chart="rented-best-match">
            <svg
              className="line-chart"
              viewBox="0 0 520 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Chart showing 100 percent of returning participants engaging with Best Match first"
            >
              <line x1="60" y1="40" x2="490" y2="40" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="110" x2="490" y2="110" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="180" x2="490" y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="250" x2="490" y2="250" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <text x="48" y="44" textAnchor="end" className="chart-label">100%</text>
              <text x="48" y="114" textAnchor="end" className="chart-label">75%</text>
              <text x="48" y="184" textAnchor="end" className="chart-label">50%</text>
              <text x="48" y="254" textAnchor="end" className="chart-label">0%</text>
              <defs>
                <linearGradient id="rentedMatchGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5BA88C" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#5BA88C" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                className="chart-area"
                d="M80,248 L152,210 L224,155 L296,95 L368,55 L440,42 L490,40 L490,250 L80,250 Z"
                fill="url(#rentedMatchGradient)"
              />
              <polyline
                className="chart-line"
                points="80,248 152,210 224,155 296,95 368,55 440,42 490,40"
                stroke="#5BA88C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <g className="chart-dots">
                <circle cx="80" cy="248" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="152" cy="210" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="224" cy="155" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="296" cy="95" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="368" cy="55" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="440" cy="42" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="490" cy="40" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
              </g>
              <text x="80" y="278" textAnchor="middle" className="chart-label">Browse</text>
              <text x="224" y="278" textAnchor="middle" className="chart-label">Discover</text>
              <text x="368" y="278" textAnchor="middle" className="chart-label">Engage</text>
              <text x="490" y="278" textAnchor="middle" className="chart-label">100%</text>
              <text x="275" y="308" textAnchor="middle" className="chart-caption">
                Returning participants → Best Match first
              </text>
            </svg>
          </div>
        </div>

        <section className="paper-cs__section" aria-labelledby="problem-heading">
          <h2 id="problem-heading">Problem</h2>
          <div className="paper-cs__body">
            <p>
              Existing P2P rental apps get onboarding, role flexibility, and browsing wrong.
              Hygglo over-verifies, Craigslist under-verifies, no platform handles renter/lister
              duality, and browsing chaotic categories.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="research-heading">
          <h2 id="research-heading">Research</h2>
          <div className="paper-cs__body">
            <p>
              Two rounds of comparative sessions — Round 1 with 4 participants, Round 2 with 3 of
              the same on a revised prototype — walked users from familiar resale apps (eBay,
              Grailed, Depop) through competitors to an early Rented prototype. Three patterns
              held: minimal search won (Depop users cited its simplicity), role-switching was
              universal (every participant saw themselves as both lister and renter, yet every
              competitor forced one or the other), and long catalogs caused drop-off (users wanted
              “something at the top that’s actually for me”).
            </p>
          </div>
        </section>

        <div className="paper-cs__pair paper-cs__pair--demos">
          <figure
            className="paper-cs__shot paper-cs__suggestions"
            data-rsd
            aria-label="Rented suggestion chips stacking in above the search field"
            ref={suggestionsRef}
          >
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
          </figure>

          <figure
            className="paper-cs__shot paper-cs__profile-tabs"
            data-rpd
            aria-label="Rented profile tabs cycling through Listed, History, and Review"
            ref={profileTabsRef}
          >
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
          </figure>
        </div>

        <figure
          className="paper-cs__shot paper-cs__shot--wide paper-cs__listings"
          data-rld
          aria-label="Rented search results with product listings stacking into view"
          ref={listingsRef}
        >
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
        </figure>

        <section className="paper-cs__section" aria-labelledby="decisions-heading">
          <h2 id="decisions-heading">Design Decisions</h2>
          <div className="paper-cs__body">
            <p>
              Onboarding leads with SSO and a single category prompt, getting users browse-ready in
              under a minute with no verification wall, while profiles use a tabbed layout that
              treats renter and lister roles equally and surface trust signals right at the
              decision point on the PDP. Browse changed most between rounds — Round 2 added a “Best
              Match” section (driven by Round 1 drop-off, and the top engagement point in every
              session) and suggestion tags above search that outperformed direct text input.
              Filtering across mixed inventory, like a drill versus a tent, remained unresolved.
            </p>
          </div>
        </section>
      </main>

      <div
        className="lightbox-overlay"
        id="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged media"
        hidden
        ref={overlayRef}
      >
        <button type="button" className="lightbox-close" aria-label="Close lightbox" />
        <div className="lightbox-stage">
          <div id="lightbox-chart" className="lightbox-chart" aria-hidden="true" hidden />
        </div>
      </div>
    </>
  );
}
