"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MotionConfig, motion, useMotionValue, useMotionValueEvent, useScroll, type Variants } from "motion/react";
import { about } from "@/content/about";
import { FactCard } from "./FactCard";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-80px" } as const;

/** Fade and rise 28px. `custom` sets this block's place in the reading order (seconds). */
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay } }),
};

/** Same rise, for items whose timing comes from a staggering parent. */
const riseItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Opacity-only fade for the pieces of the hobbies line. */
const fadeWord: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

const stagger = (gap: number, start: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: start } },
});

/** Reveals one block the first time it scrolls into view. */
function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} variants={rise} custom={delay} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      {children}
    </motion.div>
  );
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The homepage About section: short, scannable pieces instead of one long paragraph. */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Accent line beside the heading draws downward as the section scrolls in (scaleY only).
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.9", "start 0.3"] });
  const line = useMotionValue(0);
  const reduced = useRef(false);
  useEffect(() => {
    reduced.current = prefersReducedMotion();
    line.set(reduced.current ? 1 : scrollYProgress.get());
  }, [line, scrollYProgress]);
  useMotionValueEvent(scrollYProgress, "change", (v) => line.set(reduced.current ? 1 : v));

  const { hobbies } = about;
  const n = hobbies.items.length;

  return (
    // "user": with reduced motion, transforms are skipped and only the fades remain.
    <MotionConfig reducedMotion="user">
      <section ref={sectionRef} className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Same heading markup and id as the site's other section headings, plus the accent line in the margin. */}
        <div id="about" className="relative mb-8 scroll-mt-24">
          <motion.span
            aria-hidden
            className="absolute -left-3 bottom-1 top-1 w-[2px] origin-top rounded-full bg-amber-300/80 sm:-left-4"
            style={{ scaleY: line }}
          />
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-amber-300/90">About</p>
          <h2 className="mt-2 font-display text-3xl text-stone-100 sm:text-4xl">{about.heading}</h2>
        </div>

        <Reveal>
          <p className="max-w-[60ch] text-xl leading-snug text-stone-100 sm:text-2xl">{about.intro}</p>
        </Reveal>

        <motion.ul className="mt-8 grid gap-4 md:grid-cols-3" variants={stagger(0.1, 0.1)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {about.facts.map((f) => (
            <motion.li key={f.label} variants={riseItem}>
              <FactCard fact={f} />
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-2"
          variants={stagger(0.08, 0.35)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.span variants={riseItem} className="mr-1 text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400">
            Currently learning
          </motion.span>
          {about.learning.map((topic) => (
            <motion.span key={topic} variants={riseItem} className="rounded border border-stone-700 px-2.5 py-1 text-sm text-stone-200">
              {topic}
            </motion.span>
          ))}
        </motion.div>

        {/*
          Hobbies: one quiet line. The "Side quests:" label reuses the site's small amber label style;
          it fades in first, then each hobby 80ms after the last. Screen readers get one plain sentence.
        */}
        <motion.p
          className="mt-8 max-w-[60ch] text-base leading-relaxed text-stone-400"
          variants={{
            hidden: { opacity: 0, y: 28 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.5, staggerChildren: 0.08, delayChildren: 0.65 } },
          }}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.span variants={fadeWord} className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-300/90">
            {hobbies.lead}
          </motion.span>{" "}
          {hobbies.items.map((h, i) => (
            <motion.span key={h} variants={fadeWord}>
              {h}
              {i < n - 2 ? ", " : i === n - 2 ? " and " : "."}
            </motion.span>
          ))}
        </motion.p>

        <Reveal delay={0.65}>
          <p className="mt-2 max-w-[60ch] text-base italic text-stone-400">{about.closing}</p>
        </Reveal>
      </section>
    </MotionConfig>
  );
}
