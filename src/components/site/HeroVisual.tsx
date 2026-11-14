"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Recruiter } from "@/components/game/Recruiter";
import { webglAvailable } from "@/game/store";

const HeroScene3D = dynamic(() => import("@/components/three/HeroScene3D"), { ssr: false });

const noop = () => () => {};
let cachedGl: boolean | null = null;
const clientMode = () => {
  cachedGl ??= webglAvailable();
  return cachedGl ? "3d" : "2d";
};
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Live 3D peek into the interview room; falls back to the 2D Recruiter without WebGL. */
export function HeroVisual() {
  const mode = useSyncExternalStore(noop, clientMode, () => "pending");
  const still = useSyncExternalStore(noop, reducedMotion, () => false);

  return (
    <Link
      href="/interview"
      aria-label="Play The Interview"
      className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-stone-700/70 bg-[#050607] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
    >
      {mode === "3d" && <HeroScene3D still={still} />}
      {mode === "2d" && (
        <div className="absolute inset-x-[15%] bottom-0 top-[8%]">
          <Recruiter />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent p-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-amber-300/90">Interactive</p>
          <p className="font-display text-lg text-stone-100">The Recruiter will see you now.</p>
        </div>
        <span className="rounded border border-red-400/50 bg-black/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-red-100 transition group-hover:bg-red-900/50">
          Play →
        </span>
      </div>
    </Link>
  );
}
