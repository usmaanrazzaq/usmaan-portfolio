import { Fragment } from "react";
import CaseCard from "@/components/CaseCard";
import HomeHero from "@/components/HomeHero";
import ScrollCue from "@/components/ScrollCue";
import WorkStack from "@/components/WorkStack";
import { projects } from "@/data/projects";

/** Runs while the parser is still above `#work`, so a restored `/#work` cannot
 *  scroll the page before the hero exists. */
const STRIP_WORK_HASH_SCRIPT = `(function () {
  if (location.hash !== '#work') return;
  history.replaceState(null, '', location.pathname + location.search);
  window.scrollTo(0, 0);
})();`;

/**
 * Shared by / and /contact/ — the contact route is the same page with the modal
 * opened over it, which is how the static site behaves.
 */
export default function HomeContent() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: STRIP_WORK_HASH_SCRIPT }} />

      <HomeHero />

      <ScrollCue />

      <section className="mt-[100px] scroll-mt-6 to-md:mt-16" id="work" aria-label="Selected work">
        <WorkStack>
          {projects.map((project, index) => (
            <Fragment key={project.slug}>
              {index > 0 && <hr className="bg-divider my-10 h-px w-full border-0" />}
              <CaseCard project={project} />
            </Fragment>
          ))}
        </WorkStack>
      </section>
    </>
  );
}
