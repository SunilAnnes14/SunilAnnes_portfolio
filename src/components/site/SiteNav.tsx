import Link from "next/link";
import { profile } from "@/content/portfolio";
import { CommandPalette } from "./fx/CommandPalette";
import { FxButton } from "./fx/FxButton";
import { NavLinks, type NavItem } from "./fx/NavLinks";
import { ScrollProgress } from "./fx/ScrollProgress";

const LINKS: NavItem[] = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Timeline" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-800/70 bg-[#08090a]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5 rounded outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80" aria-label={`${profile.name}, home`}>
          <span className="grid h-8 w-8 place-items-center rounded border border-amber-300/40 bg-amber-300/10 font-display text-sm text-amber-200 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            {profile.initials}
          </span>
          <span className="hidden font-display tracking-wider text-stone-100 sm:inline">{profile.name}</span>
        </Link>
        <NavLinks links={LINKS} />
        <div className="flex items-center gap-2">
          <CommandPalette />
          <FxButton href="/interview" variant="danger" size="sm">
            Play the interview
          </FxButton>
        </div>
      </nav>
      <ScrollProgress />
    </header>
  );
}
