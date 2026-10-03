"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  initChartScrollTriggers,
  initMetricUnderlineScrollTriggers,
} from "@/lib/rented/charts";
import { initChartLightbox } from "@/lib/rented/lightbox";
import PaperCsChrome from "@/components/PaperCsChrome";
import RentedDemos from "@/components/RentedDemos";

gsap.registerPlugin(useGSAP, ScrollTrigger);

declare global {
  interface Window {
    RentedPrototype?: { init: () => void };
  }
}

const DIRECTORY = [
  { id: "overview-heading", label: "Overview" },
  { id: "outcome-heading", label: "Outcome" },
  { id: "problem-heading", label: "Problem" },
  { id: "research-heading", label: "Research" },
  { id: "decisions-heading", label: "Design Decisions" },
];

export default function RentedCaseStudy() {
  const rootRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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

  // The prototype script is shared with the static site and mounts itself into
  // every [data-rp-embed]. This covers the case where it finished loading
  // before this route hydrated; init() skips hosts it has already filled.
  useEffect(() => {
    window.RentedPrototype?.init();
  }, []);

  return (
    <>
      <PaperCsChrome ref={rootRef} directory={DIRECTORY}>
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

        <RentedDemos />

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
      </PaperCsChrome>

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
