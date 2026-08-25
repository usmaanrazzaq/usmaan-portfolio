import { MEDIA_HEIGHT, MEDIA_WIDTH, type Project } from "@/data/projects";

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21.6 21.6" aria-hidden="true">
      <path
        d="M15.302 6.3L6.302 15.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.102 6.3L15.302 6.3V13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CaseMedia({ project }: { project: Project }) {
  const { media, caseHref, mediaLabel } = project;

  if (media.kind === "rented-showcase") {
    return (
      <a
        className="paper-home__case-media"
        href={caseHref}
        aria-label={mediaLabel}
        data-rp-embed="showcase"
      >
        {/* Replaced in place by the Rented prototype once its script mounts. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.fallbackSrc}
          width={MEDIA_WIDTH}
          height={MEDIA_HEIGHT}
          alt=""
          role="presentation"
          data-rp-fallback
        />
      </a>
    );
  }

  if (media.kind === "video") {
    return (
      <a className="paper-home__case-media" href={caseHref} aria-label={mediaLabel}>
        <span className="paper-home__case-stage">
          <video
            src={media.src}
            width={MEDIA_WIDTH}
            height={MEDIA_HEIGHT}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.poster}
            aria-label={media.label}
          />
        </span>
      </a>
    );
  }

  return (
    <a className="paper-home__case-media" href={caseHref} aria-label={mediaLabel}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.src}
        width={MEDIA_WIDTH}
        height={MEDIA_HEIGHT}
        alt={media.alt ?? ""}
        role={media.alt ? undefined : "presentation"}
        loading={media.lazy ? "lazy" : undefined}
      />
    </a>
  );
}

export default function CaseCard({ project }: { project: Project }) {
  return (
    <article
      className="paper-home__case flex items-start justify-between gap-5 to-lg:flex-col to-lg:justify-start"
      data-work={project.slug}
    >
      <div className="flex w-[min(100%,var(--home-copy))] shrink-0 flex-col items-start gap-2.5 to-lg:w-full">
        <div className="flex w-full items-baseline justify-between gap-4 to-sm:flex-col to-sm:items-start to-sm:gap-1">
          <h2 className="text-ink min-w-0 text-xl leading-[1.4] font-medium">
            <a className="text-inherit no-underline" href={project.caseHref}>
              {project.title}
            </a>
          </h2>
          <p className="text-muted shrink-0 text-sm leading-[1.4] font-normal whitespace-nowrap">
            {project.date}
          </p>
        </div>

        <h3 className="text-ink text-lg leading-[1.4] font-medium">
          <a className="text-inherit no-underline" href={project.caseHref}>
            {project.headline}
          </a>
        </h3>

        <p className="text-ink max-w-full text-base leading-[1.55] font-normal">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <a className="paper-home__cta" href={project.caseHref}>
            Read Case Study
            <ArrowIcon />
          </a>
          {project.siteHref && (
            <a
              className="paper-home__cta"
              href={project.siteHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Website
              <ArrowIcon />
            </a>
          )}
        </div>
      </div>

      <CaseMedia project={project} />
    </article>
  );
}
