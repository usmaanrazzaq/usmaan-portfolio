/**
 * Plain text links, as the hero frame draws them — the brand glyphs and the
 * per-brand glow that keyed off each aria-label are gone with them.
 */
const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/usmaan-razzaq-9886511b1/" },
  { label: "Instagram", href: "https://www.instagram.com/usmaanrzqdesign" },
  { label: "GitHub", href: "https://github.com/usmaanrazzaq" },
  { label: "X (Twitter)", href: "https://x.com/usmaanrzq" },
  { label: "Resume", href: "/Usmaan-Razzaq-Resume.pdf?v=20260823-2000" },
  { label: "Are.na", href: "https://www.are.na/usmaan-r/channels" },
] as const;

export default function Socials({ className }: { className?: string }) {
  const base = "paper-home__socials relative flex flex-wrap gap-x-5 gap-y-2 self-stretch";

  return (
    <nav className={className ? `${base} ${className}` : base} aria-label="Social links">
      {SOCIALS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink text-sm leading-[1.4] font-normal"
        >
          {social.label}
        </a>
      ))}
    </nav>
  );
}
