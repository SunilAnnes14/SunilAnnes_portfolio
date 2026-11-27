import { experience, profile, skills } from "@/content/portfolio";
import { shellProjects } from "@/content/projectHighlights";
import { ProjectsSection } from "@/components/site/projects/ProjectsSection";
import { AboutSection } from "@/components/site/about/AboutSection";
import { BackToTop } from "@/components/site/fx/BackToTop";
import { CopyEmail } from "@/components/site/fx/CopyEmail";
import { FxButton } from "@/components/site/fx/FxButton";
import { HeroGlow } from "@/components/site/fx/HeroGlow";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/fx/Reveal";
import { Timeline } from "@/components/site/fx/Timeline";
import { HeroVisual } from "@/components/site/HeroVisual";
import { RoleTicker } from "@/components/site/RoleTicker";
import { SiteNav } from "@/components/site/SiteNav";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-amber-300/90">{children}</p>;
}

function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div id={id} className="mb-8 scroll-mt-24">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-2 font-display text-3xl text-stone-100 sm:text-4xl">{title}</h2>
      </Reveal>
    </div>
  );
}

const FEATURE_FACTS = [
  { k: "1 or 3 rounds", v: "Quick unlocks everything in one win; Full goes round by round" },
  { k: "7 items", v: "Debugger, Hotfix, Friday Deploy and friends" },
  { k: "~2 min", v: "a full run, with a 30-second tutorial" },
];

const ENGINEERING = [
  "Pure TypeScript rules engine: a deterministic reducer with a seeded RNG, no React inside.",
  "Recruiter AI reasons from public shell counts plus what it privately knows, and gets sharper each round.",
  "2,000-game balance simulation in the test suite keeps the odds fair.",
  "Real-time 3D with React Three Fiber, procedural models, and a lightweight 2D mode for slower devices.",
];

const linkClass = "rounded underline-offset-4 outline-none transition-colors hover:text-stone-100 hover:underline focus-visible:ring-2 focus-visible:ring-amber-300/80";

