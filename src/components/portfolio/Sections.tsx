import { experience, profile, projects, skills, type SectionId } from "@/content/portfolio";

function H({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.35em] text-amber-300/90">{children}</h3>;
}

export function About() {
  return (
    <section>
      <H>About</H>
      <p className="font-display text-2xl text-stone-100">{profile.name}</p>
      <p className="text-sm text-stone-400">
        {profile.role} · {profile.location}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-stone-300">{profile.summary}</p>
    </section>
  );
}

export function Skills() {
  return (
    <section>
      <H>Skills</H>
      <dl className="space-y-2 text-sm">
        {skills.map((g) => (
          <div key={g.group} className="sm:flex sm:gap-3">
            <dt className="w-24 shrink-0 text-stone-500">{g.group}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <span key={s} className="rounded border border-stone-700 px-2 py-0.5 text-xs text-stone-300">
                  {s}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Projects() {
  return (
    <section>
      <H>Projects</H>
      <ul className="space-y-4">
        {projects.map((p) => (
          <li key={p.title} className="rounded border border-stone-700/70 bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-bold text-stone-100">{p.title}</p>
              <div className="flex gap-3 text-xs">
                {p.href && (
                  <a
                    className="text-amber-200 underline underline-offset-4"
                    href={p.href}
                    {...(p.href.startsWith("/") ? {} : { target: "_blank", rel: "noreferrer" })}
                  >
                    {p.href.startsWith("/") ? "You're in it" : "Live"}
                  </a>
                )}
                {p.repo && (
                  <a className="text-stone-300 underline underline-offset-4" href={p.repo} target="_blank" rel="noreferrer">
                    Code
                  </a>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-stone-400">{p.blurb}</p>
            <p className="mt-2 text-[11px] uppercase tracking-wider text-stone-500">{p.stack.join(" · ")}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Experience() {
  return (
    <section>
      <H>Experience</H>
      <ol className="space-y-4 border-l border-stone-700 pl-4">
        {experience.map((j) => (
          <li key={j.company + j.period}>
            <p className="font-bold text-stone-100">
              {j.role} <span className="font-normal text-stone-400">· {j.company}</span>
            </p>
            <p className="text-xs text-stone-500">{j.period}</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-stone-400">
              {j.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Contact() {
  return (
    <section>
      <H>Contact</H>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <a className="text-amber-200 underline underline-offset-4" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        {profile.links.map((l) => (
          <a key={l.href} className="text-stone-300 underline underline-offset-4" href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        ))}
        {profile.resumeUrl !== "#" && (
          <a className="text-stone-300 underline underline-offset-4" href={profile.resumeUrl}>
            Résumé (PDF)
          </a>
        )}
      </div>
    </section>
  );
}

export const SECTION_COMPONENTS: Record<SectionId, () => React.ReactElement> = {
  about: About,
  skills: Skills,
  projects: Projects,
  experience: Experience,
  contact: Contact,
};
