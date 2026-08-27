import SiteChrome, { type NavTab } from "@/components/SiteChrome";

/**
 * The homepage frame: gutters, nav, and theme toggle. About reuses it with its
 * own section class and heading. Case study routes render their own paper-cs
 * chrome instead, which is why this is not in the root layout.
 */
export default function HomeShell({
  className,
  labelledBy = "home-title",
  current = "work",
  children,
}: {
  className?: string;
  labelledBy?: string;
  current?: NavTab;
  children: React.ReactNode;
}) {
  const base =
    "paper-home mx-auto w-[min(1512px,100%)] px-gutter pt-7 pb-20 font-sans text-base leading-[1.55] to-md:px-5 to-md:pt-5 to-md:pb-16";

  return (
    <section className={className ? `${base} ${className}` : base} aria-labelledby={labelledBy}>
      <SiteChrome current={current} />
      {children}
    </section>
  );
}
