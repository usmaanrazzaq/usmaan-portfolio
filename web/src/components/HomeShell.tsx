import SiteChrome from "@/components/SiteChrome";

/**
 * The homepage frame: gutters, nav, and theme toggle. Case study routes render
 * their own paper-cs chrome instead, which is why this is not in the root
 * layout.
 */
export default function HomeShell({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="paper-home mx-auto w-[min(1512px,100%)] px-gutter pt-7 pb-20 font-sans text-base leading-[1.55] to-md:px-5 to-md:pt-5 to-md:pb-16"
      aria-labelledby="home-title"
    >
      <SiteChrome />
      {children}
    </section>
  );
}
