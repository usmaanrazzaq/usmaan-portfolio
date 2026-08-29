/**
 * The About page body, ported from pages/about.html in the static site. The
 * chrome comes from HomeShell, so this is the hidden heading, the photo, the
 * bio, and the experience list only.
 */

/** Same links, titles, and dates the static page ships. */
const JOBS = [
  {
    company: "Adsum NYC",
    href: "/adsum/",
    dates: "Nov 2025 - Present",
    role: "Product Designer",
  },
  {
    company: "On The Run Studio",
    href: "/on-the-run-studio/on-the-run-studio/otrs-case-study",
    dates: "Mar 2021 - Aug 2026",
    role: "Founder & Designer",
  },
  {
    company: "Rented",
    href: "/rented/rented/",
    dates: "Nov 2024 - Feb 2025",
    role: "Product Designer",
  },
  {
    company: "National Muslim Youth Association",
    href: "/national-muslim-youth-association/muslim-youth-website/case-study",
    dates: "Nov 2023 - Nov 2025",
    role: "Lead UI Designer",
  },
];

export default function AboutContent() {
  return (
    <>
      <h1 id="about-title" className="sr-only">
        About
      </h1>

      <div className="paper-about__layout">
        <figure className="paper-about__photo home-enter [--enter-delay:60ms]">
          {/* Not next/image: a fixed-size asset synced from the static site. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/About-Page-IMG.webp"
            width={2144}
            height={1268}
            alt="Usmaan sitting on a rock in a forest"
            loading="eager"
            decoding="async"
          />
        </figure>

        <div className="paper-about__content home-enter [--enter-delay:140ms]">
          <div className="paper-about__bio">
            <p>
              {"I'm Usmaan, a Product Designer and Front-End Developer based in Queens, NY. I'm passionate about designing intuitive, user-centered experiences that solve real problems and feel natural to use. I studied Multimedia Programming and Web Design at Borough of Manhattan Community College, where I built a foundation that bridges design and code. I continuously sharpen my front-end skills through platforms like Scrimba. At the core of my work is a belief that great design isn't just about how something looks, but how it works and how it makes people feel."}
            </p>
            <p>
              {"I wouldn't be who I am without the inspiration of minds and creators like Dieter Rams, Ludwig Mies Van Der Rohe, John Pawson, Donald Judd, Jony Ive, Dr. Abdus Salam, Anthony Bourdain, Jan Tschichold, Massimo Vignelli, Marcel Breuer, Alvar Aalto, Peter Märkli, and many more. Their work, ideas, and spirit have shaped the way I see the world — teaching me that design, culture, and curiosity are all part of the same pursuit of meaning."}
            </p>
          </div>

          <section className="paper-about__experience" aria-labelledby="experience-heading">
            <h2 id="experience-heading">Experience</h2>

            <ul className="paper-about__jobs">
              {JOBS.map((job) => (
                <li className="paper-about__job" key={job.company}>
                  <div className="paper-about__job-top">
                    {/* Plain anchors, like the case study links elsewhere: the
                        Rented prototype script mounts once per document load. */}
                    <a className="paper-about__company" href={job.href}>
                      {job.company}
                    </a>
                    <span className="paper-about__dates">{job.dates}</span>
                  </div>
                  <p className="paper-about__role">{job.role}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
