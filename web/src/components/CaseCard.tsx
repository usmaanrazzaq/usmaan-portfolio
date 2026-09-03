import type { AnchorHTMLAttributes, ReactNode } from "react";
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

function projectHref(project: Project) {
  return project.caseHref ?? project.siteHref;
}

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

function ProjectLink({
  href,
  className,
  ariaLabel,
  children,
  ...rest
}: {
  href: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "aria-label" | "children">) {
  const external = isExternalHref(href);
  return (
    <a
      className={className}
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

function CaseMedia({ project }: { project: Project }) {
  const { media, mediaLabel } = project;
  const href = projectHref(project);

  if (media.kind === "rented-showcase") {
    const image = (
      <>
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
      </>
    );

    if (!href) {
      return <div className="paper-home__case-media">{image}</div>;
    }

    return (
      <ProjectLink
        className="paper-home__case-media"
        href={href}
        ariaLabel={mediaLabel}
        data-rp-embed="showcase"
      >
        {image}
      </ProjectLink>
    );
  }

  if (media.kind === "video") {
    const video = (
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
    );

    if (!href) {
      return <div className="paper-home__case-media">{video}</div>;
    }

    return (
      <ProjectLink className="paper-home__case-media" href={href} ariaLabel={mediaLabel}>
        {video}
      </ProjectLink>
    );
  }

  const image = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.src}
        width={MEDIA_WIDTH}
        height={MEDIA_HEIGHT}
        alt={media.alt ?? ""}
        role={media.alt ? undefined : "presentation"}
        loading={media.lazy ? "lazy" : undefined}
      />
    </>
  );

  if (!href) {
    return <div className="paper-home__case-media">{image}</div>;
  }

  return (
    <ProjectLink className="paper-home__case-media" href={href} ariaLabel={mediaLabel}>
      {image}
    </ProjectLink>
  );
}

function TitleLink({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return children;
  return (
    <ProjectLink className="text-inherit no-underline" href={href}>
      {children}
    </ProjectLink>
  );
}

export default function CaseCard({ project }: { project: Project }) {
  const href = projectHref(project);

  return (
    <article
      className="paper-home__case flex items-start justify-between gap-5 to-lg:flex-col to-lg:justify-start"
      data-work={project.slug}
    >
      <div className="flex w-[min(100%,var(--home-copy))] shrink-0 flex-col items-start gap-2.5 to-lg:w-full">
        <div className="flex w-full items-baseline justify-between gap-4 to-sm:flex-col to-sm:items-start to-sm:gap-1">
          <h2 className="text-ink min-w-0 text-xl leading-[1.4] font-medium">
            <TitleLink href={href}>{project.title}</TitleLink>
          </h2>
          <p className="text-muted shrink-0 text-sm leading-[1.4] font-normal whitespace-nowrap">
            {project.date}
          </p>
        </div>

        <h3 className="text-ink text-lg leading-[1.4] font-medium">
          <TitleLink href={href}>{project.headline}</TitleLink>
        </h3>

        <p className="text-ink max-w-full text-base leading-[1.55] font-normal">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          {project.caseHref && (
            <a className="paper-home__cta" href={project.caseHref}>
              Read Case Study
              <ArrowIcon />
            </a>
          )}
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
