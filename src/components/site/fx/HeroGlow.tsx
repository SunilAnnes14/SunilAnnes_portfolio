"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const SIZE = 640;

/**
 * Soft warm glow that drifts toward the mouse inside the hero (transform only).
 * Stays put on touch devices and for reduced motion.
 */
export function HeroGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const place = (px: number, py: number) => {
      x.set(px - SIZE / 2);
      y.set(py - SIZE / 2);
    };
    // Start where the old static glow was: upper right.
    const r0 = host.getBoundingClientRect();
    x.jump(r0.width * 0.75 - SIZE / 2);
    y.jump(r0.height * 0.3 - SIZE / 2);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      place(e.clientX - r.left, e.clientY - r.top);
    };
    host.addEventListener("pointermove", onMove);
    return () => host.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 rounded-full"
      style={{
        x,
        y,
        width: SIZE,
        height: SIZE,
        background: "radial-gradient(circle, rgba(255,200,120,0.11) 0%, rgba(255,200,120,0.04) 40%, transparent 70%)",
      }}
    />
  );
}
