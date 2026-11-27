"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin amber reading-progress bar along the bottom edge of the navbar (scaleX only). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-amber-300/60 via-amber-300 to-red-400"
      style={{ scaleX }}
    />
  );
}
