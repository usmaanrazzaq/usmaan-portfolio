"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PaperCsChrome from "@/components/PaperCsChrome";
import { initMediaLightbox } from "@/lib/nmya/lightbox";
import { initResearchFindings } from "@/lib/nmya/research-findings";
import {
  initChartScrollTriggers,
  initMetricUnderlineScrollTriggers,
} from "@/lib/rented/charts";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function NmyaCaseStudy() {
  const rootRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      initChartScrollTriggers(rootRef.current);
      initMetricUnderlineScrollTriggers(rootRef.current);
      initResearchFindings(rootRef.current);
    },
    { scope: rootRef },
  );

  useEffect(() => {
    if (!rootRef.current || !overlayRef.current) return;
    return initMediaLightbox(rootRef.current, overlayRef.current);
  }, []);

  return (
    <>
      <PaperCsChrome className="paper-cs--nmya" ref={rootRef}>
        <header className="paper-cs__header">
          <h1 id="cs-title">National Muslim Youth Association</h1>

          <dl className="paper-cs__meta">
            <div>
              <dt>Role</dt>
              <dd>UI Designer, Project Manager</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>Nov 2023 - Nov 2025</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>UI/UX Design, Project Management, User Research</dd>
            </div>
            <div>
              <dt>Collaborators</dt>
              <dd>Stakeholders</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>Figma, Webflow</dd>
            </div>
          </dl>

          <p className="paper-cs__lede">
            Redesigning a non-profit site to better serve Muslim youth.
          </p>
        </header>

        <section className="paper-cs__section" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Overview</h2>
          <div className="paper-cs__body">
            <p>
              The National Muslim Youth Association is a non-profit whose site hosts religious
              teachings, event materials, and program resources for youth members nationally. I was
              brought on to maintain the site, but after finding cluttered navigation, outdated
              content, and active malware, I proposed and led a full redesign instead.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="outcome-heading">
          <h2 id="outcome-heading">Outcome</h2>
          <div className="paper-cs__body">
            <p>
              The redesigned site launched June 2024 on Webflow, migrating off a WordPress install
              plagued by malware, broken plugins, and scattered account access — resolving the
              vulnerability cycle that had repeatedly taken the site offline. Within months,{" "}
              <span className="paper-cs__metric">traffic rose 30%</span>,{" "}
              <span className="paper-cs__metric">returning visitors grew 10-15%</span>, and{" "}
              <span className="paper-cs__metric">page views rose 15%</span> (vs. the WordPress
              baseline via Webflow analytics), driven mainly by a navigation redesign that{" "}
              <span className="paper-cs__metric">
                cut critical-page access from 5-6 clicks to 2-3
              </span>
              . My time with NMYA concluded in November 2025.
            </p>
          </div>
        </section>

        <figure className="paper-cs__hero">
          <video
            src="/video/NMYA-Colored-Vid.mov"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/home-nmya-showcase.webp"
            aria-label="National Muslim Youth Association website showcase"
          />
        </figure>

        <div className="paper-cs__charts" aria-label="Post-launch growth charts">
          <div className="chart-card" data-chart="nmya-visitors">
            <svg
              className="line-chart"
              viewBox="0 0 520 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Chart showing returning visitors growing 10 to 15 percent and page views increasing 15 percent after launch"
            >
              <line x1="60" y1="40" x2="490" y2="40" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="60" y1="110" x2="490" y2="110" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="60" y1="180" x2="490" y2="180" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="60" y1="250" x2="490" y2="250" stroke="#e5e5e5" strokeWidth="1" />
              <text x="48" y="44" textAnchor="end" className="chart-label">+15%</text>
              <text x="48" y="114" textAnchor="end" className="chart-label">+10%</text>
              <text x="48" y="184" textAnchor="end" className="chart-label">+5%</text>
              <text x="48" y="254" textAnchor="end" className="chart-label">0%</text>
              <defs>
                <linearGradient id="chartGradientViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A90D9" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4A90D9" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="chartGradientVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5BA88C" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#5BA88C" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                className="chart-area"
                d="M80,236 L152,215 L224,187 L296,152 L368,110 L440,68 L490,40 L490,250 L80,250 Z"
                fill="url(#chartGradientViews)"
              />
              <path
                className="chart-area"
                d="M80,243 L152,229 L224,208 L296,180 L368,145 L440,110 L490,82 L490,250 L80,250 Z"
                fill="url(#chartGradientVisitors)"
              />
              <polyline
                className="chart-line"
                points="80,243 152,229 224,208 296,180 368,145 440,110 490,82"
                stroke="#5BA88C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <polyline
                className="chart-line"
                points="80,236 152,215 224,187 296,152 368,110 440,68 490,40"
                stroke="#4A90D9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <g className="chart-dots">
                <circle cx="80" cy="243" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="152" cy="229" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="224" cy="208" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="296" cy="180" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="368" cy="145" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="440" cy="110" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
                <circle cx="490" cy="82" r="4.5" fill="#fff" stroke="#5BA88C" strokeWidth="2" />
              </g>
              <g className="chart-dots">
                <circle cx="80" cy="236" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="152" cy="215" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="224" cy="187" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="296" cy="152" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="368" cy="110" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="440" cy="68" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="490" cy="40" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
              </g>
              <line x1="84" y1="56" x2="106" y2="56" stroke="#4A90D9" strokeWidth="2.5" strokeLinecap="round" />
              <text x="112" y="60" className="chart-label">Page views</text>
              <line x1="84" y1="76" x2="106" y2="76" stroke="#5BA88C" strokeWidth="2.5" strokeLinecap="round" />
              <text x="112" y="80" className="chart-label">Returning visitors</text>
              <text x="80" y="278" textAnchor="middle" className="chart-label">Jan</text>
              <text x="152" y="278" textAnchor="middle" className="chart-label">Mar</text>
              <text x="224" y="278" textAnchor="middle" className="chart-label">May</text>
              <text x="296" y="278" textAnchor="middle" className="chart-label">Jul</text>
              <text x="368" y="278" textAnchor="middle" className="chart-label">Sep</text>
              <text x="440" y="278" textAnchor="middle" className="chart-label">Nov</text>
              <text x="490" y="278" textAnchor="middle" className="chart-label">Dec</text>
              <text x="275" y="308" textAnchor="middle" className="chart-caption">
                Returning visitors &amp; page views post-launch (2024)
              </text>
            </svg>
          </div>

          <div className="chart-card" data-chart="nmya-engagement">
            <svg
              className="line-chart"
              viewBox="0 0 520 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Engagement growth chart showing 35% increase after website redesign launch"
            >
              <line x1="60" y1="40" x2="490" y2="40" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="60" y1="110" x2="490" y2="110" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="60" y1="180" x2="490" y2="180" stroke="#e5e5e5" strokeWidth="1" />
              <line x1="60" y1="250" x2="490" y2="250" stroke="#e5e5e5" strokeWidth="1" />
              <text x="48" y="44" textAnchor="end" className="chart-label">+35%</text>
              <text x="48" y="114" textAnchor="end" className="chart-label">+25%</text>
              <text x="48" y="184" textAnchor="end" className="chart-label">+15%</text>
              <text x="48" y="254" textAnchor="end" className="chart-label">0%</text>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A90D9" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4A90D9" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                className="chart-area"
                d="M80,240 L152,230 L224,205 L296,170 L368,110 L440,62 L490,48 L490,250 L80,250 Z"
                fill="url(#chartGradient)"
              />
              <polyline
                className="chart-line"
                points="80,240 152,230 224,205 296,170 368,110 440,62 490,48"
                stroke="#4A90D9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <g className="chart-dots">
                <circle cx="80" cy="240" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="152" cy="230" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="224" cy="205" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="296" cy="170" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="368" cy="110" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="440" cy="62" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
                <circle cx="490" cy="48" r="4.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" />
              </g>
              <text x="80" y="278" textAnchor="middle" className="chart-label">Jan</text>
              <text x="152" y="278" textAnchor="middle" className="chart-label">Mar</text>
              <text x="224" y="278" textAnchor="middle" className="chart-label">May</text>
              <text x="296" y="278" textAnchor="middle" className="chart-label">Jul</text>
              <text x="368" y="278" textAnchor="middle" className="chart-label">Sep</text>
              <text x="440" y="278" textAnchor="middle" className="chart-label">Nov</text>
              <text x="490" y="278" textAnchor="middle" className="chart-label">Dec</text>
              <text x="275" y="308" textAnchor="middle" className="chart-caption">
                Engagement growth post-launch (2024)
              </text>
            </svg>
          </div>
        </div>

        <div className="paper-cs__pair">
          <figure className="paper-cs__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nmya-al-bashir-detail.png"
              width="352"
              height="239"
              alt="Al-Bashir Magazine page with issue covers and View actions"
              loading="lazy"
            />
          </figure>
          <figure className="paper-cs__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nmya-search-detail.png"
              width="352"
              height="239"
              alt="Search bar and Quick Links section on the redesigned site"
              loading="lazy"
            />
          </figure>
        </div>

        <section className="paper-cs__section" aria-labelledby="problem-heading">
          <h2 id="problem-heading">Problem</h2>
          <div className="paper-cs__body">
            <p>
              Years of content updates without structural cleanup left the site hard to navigate.
              Parents couldn&apos;t find teaching materials. Youth skipped the site entirely. The
              WordPress build had malware issues that made maintenance risky. The site needed to be
              rebuilt from the ground up — new platform, new IA, new design system.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="research-heading">
          <h2 id="research-heading">User Research</h2>
          <div className="paper-cs__body">
            <p>
              Alongside development, I ran small focus groups on an early prototype to understand
              how users navigated and interacted with the new site, and to compare their behavior
              against the old one.
            </p>
          </div>
        </section>

        <div className="paper-cs__findings" data-research-findings>
          <div className="research-findings__intro">
            <span className="research-findings__eyebrow">Research insight map</span>
            <p>
              Research groups revealed three recurring friction points: people needed clearer paths
              to updates, easier access to materials, and a mobile experience that felt more
              engaging.
            </p>
          </div>

          <div className="research-findings__map" aria-label="User research findings by audience group">
            <section className="research-findings__group" aria-labelledby="research-parents">
              <div className="research-findings__group-header">
                <span className="research-findings__group-index">01</span>
                <h3 className="research-findings__group-name" id="research-parents">
                  Parents
                </h3>
              </div>
              <div className="research-findings__rows">
                <div className="research-findings__row">
                  <span className="research-findings__label">Event announcements</span>
                  <p className="research-findings__desc">
                    Parents found it difficult to stay up to date with events happening at their
                    local mosque.
                  </p>
                </div>
                <div className="research-findings__row">
                  <span className="research-findings__label">Navigating the website</span>
                  <p className="research-findings__desc">
                    Many parents had limited technology experience, making page navigation feel
                    unclear.
                  </p>
                </div>
                <div className="research-findings__row">
                  <span className="research-findings__label">Essential materials</span>
                  <p className="research-findings__desc">
                    Important resources were difficult to find and access from the old website
                    structure.
                  </p>
                </div>
              </div>
            </section>

            <section className="research-findings__group" aria-labelledby="research-teachers">
              <div className="research-findings__group-header">
                <span className="research-findings__group-index">02</span>
                <h3 className="research-findings__group-name" id="research-teachers">
                  Teachers
                </h3>
              </div>
              <div className="research-findings__rows">
                <div className="research-findings__row">
                  <span className="research-findings__label">Teaching materials</span>
                  <p className="research-findings__desc">
                    Teachers needed a faster way to locate presentations and class resources.
                  </p>
                </div>
                <div className="research-findings__row">
                  <span className="research-findings__label">Class data entry</span>
                  <p className="research-findings__desc">
                    Inputting class data into national spreadsheets was difficult alongside lesson
                    prep.
                  </p>
                </div>
                <div className="research-findings__row">
                  <span className="research-findings__label">Navigation</span>
                  <p className="research-findings__desc">
                    Teachers also ran into the same navigation issues parents experienced.
                  </p>
                </div>
              </div>
            </section>

            <section className="research-findings__group" aria-labelledby="research-youth">
              <div className="research-findings__group-header">
                <span className="research-findings__group-index">03</span>
                <h3 className="research-findings__group-name" id="research-youth">
                  Youth
                </h3>
              </div>
              <div className="research-findings__rows">
                <div className="research-findings__row">
                  <span className="research-findings__label">Engagement</span>
                  <p className="research-findings__desc">
                    Youth visitors did not find the old website exciting enough to return often.
                  </p>
                </div>
                <div className="research-findings__row">
                  <span className="research-findings__label">Mobile access</span>
                  <p className="research-findings__desc">
                    Many accessed the website on mobile, where key materials were harder to reach.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="research-findings__connector" aria-hidden="true" />

          <div className="research-findings__response">
            <span className="research-findings__response-label">Design response</span>
            <div
              className="research-findings__chips"
              aria-label="Design responses informed by user research"
            >
              <span className="research-findings__chip">Clearer event pathways</span>
              <span className="research-findings__chip">Simplified navigation</span>
              <span className="research-findings__chip">Mobile-first access</span>
              <span className="research-findings__chip">More engaging content</span>
            </div>
          </div>
        </div>

        <div className="paper-cs__pair">
          <figure className="paper-cs__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nmya-new-home-detail.png"
              width="352"
              height="238"
              alt="Redesigned National Muslim Youth Association homepage with Friday Sermon hero"
              loading="lazy"
            />
          </figure>
          <figure className="paper-cs__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nmya-old-home-detail.png"
              width="352"
              height="222"
              alt="Previous National Muslim Youth Association homepage before the redesign"
              loading="lazy"
            />
          </figure>
        </div>

        <section className="paper-cs__section" aria-labelledby="wireframe-heading">
          <h2 id="wireframe-heading">Wireframe &amp; Development</h2>
          <div className="paper-cs__body">
            <p>
              I built wireframes addressing the major pain points users faced, and once the board
              approved them, developed the site on Webflow — incorporating the organization&apos;s
              logo colors and assets, introducing additional interface colors, and prioritizing
              accessibility across screen sizes, especially mobile and tablet.
            </p>
          </div>
        </section>
      </PaperCsChrome>

      <div
        className="lightbox-overlay lightbox-overlay--nmya"
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
