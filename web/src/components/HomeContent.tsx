import { Fragment } from "react";
import CaseCard from "@/components/CaseCard";
import LiveStatus from "@/components/LiveStatus";
import Socials from "@/components/Socials";
import WorkStack from "@/components/WorkStack";
import { projects } from "@/data/projects";

/**
 * Shared by / and /contact/ — the contact route is the same page with the modal
 * opened over it, which is how the static site behaves.
 */
export default function HomeContent() {
  return (
    <>
      <div className="mt-10 flex w-[min(100%,var(--home-copy))] flex-col items-start px-2.5 to-md:mt-7 to-md:w-full to-md:px-0">
        <h1 id="home-title" className="sr-only">
          Usmaan Razzaq
        </h1>

        <LiveStatus />

        <p className="text-ink max-w-full text-base leading-[1.55] font-normal">
          {"I'm Usmaan, a product designer based in New York, NY. I own the process end-to-end — research, design, and shipped code — as the sole designer working directly with engineers and founders, across consumer products, non-profits, and e-commerce."}
        </p>

        <Socials />
      </div>

      <hr className="bg-divider mt-5 h-px w-full border-0 to-md:mt-7" />

      <section className="scroll-mt-6" id="work" aria-label="Selected work">
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
