/**
 * The Playground page body, ported from pages/playground.html in the static
 * site. The chrome comes from HomeShell, so this is the hidden heading and the
 * project list only.
 */
export default function PlaygroundContent() {
  return (
    <>
      <h1 id="playground-title" className="sr-only">
        Playground
      </h1>

      <div className="paper-projects__list">
        <article className="paper-projects__item">
          <figure className="paper-projects__media paper-projects__media--phone">
            {/* Native video, like the case study heroes: the .mov is synced
                from the static site and plays as its own loop. */}
            <video
              src="/video/Goodreads-Genre-Selection.mov"
              width={1152}
              height={1152}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/goodreads-genre-onboarding.webp"
              aria-label="GoodReads genre onboarding prototype showing circular genre categories on a mobile screen"
            />
          </figure>
          <div className="paper-projects__meta">
            <h2 className="paper-projects__title">GoodReads Genre Onboarding Prototype</h2>
            <p className="paper-projects__type">Personal Project</p>
          </div>
          <p className="paper-projects__desc">
            Redesigned and prototyped a cleaner and updated genre selection onboarding page for
            GoodReads.
          </p>
        </article>

        <article className="paper-projects__item">
          <figure className="paper-projects__media">
            {/* Not next/image: a fixed-size asset synced from the static site. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/claude-code-sidebar.webp"
              width={1444}
              height={976}
              alt="Claude Code sidebar redesign showing search, new session, routines, skills, connectors, and project sessions"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="paper-projects__meta">
            <h2 className="paper-projects__title">Claude Code Sidebar Redesign</h2>
            <p className="paper-projects__type">Personal Project</p>
          </div>
          <p className="paper-projects__desc">
            A more polished and align approach to the current sidebar in Claude Code.
          </p>
        </article>
      </div>
    </>
  );
}
