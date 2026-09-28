"use client";

import { useEffect, useRef } from "react";
import PaperCsChrome from "@/components/PaperCsChrome";
import { initImageLightbox } from "@/lib/wcm/lightbox";

const componentShots = [
  [
    { src: "/images/Shifts-Create-Team.webp", alt: "Shifts create a new team dialog" },
    { src: "/images/Shifts-Day-Column.webp", alt: "Shifts day column with shift cards" },
  ],
  [
    { src: "/images/Shifts-Properties-Panel.webp", alt: "Shifts shift properties side panel" },
    { src: "/images/Shifts-Team-Menu.webp", alt: "Shifts team actions menu" },
  ],
];

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
              Market gap. Nonprofit-style shift work falls between two product categories.
              Employee schedulers (When I Work, Deputy, Homebase, Connecteam, Sling, Shiftboard)
              are built for paid hourly teams: strong on open shifts, swaps, and labor cost,
              priced per user. Volunteer tools (SignUpGenius, Better Impact, VolunteerHub,
              Volgistics, Bloomerang, WhenToHelp) are strong on signups and hours/CRM but weak on
              daily ops. A real hybrid, staff and volunteers on one operational calendar, is rare.
              On price, both sides squeeze small orgs: per-seat fees, per-volunteer growth taxes,
              and reminders/SMS paywalled behind free ad-supported tiers.
            </p>
            <p>
              Coordinator pain. Most coordinators run schedules through spreadsheets and group
              texts, with no single view of who&apos;s working when. That leads to double
              bookings, stale rosters, and understaffed days that go unnoticed. No-shows/backfill
              are a known pain point industry-wide, but we deprioritized them for this prototype
              to focus on the more foundational problem first.
            </p>
            <p>
              Scope decision. Core failure we designed around: managers can&apos;t see staff
              coverage without a spreadsheet. That narrowed the Sept 18 prototype to one calendar
              plus staff roster, not full workforce management, not volunteer-first. Swaps,
              reminders, payroll, and mobile claim flows were explicitly cut.
            </p>
            <p>
              Design references. Instead of benchmarking scheduling software, we studied Linear
              (dense lists, side-peek detail, quiet status, hairline structure) and Notion (one
              dataset, multiple views, chips/properties, calm neutrals). North star: a calendar
              that feels like a work OS, not a digitized timesheet.
            </p>
            <p>
              What v0.01 showed. The day-column shift-card interaction shell worked well:
              creation, side panel, labels, priority, notes, delete. But the board shows shifts on
              days, not people against coverage. There are no staff rows, no headcount, no gap
              cues, no role field, and the roster still lives separately under Teams. Takeaway:
              the shell is right; the next research bet is making people, assignment, and coverage
              gaps first-class on the same surface.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="components-heading">
          <h2 id="components-heading">Components</h2>
        </section>

        {componentShots.map((row, i) => (
          <div className="paper-cs__pair paper-cs__pair--components" key={i}>
            {row.map((shot) => (
              <figure className="paper-cs__shot" key={shot.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.src}
                  width="1600"
                  height="1200"
                  alt={shot.alt}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        ))}

        <figure className="paper-cs__shot paper-cs__shot--full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Shifts-New-Shift.webp"
            width="1600"
            height="1200"
            alt="Shifts new shift dialog with title, times, priority, members, and labels"
            loading="lazy"
          />
        </figure>
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
