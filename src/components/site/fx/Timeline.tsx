"use client";

import { useEffect, useRef } from "react";
import { MotionConfig, motion, useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import type { Job } from "@/content/portfolio";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Timeline whose rail draws downward as you scroll, with each entry sliding in and its dot popping. */
export function Timeline({ items }: { items: Job[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });
  const rail = useMotionValue(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.set(reduced.current ? 1 : scrollYProgress.get());
  }, [rail, scrollYProgress]);
  useMotionValueEvent(scrollYProgress, "change", (v) => rail.set(reduced.current ? 1 : v));

  return (
    <MotionConfig reducedMotion="user">
      <ol ref={ref} className="relative space-y-8 pl-6">
        {/* faint track + the drawn rail */}
        <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-stone-800" />
        <motion.span aria-hidden className="absolute bottom-0 left-0 top-0 w-px origin-top bg-amber-300/70" style={{ scaleY: rail }} />
        {items.map((j) => (
          <motion.li
            key={j.company + j.period}
            className="relative"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } } }}
          >
            <motion.span
              aria-hidden
              className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border border-amber-300 bg-[#08090a]"
              variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { type: "spring", stiffness: 500, damping: 18, delay: 0.15 } } }}
            />
            <p className="text-xs uppercase tracking-widest text-stone-500">{j.period}</p>
            <p className="mt-1 text-lg text-stone-100">
              {j.role} <span className="text-stone-400">· {j.company}</span>
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-stone-400">
              {j.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ol>
    </MotionConfig>
  );
}
