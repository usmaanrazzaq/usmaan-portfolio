"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Public Web3Forms key, same one the static site ships in its markup. */
const ACCESS_KEY = "dc134a61-3136-4985-a5f9-c0f336201417";
const SUBJECT = "New contact from your portfolio";
const CLOSE_DURATION = 220;

const CONTACT_PATHS = ["/contact/", "/contact", "/Contact/", "/Contact"];

const OPEN_SELECTOR =
  '[data-contact-open], a[href="/contact/"], a[href="/contact"], a[href="/Contact/"], a[href="/Contact"]';

function isContactPath(path: string) {
  return CONTACT_PATHS.includes(path);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Status = { message: string; type: "error" | "success" } | null;

export default function ContactModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const openedViaRouteRef = useRef(false);
  const previousTitleRef = useRef("");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // History, title, and focus are side effects, so they cannot live inside a
  // state updater — React re-runs those, which double-pushed the route.
  const isOpenRef = useRef(false);

  const open = useCallback((options: { pushState?: boolean; fromRoute?: boolean } = {}) => {
    if (isOpenRef.current) return;
    isOpenRef.current = true;

    lastFocusRef.current = document.activeElement as HTMLElement | null;
    openedViaRouteRef.current = Boolean(options.fromRoute);
    previousTitleRef.current = document.title;
    document.title = "Contact | Usmaan Razzaq";

    if (options.pushState && !isContactPath(window.location.pathname)) {
      // Raw history, not the Next router: /contact/ is an overlay on the page
      // it was opened from, so re-rendering the route would restart the page.
      // The opener rides along in history state so closing returns to it —
      // /about/ stays /about/, the way the static site restores it.
      window.history.pushState(
        { contactModal: true, restorePath: window.location.pathname },
        "",
        "/contact/",
      );
      openedViaRouteRef.current = true;
    }

    setIsMounted(true);
    // The dialog has to be painted in its closed state for one frame, otherwise
    // React commits `hidden` and `is-open` together and the transition is skipped.
    requestAnimationFrame(() => requestAnimationFrame(() => setIsOpen(true)));
  }, []);

  const close = useCallback((options: { restoreHistory?: boolean } = {}) => {
    if (!isOpenRef.current) return;
    isOpenRef.current = false;

    const shouldRestoreHistory = options.restoreHistory !== false && openedViaRouteRef.current;
    if (shouldRestoreHistory && isContactPath(window.location.pathname)) {
      // A deep link to /contact/ renders the homepage, so that is the fallback.
      const state = window.history.state as { restorePath?: string } | null;
      window.history.replaceState({}, "", state?.restorePath ?? "/");
    }
    openedViaRouteRef.current = false;

    if (previousTitleRef.current) {
      document.title = previousTitleRef.current;
      previousTitleRef.current = "";
    }

    lastFocusRef.current?.focus?.();
    lastFocusRef.current = null;

    setIsOpen(false);
  }, []);

  /* Unmount after the close transition, matching the original 220ms. */
  useEffect(() => {
    if (isOpen || !isMounted) return;

    const finish = () => {
      setIsMounted(false);
      setStatus(null);
      formRef.current?.reset();
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    closeTimerRef.current = setTimeout(finish, CLOSE_DURATION);
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [isOpen, isMounted]);

  /* Body scroll lock and initial focus. */
  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add("contact-modal-open");
    const focusTimer = setTimeout(() => firstFieldRef.current?.focus(), 40);

    return () => {
      document.body.classList.remove("contact-modal-open");
      clearTimeout(focusTimer);
    };
  }, [isOpen]);

  /*
   * Keeps the dialog inside the visible viewport when the soft keyboard opens.
   * Layout viewport units do not shrink with the keyboard on iOS; visualViewport does.
   */
  useEffect(() => {
    if (!isOpen) return;

    const viewport = window.visualViewport;

    const sync = () => {
      const modal = modalRef.current;
      if (!modal) return;

      if (!viewport) {
        modal.classList.toggle("is-compact", window.innerHeight <= 560);
        return;
      }

      modal.style.top = `${Math.max(0, viewport.offsetTop || 0)}px`;
      modal.style.left = `${Math.max(0, viewport.offsetLeft || 0)}px`;
      modal.style.right = "auto";
      modal.style.bottom = "auto";
      modal.style.width = `${Math.max(0, viewport.width)}px`;
      modal.style.height = `${Math.max(0, viewport.height)}px`;
      modal.classList.toggle("is-compact", viewport.height <= 560);

      const active = document.activeElement as HTMLElement | null;
      if (active && modal.contains(active) && active.matches("input, textarea, button")) {
        active.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    };

    sync();
    viewport?.addEventListener("resize", sync);
    viewport?.addEventListener("scroll", sync);

    return () => {
      viewport?.removeEventListener("resize", sync);
      viewport?.removeEventListener("scroll", sync);
    };
  }, [isOpen]);

  /* Global open/close triggers, mirroring the delegation in the static site's main.js. */
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>(OPEN_SELECTOR);
      if (trigger) {
        // Modified clicks and new tabs keep their default navigation.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (trigger.getAttribute("target") === "_blank") return;
        event.preventDefault();
        open({ pushState: true });
        return;
      }

      if (target?.closest("[data-contact-close]")) close();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !isOpenRef.current) return;
      event.preventDefault();
      close();
    }

    function onPopState() {
      if (isContactPath(window.location.pathname)) open({ fromRoute: true });
      else close({ restoreHistory: false });
    }

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
    };
  }, [open, close]);

  /* Deep link: /contact/ renders the homepage with the modal already open. */
  useEffect(() => {
    if (isContactPath(window.location.pathname)) open({ fromRoute: true });
  }, [open]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (data.get("botcheck")) return;

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus({ message: "Please fill out all fields.", type: "error" });
      return;
    }

    setStatus(null);
    setIsSending(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: SUBJECT,
          name,
          email,
          message,
          from_name: name,
        }),
      });

      const result = await response.json();
      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Something went wrong.");
      }

      form.reset();
      setStatus({ message: "Thanks — I'll get back to you soon.", type: "success" });
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : "Unable to send. Please try again.",
        type: "error",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div
      ref={modalRef}
      className={`contact-modal${isOpen ? " is-open" : ""}`}
      id="contact-modal"
      hidden={!isMounted}
      aria-hidden={!isOpen}
    >
      <div className="contact-modal__backdrop" data-contact-close tabIndex={-1} />
      <div
        className="contact-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        tabIndex={-1}
      >
        <h2 id="contact-modal-title" className="contact-modal__title">
          Have a project in mind? Lets work together
        </h2>
        <p className="contact-modal__lede">
          Helping startups and businesses design, build, and refine digital experiences through
          product design, web development, and consulting.
        </p>

        <form ref={formRef} className="contact-modal__form" noValidate onSubmit={onSubmit}>
          <input
            type="checkbox"
            name="botcheck"
            className="contact-modal__honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <label className="sr-only" htmlFor="contact-modal-name">
            Full Name
          </label>
          <input
            ref={firstFieldRef}
            id="contact-modal-name"
            type="text"
            name="name"
            className="contact-modal__input"
            placeholder="Full Name"
            autoComplete="name"
            required
          />

          <label className="sr-only" htmlFor="contact-modal-email">
            Email
          </label>
          <input
            id="contact-modal-email"
            type="email"
            name="email"
            className="contact-modal__input"
            placeholder="Email"
            autoComplete="email"
            required
          />

          <label className="sr-only" htmlFor="contact-modal-message">
            Message
          </label>
          <textarea
            id="contact-modal-message"
            name="message"
            className="contact-modal__textarea"
            placeholder="Message"
            required
          />

          <button type="submit" className="contact-modal__submit" disabled={isSending}>
            {isSending ? "Sending…" : "Submit"}
          </button>
          <p
            className={`contact-modal__status${status ? ` is-${status.type}` : ""}`}
            role="status"
            aria-live="polite"
            hidden={!status}
          >
            {status?.message ?? ""}
          </p>
        </form>
      </div>
    </div>
  );
}
