"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PaperCsChrome from "@/components/PaperCsChrome";
import { initCarousel } from "@/lib/adsum/carousel";
import { initMediaLightbox } from "@/lib/adsum/lightbox";
import {
  initChartScrollTriggers,
  initMetricUnderlineScrollTriggers,
} from "@/lib/rented/charts";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const campaigns = [
  { src: "/images/Adsum-Campaign-Holiday-Shipping.webp", caption: "Holiday Shipping Guide" },
  { src: "/images/Adsum-Campaign-Boxing-Day.webp", caption: "Boxing Day Sale" },
  { src: "/images/Adsum-Campaign-Cyber-Monday.webp", caption: "Cyber Monday" },
  { src: "/images/Adsum-Campaign-Black-Friday.webp", caption: "Black Friday Sale" },
  { src: "/images/Adsum-Campaign-ELAC.webp", caption: "Adsum x ELAC" },
  { src: "/images/Adsum-Campaign-Workshop.webp", caption: "Workshop Scene" },
];

export default function AdsumCaseStudy() {
  const rootRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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
    return initMediaLightbox(rootRef.current, overlayRef.current);
  }, []);

  useEffect(() => {
    if (!carouselRef.current) return;
    return initCarousel(carouselRef.current);
  }, []);

  return (
    <>
      <PaperCsChrome className="paper-cs--adsum" ref={rootRef}>
        <header className="paper-cs__header">
          <h1 id="cs-title">Adsum NYC</h1>

          <dl className="paper-cs__meta">
            <div>
              <dt>Role</dt>
              <dd>Product Designer</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>Nov 2025 - Present</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>Product Design, Campaigns, Marketing</dd>
            </div>
            <div>
              <dt>Collaborators</dt>
              <dd>Brand Founder</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>Figma, Shopify, Cursor</dd>
            </div>
          </dl>

          <p className="paper-cs__lede">
            Brooklyn-based DTC clothing brand; sole designer working directly with the founder
          </p>
        </header>

        <section className="paper-cs__section" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Overview</h2>
          <div className="paper-cs__body">
            <p>
              Adsum is a Brooklyn, NY-based brand. I design landing pages for new collections,
              sales, and events on an ongoing timeline. Additionally, I assist with launching new
              campaigns and assist with outreach. I work closely with the brand&apos;s founder.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="outcome-heading">
          <h2 id="outcome-heading">Outcome</h2>
          <div className="paper-cs__body">
            <p>
              Working directly with the founder in Shopify, I design and ship collection pages on
              an ongoing cadence for a storefront serving{" "}
              <span className="paper-cs__metric">15K+ monthly active visitors</span> — supporting
              new releases, events, and seasonal sales. A size filter I built from scratch surfaces
              only in-stock sizes,{" "}
              <span className="paper-cs__metric">cutting clicks to sold-out variants by 35%</span>.
              I also restructured the product page, collapsing dense supporting details such as
              size charts, shipping, and returns into accordions to keep the description front and
              center and shorten the path to checkout. Beyond the site, I design email campaigns
              for launches and seasonal cycles, currently achieving a{" "}
              <span className="paper-cs__metric">43.8% open rate</span> against a{" "}
              <span className="paper-cs__metric">roughly 33% industry average</span>.
            </p>
          </div>
        </section>

        <figure className="paper-cs__hero">
          <video
            src="/video/Adsum-SS26-Vid.mov"
            width="1444"
            height="976"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Adsum Portugal Series landing page on a desktop display"
          />
        </figure>

        <section className="paper-cs__section" aria-labelledby="landing-heading">
          <h2 id="landing-heading">Landing Pages</h2>
          <div className="paper-cs__body">
            <p>
              I designed landing pages for the brand&apos;s new collections and releases, as well as
              for the holiday sale announcements. Each page is crafted to match the brand&apos;s
              visual identity while driving conversion.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="size-filter-heading">
          <h2 id="size-filter-heading">Size Filter</h2>
          <div className="paper-cs__body">
            <p>
              I built a size filter feature from scratch for the collection pages that surfaces
              only in-stock sizes, so customers see what&apos;s actually available instead of
              landing on sold-out options. It cut wasted clicks and helped shoppers find their size
              faster.
            </p>
          </div>
        </section>

        <figure className="paper-cs__shot paper-cs__shot--wide">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Adsum-Filter-Size-Display.webp?v=20260720-2238"
            width="1024"
            height="692"
            alt="Adsum collection page with size filter showing in-stock sizes"
            loading="lazy"
          />
        </figure>

        <div className="paper-cs__charts" aria-label="Size filter impact metrics">
          <div className="chart-card" data-chart="adsum-soldout-clicks">
            <svg
              className="line-chart"
              viewBox="0 0 520 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Chart showing a 35 percent reduction in clicks to sold-out variants after the size filter launched"
            >
              <line x1="60" y1="40" x2="490" y2="40" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="110" x2="490" y2="110" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="180" x2="490" y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="250" x2="490" y2="250" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <text x="48" y="44" textAnchor="end" className="chart-label">35%</text>
              <text x="48" y="114" textAnchor="end" className="chart-label">25%</text>
              <text x="48" y="184" textAnchor="end" className="chart-label">15%</text>
              <text x="48" y="254" textAnchor="end" className="chart-label">0%</text>
              <defs>
                <linearGradient id="adsumSoldoutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A90D9" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4A90D9" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                className="chart-area"
                d="M80,248 L152,236 L224,210 L296,168 L368,110 L440,62 L490,40 L490,250 L80,250 Z"
                fill="url(#adsumSoldoutGradient)"
              />
              <polyline
                className="chart-line"
                points="80,248 152,236 224,210 296,168 368,110 440,62 490,40"
                stroke="#4A90D9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <g className="chart-dots">
                <circle cx="80" cy="248" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="152" cy="236" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="224" cy="210" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="296" cy="168" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="368" cy="110" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="440" cy="62" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="490" cy="40" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
              </g>
              <text x="80" y="278" textAnchor="middle" className="chart-label">Launch</text>
              <text x="224" y="278" textAnchor="middle" className="chart-label">Wk 2</text>
              <text x="368" y="278" textAnchor="middle" className="chart-label">Wk 4</text>
              <text x="490" y="278" textAnchor="middle" className="chart-label">Wk 6</text>
              <text x="275" y="308" textAnchor="middle" className="chart-caption">
                Reduction in clicks to sold-out variants
              </text>
            </svg>
          </div>
          <div className="chart-card" data-chart="adsum-sizes-hidden">
            <svg
              className="line-chart"
              viewBox="0 0 520 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Chart showing sold-out sizes hidden from the filter reaching 100 percent coverage across collection pages"
            >
              <line x1="60" y1="40" x2="490" y2="40" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="110" x2="490" y2="110" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="180" x2="490" y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="60" y1="250" x2="490" y2="250" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
              <text x="48" y="44" textAnchor="end" className="chart-label">100%</text>
              <text x="48" y="114" textAnchor="end" className="chart-label">70%</text>
              <text x="48" y="184" textAnchor="end" className="chart-label">40%</text>
              <text x="48" y="254" textAnchor="end" className="chart-label">0%</text>
              <defs>
                <linearGradient id="adsumHiddenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5BA88C" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#5BA88C" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                className="chart-area"
                d="M80,248 L152,220 L224,160 L296,95 L368,55 L440,42 L490,40 L490,250 L80,250 Z"
                fill="url(#adsumHiddenGradient)"
              />
              <polyline
                className="chart-line"
                points="80,248 152,220 224,160 296,95 368,55 440,42 490,40"
                stroke="#5BA88C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <g className="chart-dots">
                <circle cx="80" cy="248" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="152" cy="220" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="224" cy="160" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="296" cy="95" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="368" cy="55" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="440" cy="42" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="490" cy="40" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
              </g>
              <text x="80" y="278" textAnchor="middle" className="chart-label">Launch</text>
              <text x="224" y="278" textAnchor="middle" className="chart-label">Wk 2</text>
              <text x="368" y="278" textAnchor="middle" className="chart-label">Wk 4</text>
              <text x="490" y="278" textAnchor="middle" className="chart-label">Wk 6</text>
              <text x="275" y="308" textAnchor="middle" className="chart-caption">
                Sold-out sizes hidden from filter
              </text>
            </svg>
          </div>
        </div>

        <section className="paper-cs__section" aria-labelledby="additional-heading">
          <h2 id="additional-heading">Additional Work</h2>
          <div className="paper-cs__body">
            <p>
              Beyond web design, I have created graphic designs for the brand&apos;s email
              announcements — including Black Friday and Cyber Monday campaigns — and assist with
              ongoing marketing outreach and social media content.
            </p>
          </div>
        </section>

        <div
          className="paper-cs__carousel"
          data-carousel=""
          aria-label="Campaign graphics carousel"
          ref={carouselRef}
        >
          <div className="paper-cs__carousel-viewport">
            <div className="paper-cs__carousel-track">
              {campaigns.map((campaign) => (
                <figure className="paper-cs__carousel-slide" key={campaign.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={campaign.src}
                    width="720"
                    height="900"
                    alt={`${campaign.caption} campaign graphic`}
                    loading="lazy"
                  />
                  <figcaption>{campaign.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="paper-cs__carousel-controls">
            <button
              type="button"
              className="paper-cs__carousel-btn"
              data-carousel-prev=""
              aria-label="Previous campaign"
            >
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
            </button>
            <div className="paper-cs__carousel-dots" aria-label="Campaign navigation" />
            <button
              type="button"
              className="paper-cs__carousel-btn"
              data-carousel-next=""
              aria-label="Next campaign"
            >
              <svg width="18" height="18" viewBox="0 0 21.6 21.6" aria-hidden="true">
                <path
                  d="M9 5.4L14.4 10.8 9 16.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </PaperCsChrome>

      <div
        className="lightbox-overlay lightbox-overlay--adsum"
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
