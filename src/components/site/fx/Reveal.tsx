"use client";

import type { ReactNode } from "react";
import { MotionConfig, motion, type Variants } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-80px" } as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay } }),
};

type Tag = "div" | "li" | "ul" | "ol" | "p" | "section";

/** Fades and rises its content once, the first time it scrolls into view. Reduced motion: fade only. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: Tag }) {
  const M = motion[as];
  return (
    <MotionConfig reducedMotion="user">
      <M className={className} variants={rise} custom={delay} initial="hidden" whileInView="show" viewport={VIEWPORT}>
        {children}
      </M>
    </MotionConfig>
  );
}

/** A container whose RevealItem children appear one after another when it scrolls into view. */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  stagger?: number;
  delay?: number;
}) {
  const M = motion[as];
  return (
    <MotionConfig reducedMotion="user">
      <M
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {children}
      </M>
    </MotionConfig>
  );
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** One staggered child of a RevealGroup. */
export function RevealItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  const M = motion[as];
  return (
    <M className={className} variants={item}>
      {children}
    </M>
  );
}
