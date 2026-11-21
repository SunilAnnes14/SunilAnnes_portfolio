"use client";

import type { PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import type { ProjectHighlight, Reader } from "@/content/projectHighlights";

const READERS: Reader[] = ["recruiter", "developer"];
const MAX_TILT = 6; // degrees
const GLOW = 320; // spotlight diameter, px
const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  project: ProjectHighlight;
  index: number;
  reader: Reader;
  open: boolean;
  onToggle: () => void;
}

/**
 * Checked at interaction time, not during render, so server and client markup always match.
 * Movement in the declarative animations is turned off by <MotionConfig reducedMotion="user">.
 */
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ProjectCard({ project, index, reader, open, onToggle }: Props) {
  const detailsId = `project-${project.id}-details`;

  // Tilt and spotlight: motion values, so pointer movement never re-renders React.
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowOpacity = useSpring(0, { stiffness: 200, damping: 30 });

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    // Mouse only: no tilt on touch or pen, and none for reduced motion.
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateY.set((px - 0.5) * 2 * MAX_TILT);
    rotateX.set(-(py - 0.5) * 2 * MAX_TILT);
    glowX.set(e.clientX - r.left - GLOW / 2);
    glowY.set(e.clientY - r.top - GLOW / 2);
    glowOpacity.set(1);
  };
  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowOpacity.set(0);
  };

  const live = project.href && !project.href.startsWith("/") ? project.href : null;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: EASE,
        layout: { duration: 0.35, ease: EASE, delay: 0 },
      }}
      style={{ perspective: 900 }}
      className="list-none"
    >
      <motion.div
        layout
        transition={{ layout: { duration: 0.35, ease: EASE } }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX, rotateY }}
        className={`group relative overflow-hidden rounded-lg border bg-[#0d0e10] transition-colors ${
          open ? "border-amber-300/50" : "border-stone-800 hover:border-amber-300/40"
        }`}
      >
        {/* spotlight that follows the pointer (stays invisible unless a mouse hovers with motion allowed) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 rounded-full"
          style={{
            width: GLOW,
            height: GLOW,
            x: glowX,
            y: glowY,
            opacity: glowOpacity,
            background: "radial-gradient(circle, rgba(252,211,77,0.12) 0%, rgba(252,211,77,0.04) 40%, transparent 70%)",
          }}
        />

        <motion.button
          layout="position"
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={detailsId}
          className="relative block w-full rounded-lg p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-300/70"
        >
          {project.tag && (
            <span className="mb-3 inline-block w-fit rounded bg-amber-300/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-amber-200">
              {project.tag}
            </span>
          )}
          <span className="block font-display text-xl text-stone-100">{project.title}</span>

          {/* Both readings share one grid cell, so the card keeps the taller height and never jumps. */}
          <span className="mt-2 grid">
            {READERS.map((r) => (
              <motion.span
                key={r}
                aria-hidden={r !== reader}
                initial={false}
                animate={{ opacity: r === reader ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="col-start-1 row-start-1 block text-sm leading-relaxed text-stone-400"
              >
                {project.summary[r]}
              </motion.span>
            ))}
          </span>

          <span className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-stone-500 group-hover:text-stone-300">
            {open ? "Hide details" : "Stack & links"}
            <motion.span
              aria-hidden
              className="inline-block text-amber-300/80"
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.25 }}
            >
              +
            </motion.span>
          </span>
        </motion.button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="details"
              id={detailsId}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.25 }}
              className="relative px-5 pb-5"
            >
              <motion.ul
                className="flex flex-wrap gap-1.5"
                aria-label="Tech stack"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
              >
                {project.stack.map((s) => (
                  <motion.li
                    key={s}
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE } },
                    }}
                    className="rounded border border-stone-700 px-2 py-0.5 text-[11px] uppercase tracking-wider text-stone-300"
                  >
                    {s}
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-4 flex gap-4 text-sm">
                {live && (
                  <a className="text-amber-200 underline-offset-4 hover:underline focus-visible:underline" href={live} target="_blank" rel="noreferrer">
                    Live →
                  </a>
                )}
                {project.repo && (
                  <a className="text-stone-300 underline-offset-4 hover:underline focus-visible:underline" href={project.repo} target="_blank" rel="noreferrer">
                    Code
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.li>
  );
}
