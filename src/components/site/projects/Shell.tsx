"use client";

import { motion } from "motion/react";
import type { ShellProject } from "@/content/projectHighlights";

/**
 * Flat, game-like shotgun shell lying on its side: brass head on the left, colored hull with the
 * project name. It has a shared layoutId, so moving it between the table and the chamber animates
 * the flight with transforms only.
 */
export function ShellArt({ project, inChamber = false }: { project: ShellProject; inChamber?: boolean }) {
  const name = project.shellName ?? project.title;
  const long = name.length > 11;
  const gid = `hull-${project.id}`;
  return (
    <motion.div
      layoutId={`shell-${project.id}`}
      // In the chamber it settles from a tilt, so the flight reads as "lift, tilt upright, slide in".
      initial={inChamber ? { rotate: -24, y: -10 } : false}
      animate={{ rotate: 0, y: 0 }}
      transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }, default: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      className="h-full w-full"
      aria-hidden
    >
      <svg viewBox="0 0 170 48" className="h-full w-full overflow-visible drop-shadow-[0_6px_6px_rgba(0,0,0,0.55)]" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`${gid}-brass`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f4d27a" />
            <stop offset="0.45" stopColor="#c99a35" />
            <stop offset="1" stopColor="#7d5a1a" />
          </linearGradient>
          <linearGradient id={`${gid}-hull`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="0.35" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {/* hull */}
        <rect x="30" y="4" width="136" height="40" rx="6" fill={project.hull} />
        <rect x="30" y="4" width="136" height="40" rx="6" fill={`url(#${gid}-hull)`} />
        {/* crimped end */}
        {[0, 1, 2].map((i) => (
          <line key={i} x1={158 + i * 2.6} y1="9" x2={158 + i * 2.6} y2="39" stroke="#000" strokeOpacity="0.25" strokeWidth="1.2" />
        ))}
        {/* brass head with rim */}
        <rect x="4" y="5" width="32" height="38" rx="3" fill={`url(#${gid}-brass)`} />
        <rect x="1" y="2" width="7" height="44" rx="2" fill={`url(#${gid}-brass)`} stroke="#6b4c14" strokeWidth="0.8" />
        <circle cx="4.5" cy="24" r="2.4" fill="#6b4c14" opacity="0.6" />
        {/* name printed on the hull */}
        <text
          x="96"
          y="29"
          textAnchor="middle"
          fontSize={long ? 11.5 : 13}
          fontWeight="700"
          letterSpacing="0.5"
          fill="#fff7ed"
          style={{ fontFamily: "var(--font-mono-ui), monospace" }}
          {...(long ? { textLength: 118, lengthAdjust: "spacingAndGlyphs" } : {})}
        >
          {name.toUpperCase()}
        </text>
      </svg>
    </motion.div>
  );
}

/** Faint outline left on the table where a loaded shell used to lie. */
function ShellOutline() {
  return (
    <svg viewBox="0 0 170 48" className="h-full w-full" aria-hidden>
      <rect x="2" y="3" width="164" height="42" rx="6" fill="none" stroke="#a8a29e" strokeOpacity="0.35" strokeDasharray="5 5" />
    </svg>
  );
}

interface ShellProps {
  project: ShellProject;
  index: number;
  loaded: boolean;
  /** Increments once after auto-load so the remaining shells pulse a hint. */
  pulse: number;
  onPick: (id: string) => void;
}

/** A shell on the table. Always a button, so focus stays put while its art flies to the chamber. */
export function Shell({ project, index, loaded, pulse, onPick }: ShellProps) {
  const status = project.status === "live" ? "shipped" : "in progress";
  return (
    <button
      type="button"
      onClick={() => onPick(project.id)}
      aria-pressed={loaded}
      aria-label={`${project.title}, ${project.label}, ${status}. ${loaded ? "Loaded; press to unload." : "Press to load."}`}
      className="group flex flex-col items-center gap-2 rounded-lg px-2 py-3 outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80"
    >
      <motion.div
        key={pulse}
        animate={pulse && !loaded ? { scale: [1, 1.08, 1] } : undefined}
        transition={{ duration: 0.6, delay: 0.25 + index * 0.12 }}
        className="h-12 w-full max-w-[170px]"
      >
        {/* Hover tilt and glow: Tailwind's hover only applies on devices that can hover, so touch gets none. */}
        <div className="h-full w-full transition-[transform,filter] duration-200 group-hover:-translate-y-1 group-hover:-rotate-3 group-hover:drop-shadow-[0_0_14px_rgba(252,211,77,0.45)]">
          {loaded ? <ShellOutline /> : <ShellArt project={project} />}
        </div>
      </motion.div>
      <span className={`text-[10px] uppercase tracking-[0.25em] ${loaded ? "text-stone-600" : "text-stone-400 group-hover:text-stone-200"}`}>
        {project.label}
      </span>
    </button>
  );
}
