import CaseCard from "@/components/CaseCard";
import HomeChat from "@/components/HomeChat";
import WorkSection from "@/components/WorkSection";
import { projects } from "@/data/projects";

/** Runs while the parser is still above `#work`. A reload or back/forward
 *  restore of `/#work` is stripped so the hero is not skipped; a fresh
 *  navigation (shared link, bookmark, modifier-click new tab) keeps the hash
 *  and lands on the work stack. */
const STRIP_WORK_HASH_SCRIPT = `(function () {
  if (location.hash !== '#work') return;
  var entry = performance.getEntriesByType('navigation')[0];
  var type = entry && entry.type;
  if (type !== 'reload' && type !== 'back_forward') return;
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

      <HomeChat />

      <WorkSection
        works={projects.map(({ slug, title, shortTitle }) => ({ slug, title, shortTitle }))}
      >
        {projects.map((project) => (
          <CaseCard key={project.slug} project={project} />
        ))}
      </WorkSection>
    </>
  );
}
