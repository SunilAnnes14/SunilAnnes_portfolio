import Link from "next/link";
import { experience, profile, skills } from "@/content/portfolio";
import { shellProjects } from "@/content/projectHighlights";
import { ProjectsSection } from "@/components/site/projects/ProjectsSection";
import { HeroVisual } from "@/components/site/HeroVisual";
import { RoleTicker } from "@/components/site/RoleTicker";
import { SiteNav } from "@/components/site/SiteNav";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-amber-300/90">{children}</p>;
}

function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div id={id} className="mb-8 scroll-mt-24">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-stone-100 sm:text-4xl">{title}</h2>
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

export default function Home() {
  return (
    <div className="min-h-dvh bg-[#08090a] text-stone-200">
      <SiteNav />

      <main>
        {/* hero */}
        <section className="relative overflow-hidden border-b border-stone-800/70">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 60% 70% at 75% 30%, rgba(255,200,120,0.09), transparent 70%)" }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.05fr_1fr] md:py-20">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-stone-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
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
                <Link
                  href="/interview"
                  className="rounded-md border border-red-400/40 bg-gradient-to-b from-[#5a1a16] to-[#2a0b09] px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-red-100 shadow-[0_0_30px_rgba(200,40,30,0.3)] transition hover:brightness-125"
                >
                  Survive the interview →
                </Link>
                <a
                  href="#work"
                  className="rounded-md border border-stone-600 px-5 py-3 text-sm uppercase tracking-[0.2em] text-stone-200 transition hover:bg-white/5"
                >
                  See my work
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-400">
                {profile.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-stone-100 hover:underline">
                    {l.label}
                  </a>
                ))}
                <a href={`mailto:${profile.email}`} className="underline-offset-4 hover:text-stone-100 hover:underline">
                  {profile.email}
                </a>
              </div>
            </div>
            <HeroVisual />
          </div>
        </section>

        {/* about */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading id="about" eyebrow="About" title="Hi, I'm glad you stopped by." />
          <p className="max-w-3xl text-base leading-relaxed text-stone-300">{profile.summary}</p>
        </section>

        {/* featured: the interview */}
        <section className="border-y border-stone-800/70 bg-[#0b0c0e]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
            <div>
              <Eyebrow>Featured project</Eyebrow>
              <h2 className="mt-2 font-display text-3xl text-stone-100 sm:text-4xl">The Interview</h2>
              <p className="mt-4 leading-relaxed text-stone-300">
                Most portfolios ask you to scroll. This one asks you to sit down across from the Recruiter. A shotgun
                is loaded with a known number of live and blank shells in an unknown order. Read the odds, use your
                items, and outlast it to unlock the dossier.
              </p>
              <dl className="mt-6 grid grid-cols-3 gap-3">
                {FEATURE_FACTS.map((f) => (
                  <div key={f.k} className="rounded border border-stone-800 bg-black/30 p-3">
                    <dt className="font-display text-lg text-amber-200">{f.k}</dt>
                    <dd className="mt-1 text-xs leading-snug text-stone-400">{f.v}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/interview"
                className="mt-8 inline-block rounded-md border border-amber-300/50 bg-amber-300/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-100 transition hover:bg-amber-300/20"
              >
                Play it now
              </Link>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-stone-500">Under the hood</p>
              <ul className="mt-4 space-y-3">
                {ENGINEERING.map((e) => (
                  <li key={e} className="flex gap-3 text-sm leading-relaxed text-stone-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                    {e}
                  </li>
                ))}
              </ul>
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
              {skills.map((g) => (
                <div key={g.group}>
                  <p className="text-xs uppercase tracking-[0.25em] text-stone-500">{g.group}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {g.items.map((s) => (
                      <li key={s} className="rounded border border-stone-700 px-2.5 py-1 text-sm text-stone-200">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* experience */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading id="experience" eyebrow="Timeline" title="Education & journey" />
          <ol className="space-y-8 border-l border-stone-800 pl-6">
            {experience.map((j) => (
              <li key={j.company + j.period} className="relative">
                <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border border-amber-300 bg-[#08090a]" />
                <p className="text-xs uppercase tracking-widest text-stone-500">{j.period}</p>
                <p className="mt-1 text-lg text-stone-100">
                  {j.role} <span className="text-stone-400">· {j.company}</span>
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-stone-400">
                  {j.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        {/* contact */}
        <section id="contact" className="scroll-mt-24 border-t border-stone-800/70">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="mt-3 font-display text-4xl text-stone-100 sm:text-5xl">Let&apos;s talk.</h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-400">
              Offering an internship, a research collaboration, or just want to argue about the Recruiter&apos;s AI? My
              inbox is open.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 inline-block rounded-md border border-amber-300/50 bg-amber-300/10 px-6 py-3 font-bold tracking-wider text-amber-100 transition hover:bg-amber-300/20"
            >
              {profile.email}
            </a>
            <div className="mt-6 flex justify-center gap-6 text-sm text-stone-400">
              {profile.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-stone-100 hover:underline">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-800/70 py-6 text-center text-xs text-stone-600">
        © {profile.name} · Built with Next.js and React Three Fiber
      </footer>
    </div>
  );
}
