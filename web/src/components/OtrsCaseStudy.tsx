"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PaperCsChrome from "@/components/PaperCsChrome";
import { initGlobeReachScrollTriggers } from "@/lib/otrs/globe";
import { initMediaLightbox } from "@/lib/otrs/lightbox";
import {
  initChartScrollTriggers,
  initMetricUnderlineScrollTriggers,
} from "@/lib/rented/charts";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function OtrsCaseStudy() {
  const rootRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      initChartScrollTriggers(rootRef.current);
      initMetricUnderlineScrollTriggers(rootRef.current);
      initGlobeReachScrollTriggers(rootRef.current);
    },
    { scope: rootRef },
  );

  useEffect(() => {
    if (!rootRef.current || !overlayRef.current) return;
    return initMediaLightbox(rootRef.current, overlayRef.current);
  }, []);

  return (
    <>
      <PaperCsChrome className="paper-cs--otrs" ref={rootRef}>
        <header className="paper-cs__header">
          <h1 id="cs-title">On The Run Studio</h1>

          <dl className="paper-cs__meta">
            <div>
              <dt>Role</dt>
              <dd>Founder &amp; Designer</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>Mar 2021 - Aug 2026</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>Product Design, Front-End Development</dd>
            </div>
            <div>
              <dt>Platform</dt>
              <dd>Vercel</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>Figma, Cursor</dd>
            </div>
          </dl>

          <p className="paper-cs__lede">Creating a brand and a Design Studio</p>
        </header>

        <section className="paper-cs__section" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Overview</h2>
          <div className="paper-cs__body">
            <p>
              On The Run Studio is a design studio that began as a personal project to curate and
              share images that inspired me and my work. Over time, the page grew and built a
              community of like-minded individuals who found inspiration in the posts. Along the
              way, I designed and produced products and merchandise inspired by these influences.
              On The Run Studio continues to share, inspire, and grow the community while
              connecting with brands and companies to assist in web design and development.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="outcome-heading">
          <h2 id="outcome-heading">Outcome</h2>
          <div className="paper-cs__body">
            <p>
              What started in March 2021 as a personal moodboard grew into a{" "}
              <span className="paper-cs__metric">
                community of 5,000 followers within a year and a half
              </span>
              . That growth extended beyond the page — limited-run merchandise I designed{" "}
              <span className="paper-cs__metric">
                sold to community members as far as France, Spain, and the U.K.
              </span>
              , signaling reach well beyond a local audience. Rebuilding across Shopify,
              Squarespace, and Framer gave me firsthand fluency in the platforms brands actually
              use, turning On The Run Studio into the foundation for the full-service agency I run
              today, partnering with brands from concept through launch and maintenance.
            </p>
          </div>
        </section>

        <figure className="paper-cs__hero">
          <video
            src="/video/OTRS-Desktop-Display.mov"
            width="906"
            height="612"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="On The Run Studio website showcase"
          />
        </figure>

        <div className="paper-cs__charts" aria-label="Community growth and merchandise reach">
          <div className="chart-card" data-chart="otrs-followers">
            <svg
              className="line-chart"
              viewBox="0 0 520 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Chart showing Instagram followers growing from 50 to 5,000 over 18 months"
            >
              <line x1="60" y1="40" x2="490" y2="40" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="110" x2="490" y2="110" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="180" x2="490" y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="250" x2="490" y2="250" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <text x="48" y="44" textAnchor="end" className="chart-label">5K</text>
              <text x="48" y="114" textAnchor="end" className="chart-label">2.5K</text>
              <text x="48" y="184" textAnchor="end" className="chart-label">1K</text>
              <text x="48" y="254" textAnchor="end" className="chart-label">50</text>
              <defs>
                <linearGradient id="otrsChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A90D9" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4A90D9" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                className="chart-area"
                d="M80,248 L152,245 L224,235 L296,212 L368,166 L440,90 L490,40 L490,250 L80,250 Z"
                fill="url(#otrsChartGradient)"
              />
              <polyline
                className="chart-line"
                points="80,248 152,245 224,235 296,212 368,166 440,90 490,40"
                stroke="#4A90D9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <g className="chart-dots">
                <circle cx="80" cy="248" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="152" cy="245" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="224" cy="235" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="296" cy="212" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="368" cy="166" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="440" cy="90" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="490" cy="40" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
              </g>
              <text x="80" y="278" textAnchor="middle" className="chart-label">Mar &apos;21</text>
              <text x="217" y="278" textAnchor="middle" className="chart-label">Sep &apos;21</text>
              <text x="354" y="278" textAnchor="middle" className="chart-label">Mar &apos;22</text>
              <text x="490" y="278" textAnchor="middle" className="chart-label">Sep &apos;22</text>
              <text x="275" y="308" textAnchor="middle" className="chart-caption">
                Instagram followers growth (Mar 2021 – Sep 2022)
              </text>
            </svg>
          </div>

          <div className="globe-card" data-globe-reach="otrs">
            <svg
              className="globe-map"
              viewBox="0 0 520 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Globe showing merchandise reach from New York to the United Kingdom, France, and Spain"
            >
              <g className="globe-sphere">
                <circle className="globe-outline" cx="260" cy="152" r="96" stroke="#dcdcdc" strokeWidth="1.5" fill="#fcfcfc" />
                <ellipse className="globe-latitude" cx="260" cy="152" rx="96" ry="30" stroke="#ededed" strokeWidth="1" />
                <ellipse className="globe-latitude" cx="260" cy="152" rx="96" ry="62" stroke="#ededed" strokeWidth="1" />
                <ellipse className="globe-longitude" cx="260" cy="152" rx="40" ry="96" stroke="#ededed" strokeWidth="1" />
                <ellipse className="globe-longitude" cx="260" cy="152" rx="72" ry="96" stroke="#ededed" strokeWidth="1" />
                <line className="globe-longitude" x1="260" y1="56" x2="260" y2="248" stroke="#ededed" strokeWidth="1" />
                <path
                  className="globe-land"
                  d="M172,124 C179,118 189,116 197,118 C205,119 210,121 215,127 C219,132 217,140 214,147 C212,153 210,159 206,163 C205,167 206,173 203,178 C201,182 198,179 198,173 C195,176 192,171 190,175 C188,182 186,190 183,195 C181,199 179,195 180,189 C181,182 178,175 174,169 C169,161 166,153 167,144 C168,135 169,129 172,124 Z"
                  fill="#e9e9e9"
                />
                <path
                  className="globe-land"
                  d="M232,110 C238,108 242,112 240,117 C238,122 232,121 230,116 C229,112 232,110 232,110 Z"
                  fill="#e9e9e9"
                />
                <path
                  className="globe-land"
                  d="M330,109 C337,110 336,118 340,124 C345,129 346,137 340,141 C336,143 333,140 330,143 C327,147 324,146 321,150 C318,154 320,160 315,161 C310,162 311,155 312,151 C310,148 312,143 317,142 C314,139 315,133 319,130 C322,125 324,117 328,112 C329,110 330,109 330,109 Z"
                  fill="#e9e9e9"
                />
                <path
                  className="globe-land"
                  d="M336,146 C339,147 340,152 338,156 C337,159 335,158 335,154 C334,150 334,147 336,146 Z"
                  fill="#e9e9e9"
                />
                <path
                  className="globe-land"
                  d="M304,116 C308,113 313,116 311,121 C310,127 303,126 301,122 C300,118 304,116 304,116 Z"
                  fill="#e9e9e9"
                />
                <path
                  className="globe-land"
                  d="M326,159 C338,156 350,159 352,166 C353,172 345,177 335,175 C327,173 322,166 326,161 Z"
                  fill="#e9e9e9"
                />
              </g>
              <g className="globe-arcs" stroke="#4A90D9" strokeWidth="1.4" fill="none" strokeLinecap="round">
                <path className="globe-arc" d="M206,150 Q258,88 316,122" />
                <path className="globe-arc" d="M206,150 Q264,92 328,138" />
                <path className="globe-arc" d="M206,150 Q256,104 314,154" />
              </g>
              <g className="globe-markers">
                <g className="globe-marker globe-marker--origin">
                  <circle className="globe-marker-pulse" cx="206" cy="150" r="6" stroke="#4A90D9" strokeWidth="1.5" fill="none" />
                  <circle className="globe-marker-dot" cx="206" cy="150" r="6" fill="#4A90D9" />
                  <text x="206" y="171" textAnchor="middle" className="globe-label globe-label--origin">
                    New York
                  </text>
                </g>
                <g className="globe-marker globe-marker--dest">
                  <line className="globe-leader" x1="320" y1="122" x2="372" y2="118" stroke="#d6d6d6" strokeWidth="1" />
                  <circle className="globe-marker-pulse" cx="316" cy="122" r="4.5" stroke="#4A90D9" strokeWidth="1.5" fill="none" />
                  <circle className="globe-marker-dot" cx="316" cy="122" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                  <text x="378" y="122" textAnchor="start" className="globe-label">U.K.</text>
                </g>
                <g className="globe-marker globe-marker--dest">
                  <line className="globe-leader" x1="332" y1="138" x2="372" y2="141" stroke="#d6d6d6" strokeWidth="1" />
                  <circle className="globe-marker-pulse" cx="328" cy="138" r="4.5" stroke="#4A90D9" strokeWidth="1.5" fill="none" />
                  <circle className="globe-marker-dot" cx="328" cy="138" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                  <text x="378" y="145" textAnchor="start" className="globe-label">France</text>
                </g>
                <g className="globe-marker globe-marker--dest">
                  <line className="globe-leader" x1="318" y1="154" x2="372" y2="164" stroke="#d6d6d6" strokeWidth="1" />
                  <circle className="globe-marker-pulse" cx="314" cy="154" r="4.5" stroke="#4A90D9" strokeWidth="1.5" fill="none" />
                  <circle className="globe-marker-dot" cx="314" cy="154" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                  <text x="378" y="168" textAnchor="start" className="globe-label">Spain</text>
                </g>
              </g>
              <text x="260" y="298" textAnchor="middle" className="chart-caption">
                Merchandise reach beyond New York
              </text>
            </svg>
          </div>
        </div>

        <section className="paper-cs__section" aria-labelledby="merchandise-heading">
          <h2 id="merchandise-heading">Merchandise</h2>
          <div className="paper-cs__body">
            <p>
              For 2 and a half years, I designed and produced merchandise inspired by my upbringing
              and the images I had curated. I started off with a t-shirt and a mug. For the
              t-shirt, I created a design that was simple and clean — the graphic was inspired by
              the Unisphere in Flushing, NY. For the mug, I placed the early On The Run Studio logo
              on the front.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="studio-heading">
          <h2 id="studio-heading">Design Studio</h2>
          <div className="paper-cs__body">
            <p>
              On The Run Studio is continuing as a design agency to assist brands and companies to
              strategically design and develop their websites. The agency provides a full-service
              design and development solution, from initial design to launch and ongoing
              maintenance.
            </p>
          </div>
        </section>

        <figure className="paper-cs__shot paper-cs__shot--wide">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/OTRS-Mobile-UI.webp"
            width="3300"
            height="1728"
            alt="On The Run Studio homepage and About pages on two mobile phones"
            loading="lazy"
          />
        </figure>
      </PaperCsChrome>

      <div
        className="lightbox-overlay lightbox-overlay--otrs"
        id="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged media"
        hidden
        ref={overlayRef}
      >
        <button type="button" className="lightbox-close" aria-label="Close lightbox" />
        <div className="lightbox-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="lightbox-img" className="lightbox-img" alt="" />
          <div id="lightbox-chart" className="lightbox-chart" aria-hidden="true" hidden />
        </div>
      </div>
    </>
  );
}
