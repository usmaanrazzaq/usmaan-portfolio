"use client";

import { useEffect, useRef } from "react";
import PaperCsChrome from "@/components/PaperCsChrome";
import { initImageLightbox } from "@/lib/wcm/lightbox";

export default function WcmCaseStudy() {
  const rootRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !overlayRef.current) return;
    return initImageLightbox(rootRef.current, overlayRef.current);
  }, []);

  return (
    <>
      <PaperCsChrome className="paper-cs--wcm" ref={rootRef}>
        <header className="paper-cs__header">
          <h1 id="cs-title">WCM Connect App</h1>

          <dl className="paper-cs__meta">
            <div>
              <dt>Role</dt>
              <dd>Product Designer</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>Personal Project</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>UI Design, Research</dd>
            </div>
            <div>
              <dt>Collaborators</dt>
              <dd>Independent</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>Figma</dd>
            </div>
          </dl>

          <p className="paper-cs__lede">
            A self-initiated concept redesign — reworking an existing patient app&apos;s
            onboarding, dashboard, and scheduling from its public App Store reviews.
          </p>
        </header>

        <section className="paper-cs__section" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Overview</h2>
          <div className="paper-cs__body">
            <p>
              Healthcare apps should help patients feel informed and in control—not
              overwhelmed. Reviewing WCM Connect&apos;s App Store reviews revealed recurring
              complaints around authentication friction, confusing navigation, and difficulty
              accessing health information. Rather than a full redesign, I focused on the
              moments that shape a patient&apos;s first impression and everyday experience—using
              interaction design, clearer information hierarchy, and better system feedback to
              reduce friction throughout the journey.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="outcome-heading">
          <h2 id="outcome-heading">Outcome</h2>
          <div className="paper-cs__body">
            <p>
              This redesign explored how thoughtful UX can make healthcare feel more
              approachable, focusing on improving the experience patients already rely on rather
              than adding new features. Simplifying onboarding, reorganizing the dashboard around
              high-priority tasks, and streamlining appointment scheduling reduced friction,
              while clearer visual hierarchy and consistent system feedback made the experience
              more intuitive and reassuring.
            </p>
            <p>
              The project reinforced that healthcare design is about reducing uncertainty, not
              just clean interfaces—patients often engage during stressful, time-sensitive
              moments, where clarity and trust matter as much as functionality. It also
              strengthened my ability to translate qualitative feedback into product decisions
              that balance user needs, accessibility, and business constraints.
            </p>
          </div>
        </section>

        <figure className="paper-cs__hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home-wcm-showcase.webp?v=20260720-2144"
            width="906"
            height="612"
            alt="Three WCM Connect mobile screens for splash, login, and dashboard"
          />
        </figure>

        <section className="paper-cs__section" aria-labelledby="problem-heading">
          <h2 id="problem-heading">Problem</h2>
          <div className="paper-cs__body">
            <p>
              Patients rely on WCM Connect to manage appointments, medications, and communicate
              with their care team, yet many reported struggling with basic tasks. App Store
              review analysis surfaced three consistent themes: authentication friction, with
              repeated login issues, confusing verification flows, and unclear error messages;
              difficult navigation, with medications, appointments, and messages requiring too
              many steps to reach; and limited feedback, leaving users uncertain whether their
              actions had actually completed.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="research-heading">
          <h2 id="research-heading">Research &amp; Direction</h2>
          <div className="paper-cs__body">
            <p>
              I began with publicly available App Store reviews rather than assumptions. Login
              failures, password reset frustration, confusing onboarding, slow appointment
              access, difficult messaging, and unclear dashboard organization showed where
              patients struggled most—shaping three redesign goals: simplify onboarding without
              sacrificing trust, improve dashboard usability so key information is immediate, and
              make scheduling easier end to end. Three principles guided every screen: clarity
              over complexity (one primary action per view), accessible healthcare (type,
              spacing, and contrast for all ages and technical comfort), and building confidence
              through clear system feedback.
            </p>
          </div>
        </section>

        <figure className="paper-cs__shot paper-cs__shot--wide">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/WCM-Main-Display.webp?v=20260720-2200"
            width="1024"
            height="694"
            alt="WCM Connect medication details and appointment scheduling screens"
            loading="lazy"
          />
        </figure>

        <section className="paper-cs__section" aria-labelledby="solutions-heading">
          <h2 id="solutions-heading">Solutions</h2>
          <div className="paper-cs__body">
            <p>
              The redesign focused on three high-impact areas of the patient experience:
              onboarding, with simplified authentication, clearer hierarchy, and improved system
              feedback to reduce first-time friction; the dashboard, reorganized around
              patients&apos; most common tasks so appointments, medications, and test results are
              easier to access; and appointment scheduling, streamlined with a clearer
              step-by-step flow, simplified provider selection, and more reassuring confirmation
              states.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="accessibility-heading">
          <h2 id="accessibility-heading">Accessibility</h2>
          <div className="paper-cs__body">
            <p>
              Healthcare products serve users with a wide range of technical abilities. The
              redesign emphasizes larger touch targets, improved typography hierarchy, higher
              color contrast, clearer labels, reduced cognitive load, and consistent spacing
              throughout the interface.
            </p>
          </div>
        </section>

        <section className="paper-cs__section" aria-labelledby="systems-heading">
          <h2 id="systems-heading">Design Systems</h2>
          <div className="paper-cs__body">
            <p>
              To maintain consistency, I established a small component system including buttons,
              form fields, cards, status indicators, navigation components, appointment cards,
              and message previews—improving scalability for future product development.
            </p>
          </div>
        </section>

        <div className="paper-cs__pair paper-cs__pair--components">
          <figure className="paper-cs__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/WCM-Dashboard-Card.webp?v=20260720-2215"
              width="1024"
              height="640"
              alt="WCM Connect upcoming appointment card component"
              loading="lazy"
            />
          </figure>
          <figure className="paper-cs__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/WCM-Appointment-Components.webp?v=20260720-2215"
              width="1024"
              height="640"
              alt="WCM Connect date and time picker component"
              loading="lazy"
            />
          </figure>
        </div>

        <div className="paper-cs__pair paper-cs__pair--components">
          <figure className="paper-cs__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/WCM-Navigation-Components.webp?v=20260720-2215"
              width="1024"
              height="640"
              alt="WCM Connect quick action pills and bottom navigation bar"
              loading="lazy"
            />
          </figure>
          <figure className="paper-cs__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/WCM-Meds-Component.webp?v=20260720-2215"
              width="1024"
              height="640"
              alt="WCM Connect medication details card component"
              loading="lazy"
            />
          </figure>
        </div>
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
