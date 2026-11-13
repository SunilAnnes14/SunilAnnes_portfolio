import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/portfolio";
import { About, Contact, Experience, Projects, Skills } from "@/components/portfolio/Sections";

export const metadata: Metadata = {
  title: `${profile.name} · Portfolio`,
  description: profile.summary,
};

export default function ResumePage() {
  return (
    <main className="min-h-dvh bg-[#0b0c0e] px-4 py-12 text-stone-200 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-stone-500">
          <span>Unredacted file</span>
          <Link href="/" className="text-amber-200 normal-case tracking-normal underline underline-offset-4">
            ← Back to the interview
          </Link>
        </div>
        <div className="space-y-12">
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </div>
      </div>
    </main>
  );
}
