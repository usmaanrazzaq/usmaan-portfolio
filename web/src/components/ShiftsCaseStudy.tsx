"use client";

import { useEffect, useRef } from "react";
import PaperCsChrome from "@/components/PaperCsChrome";
import ShiftsDemos from "@/components/ShiftsDemos";
import { initImageLightbox } from "@/lib/wcm/lightbox";

export default function ShiftsCaseStudy() {
  const rootRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !overlayRef.current) return;
    return initImageLightbox(rootRef.current, overlayRef.current);
  }, []);

  return (
    <>
      <PaperCsChrome className="paper-cs--shifts" ref={rootRef}>
        <header className="paper-cs__header">
          <h1 id="cs-title">Shifts Web App</h1>

          <dl className="paper-cs__meta">
            <div>
              <dt>Role</dt>
              <dd>Product Designer</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>Sept 2026 - Present</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>UI Design, Research</dd>
            </div>
            <div>
              <dt>Collaborators</dt>
              <dd>Backend Developers</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>Paper, Cursor, Claude Code, Vercel, Clerk</dd>
            </div>
          </dl>

          <p className="paper-cs__lede">
            Designing a simple and modern shifts management application for small to large scale
            teams.
          </p>
        </header>

        <section className="paper-cs__section" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Overview</h2>
          <div className="paper-cs__body">
            <p>
              Shifts is a web application designed and built to allow small and large teams to
              keep track of their teams shifts, assign team leads, add notes and instructions for
              their teams to follow. Shifts was designed to be simple and modern which makes it
              easy to use and easy to sign in to.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="outcome-heading">
          <h2 id="outcome-heading">Outcome</h2>
          <div className="paper-cs__body">
            <p>
              A small local nonprofit tested the prototype with their event security team over
              four days, scheduling about 15 members across 3 teams and creating 20 to 30 shifts.
              They liked how shift creation let them add a title, assign members, and use labels
              to filter and check coverage, with the properties panel giving a quick overview of
              each shift. Coverage became visible without a spreadsheet, which supported the core
              bet. The main gap was communication: they wanted to invite members and send shift
              notifications with instructions, which the prototype couldn&apos;t do yet. I logged
              bugs in Linear, shipped a notes field in the properties panel, and focused on design
              refinements and component fixes, while backlogging team invites and notifications
              for a future version.
            </p>
          </div>
        </section>

        <figure className="paper-cs__hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Shifts-Hero.webp"
            width="1444"
            height="976"
            alt="Shifts calendar showing team shifts across four days on a desktop monitor"
          />
        </figure>

        <section className="paper-cs__section" aria-labelledby="research-heading">
          <h2 id="research-heading">Research</h2>
          <div className="paper-cs__body">
            <p>
              Nonprofit-style shift work falls between two mismatched product categories: employee
              schedulers (When I Work, Deputy, Homebase, Connecteam, Sling, Shiftboard) built for
              paid hourly teams with per-user pricing, and volunteer tools (SignUpGenius, Better
              Impact, VolunteerHub, Volgistics, Bloomerang, WhenToHelp) strong on signups and CRM
              but weak on daily ops, with a true staff-and-volunteer hybrid calendar rare across
              both. Coordinators are largely stuck running schedules through spreadsheets and
              group texts, with no single view of who&apos;s working when, leading to double
              bookings, stale rosters, and understaffed days that go unnoticed. We framed the core
              failure as managers can&apos;t see staff coverage without a spreadsheet, which
              narrowed the September 18 prototype to one calendar plus a staff roster (cutting
              swaps, reminders, payroll, and mobile claim flows), and drew its UI direction from
              Linear and Notion rather than legacy scheduling software, aiming for a calendar that
              feels like a work OS. Building v0.01 validated that interaction shell (shift cards,
              side panel, labels, priority, notes) but showed shifts on days rather than people
              against coverage, with no staff rows, headcount, gap cues, or role field yet,
              pointing to the next research bet: making people, assignment, and coverage gaps
              first-class on the same surface.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="components-heading">
          <h2 id="components-heading">Components</h2>
        </section>

        <ShiftsDemos />
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="lightbox-img" className="lightbox-img" alt="" />
        </div>
      </div>
    </>
  );
}
