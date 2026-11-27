"use client";

import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";
import { MotionConfig, motion, useMotionValue, useSpring } from "motion/react";

const VARIANT = {
  danger:
    "border-red-400/40 bg-gradient-to-b from-[#5a1a16] to-[#2a0b09] text-red-100 font-bold shadow-[0_0_30px_rgba(200,40,30,0.3)] hover:shadow-[0_0_40px_rgba(220,50,40,0.45)]",
  amber: "border-amber-300/50 bg-amber-300/10 text-amber-100 font-bold hover:bg-amber-300/20 hover:shadow-[0_0_30px_rgba(252,211,77,0.2)]",
  ghost: "border-stone-600 text-stone-200 hover:bg-white/5 hover:border-stone-400",
} as const;

const SIZE = {
  md: "px-5 py-3 text-sm tracking-[0.2em]",
  sm: "px-3.5 py-2 text-[11px] tracking-[0.2em]",
} as const;

const MAX_PULL = 6; // px the button leans toward the cursor

/**
 * Call-to-action link with three small touches: a light sweep across it on hover, a slight
 * magnetic pull toward the cursor (mouse only, never with reduced motion), and a press-down on click.
 */
export function FxButton({
  href,
  children,
  variant = "ghost",
  size = "md",
  external = false,
  uppercase = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  external?: boolean;
  /** Set false for text that must keep its case, such as an email address. */
  uppercase?: boolean;
  className?: string;
}) {
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 2 * MAX_PULL);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 2 * MAX_PULL);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cls = `group relative inline-flex items-center justify-center overflow-hidden rounded-md border ${uppercase ? "uppercase" : ""} outline-none transition-[background-color,box-shadow,border-color,filter] duration-300 focus-visible:ring-2 focus-visible:ring-amber-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a] ${VARIANT[variant]} ${SIZE[size]} ${className}`;

  const inner = (
    <>
      {/* light sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[400%] motion-reduce:hidden"
      />
      <span className="relative">{children}</span>
    </>
  );

  const motionProps = {
    style: { x, y },
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    whileTap: { scale: 0.96 },
    className: cls,
  };

  return (
    <MotionConfig reducedMotion="user">
      {external || href.startsWith("mailto:") || href.startsWith("#") ? (
        <motion.a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...motionProps}>
          {inner}
        </motion.a>
      ) : (
        <MotionLink href={href} {...motionProps}>
          {inner}
        </MotionLink>
      )}
    </MotionConfig>
  );
}

const MotionLink = motion.create(Link);
