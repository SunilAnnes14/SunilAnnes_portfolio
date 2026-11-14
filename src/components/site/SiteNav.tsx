import Link from "next/link";
import { profile } from "@/content/portfolio";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-800/70 bg-[#08090a]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${profile.name}, home`}>
          <span className="grid h-8 w-8 place-items-center rounded border border-amber-300/40 bg-amber-300/10 font-display text-sm text-amber-200">
            {profile.initials}
          </span>
          <span className="hidden font-display tracking-wider text-stone-100 sm:inline">{profile.name}</span>
        </Link>
        <ul className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-stone-400 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition hover:text-stone-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <Link
          href="/interview"
          className="rounded-md border border-red-400/40 bg-gradient-to-b from-[#5a1a16] to-[#2a0b09] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-red-100 shadow-[0_0_20px_rgba(200,40,30,0.25)] transition hover:brightness-125"
        >
          Play the interview
        </Link>
      </nav>
    </header>
  );
}