export default function Home() {
  return (
    <div className="min-h-dvh bg-[#08090a] text-stone-200">
      <SiteNav />

      <main>
        {/* hero */}
        <section className="relative overflow-hidden border-b border-stone-800/70">
          <HeroGlow />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.05fr_1fr] md:py-20">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-stone-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                </span>
                {profile.availability}
              </p>
              <h1 className="mt-5 font-display text-5xl leading-[1.05] text-stone-50 sm:text-6xl">{profile.name}</h1>
              <p className="mt-2 text-lg text-amber-200/90">
                <RoleTicker roles={profile.roles} />
              </p>
              <p className="mt-1 text-sm text-stone-400">
                {profile.education} · {profile.location}
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-300">{profile.headline}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <FxButton href="/interview" variant="danger">
                  Survive the interview →
                </FxButton>
                <FxButton href="#work" variant="ghost">
                  See my work
                </FxButton>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-400">
                {profile.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={linkClass}>
                    {l.label}
                  </a>
                ))}
                <a href={`mailto:${profile.email}`} className={linkClass}>
                  {profile.email}
                </a>
              </div>
              <p className="mt-5 hidden text-xs text-stone-600 sm:block">
                Tip: press <kbd className="rounded border border-stone-700 px-1 font-mono text-stone-400">Ctrl K</kbd> to open the command terminal.
              </p>
            </div>
            <HeroVisual />
          </div>
        </section>

        {/* about */}
        <AboutSection />

        {/* featured: the interview */}
        <section className="border-y border-stone-800/70 bg-[#0b0c0e]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
            <div>
              <Reveal>
                <Eyebrow>Featured project</Eyebrow>
                <h2 className="mt-2 font-display text-3xl text-stone-100 sm:text-4xl">The Interview</h2>
                <p className="mt-4 leading-relaxed text-stone-300">
                  Most portfolios ask you to scroll. This one asks you to sit down across from the Recruiter. A shotgun
                  is loaded with a known number of live and blank shells in an unknown order. Read the odds, use your
                  items, and outlast it to unlock the dossier.
                </p>
              </Reveal>
              <RevealGroup as="div" className="mt-6 grid grid-cols-3 gap-3" stagger={0.1} delay={0.1}>
                {FEATURE_FACTS.map((f) => (
                  <RevealItem key={f.k} className="rounded border border-stone-800 bg-black/30 p-3 transition-colors hover:border-amber-300/40">
                    <p className="font-display text-lg text-amber-200">{f.k}</p>
                    <p className="mt-1 text-xs leading-snug text-stone-400">{f.v}</p>
                  </RevealItem>
                ))}
              </RevealGroup>
              <Reveal delay={0.3} className="mt-8">
                <FxButton href="/interview" variant="amber">
                  Play it now
                </FxButton>
              </Reveal>
            </div>
            <div>
              <Reveal delay={0.1}>
                <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-stone-500">Under the hood</p>
              </Reveal>
              <RevealGroup as="ul" className="mt-4 space-y-3" stagger={0.1} delay={0.15}>
                {ENGINEERING.map((e) => (
                  <RevealItem as="li" key={e} className="flex gap-3 text-sm leading-relaxed text-stone-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                    {e}
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </section>

        {/* work */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading id="work" eyebrow="Work" title="Project highlights" />
          <ProjectsSection projects={shellProjects} moreUrl={profile.moreProjectsUrl} />
        </section>

        {/* skills */}
        <section className="border-y border-stone-800/70 bg-[#0b0c0e]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <SectionHeading id="skills" eyebrow="Skills" title="What I work with" />
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((g, gi) => (
                <div key={g.group}>
                  <Reveal delay={(gi % 3) * 0.08}>
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">{g.group}</p>
                  </Reveal>
                  <RevealGroup as="ul" className="mt-3 flex flex-wrap gap-1.5" stagger={0.04} delay={0.1 + (gi % 3) * 0.08}>
                    {g.items.map((s) => (
                      <RevealItem
                        as="li"
                        key={s}
                        className="cursor-default rounded border border-stone-700 px-2.5 py-1 text-sm text-stone-200 transition-[border-color,background-color,color] duration-200 hover:border-amber-300/60 hover:bg-amber-300/10 hover:text-amber-100"
                      >
                        {s}
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* experience */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading id="experience" eyebrow="Timeline" title="Education & journey" />
          <Timeline items={experience} />
        </section>

        {/* contact */}
        <section id="contact" className="relative scroll-mt-24 overflow-hidden border-t border-stone-800/70">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
            style={{ background: "radial-gradient(ellipse 50% 100% at 50% 100%, rgba(252,211,77,0.07), transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
            <Reveal>
              <Eyebrow>Contact</Eyebrow>
              <h2 className="mt-3 font-display text-4xl text-stone-100 sm:text-5xl">Let&apos;s talk.</h2>
              <p className="mx-auto mt-4 max-w-xl text-stone-400">
                Offering an internship, a research collaboration, or just want to argue about the Recruiter&apos;s AI? My
                inbox is open.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <FxButton href={`mailto:${profile.email}`} variant="amber" uppercase={false} className="tracking-wider">
                {profile.email}
              </FxButton>
              <CopyEmail email={profile.email} />
            </Reveal>
            <Reveal delay={0.25} className="mt-6 flex justify-center gap-6 text-sm text-stone-400">
              {profile.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={linkClass}>
                  {l.label}
                </a>
              ))}
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-800/70 py-6 text-center text-xs text-stone-600">
        © {profile.name} · Built with Next.js and React Three Fiber ·{" "}
        <span className="hidden sm:inline">
          press <kbd className="rounded border border-stone-700 px-1 font-mono text-stone-400">Ctrl K</kbd> for the terminal
        </span>
      </footer>

      <BackToTop />
    </div>
  );
}
