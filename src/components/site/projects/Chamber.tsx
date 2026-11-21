"use client";

import { useEffect, useRef } from "react";
import { useAnimate } from "motion/react";
import type { ShellProject } from "@/content/projectHighlights";
import { sfx } from "@/game/sound";
import { ShellArt } from "./Shell";

/** When the pump fires within the ~1.2s load, after the shell has flown into the slot. */
export const PUMP_AT = 0.5;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Stylized shotgun receiver with a loading slot and a pump handle.
 * The loaded shell's art shares a layoutId with the table, so it flies in on its own.
 */
export function Chamber({ loaded, soundOn }: { loaded: ShellProject | null; soundOn: boolean }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const soundRef = useRef(soundOn);
  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);

  const loadedId = loaded?.id ?? null;

  // Pump: slide back and forth, then a small jolt ("clack"). Skipped for reduced motion.
  useEffect(() => {
    if (!loadedId || !scope.current || reducedMotion()) return;
    const pump = scope.current.querySelector("[data-pump]");
    const body = scope.current.querySelector("[data-gun]");
    if (pump) animate(pump, { x: [0, -34, 0] }, { delay: PUMP_AT, duration: 0.32, ease: "easeInOut" });
    if (body) animate(body, { x: [0, 4, -3, 0] }, { delay: PUMP_AT + 0.16, duration: 0.2 });
    if (soundRef.current) sfx.rack(PUMP_AT);
  }, [loadedId, animate, scope]);

  return (
    <div ref={scope} className="relative overflow-hidden rounded-xl border border-stone-800 bg-[#0b0c0e] p-4">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-stone-500">
        <span>Chamber</span>
        <span className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full transition-colors ${loaded ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-stone-700"}`}
            aria-hidden
          />
          {loaded ? "Loaded" : "Empty"}
        </span>
      </div>

      {/* The gun, drawn flat with positioned shapes so the slot can host the shell element. */}
      <div data-gun className="relative mx-auto mt-3 aspect-[16/7] w-full max-w-[460px]">
        {/* stock */}
        <div className="absolute left-[1%] top-[40%] h-[30%] w-[24%] -skew-y-6 rounded-l-[40%] rounded-r-md bg-gradient-to-b from-[#8a5a34] to-[#4a2b14] shadow-inner" />
        {/* receiver */}
        <div className="absolute left-[21%] top-[26%] h-[48%] w-[38%] rounded-md bg-gradient-to-b from-[#4b525a] via-[#2a2f35] to-[#15181b] shadow-[inset_0_2px_0_rgba(255,255,255,0.08)]" />
        {/* barrel and magazine tube */}
        <div className="absolute left-[57%] top-[30%] h-[12%] w-[42%] rounded-r-sm bg-gradient-to-b from-[#5c636b] to-[#1b1e22]" />
        <div className="absolute left-[57%] top-[47%] h-[9%] w-[36%] rounded-r-sm bg-gradient-to-b from-[#30353b] to-[#15181b]" />
        {/* pump handle */}
        <div data-pump className="absolute left-[63%] top-[42%] h-[19%] w-[20%] rounded-md bg-gradient-to-b from-[#9a6a40] to-[#4a2b14] shadow-md">
          {[20, 40, 60, 80].map((x) => (
            <span key={x} className="absolute top-[18%] h-[64%] w-px bg-black/35" style={{ left: `${x}%` }} />
          ))}
        </div>
        {/* trigger guard */}
        <div className="absolute left-[33%] top-[72%] h-[16%] w-[12%] rounded-b-full border-2 border-t-0 border-[#1b1e22]" />

        {/* loading slot */}
        <div className="absolute left-[24%] top-[33%] h-[34%] w-[32%] rounded-sm border border-black/70 bg-[#050606] p-[2%] shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]">
          {loaded ? (
            <ShellArt key={loaded.id} project={loaded} inChamber />
          ) : (
            <span className="grid h-full place-items-center text-[9px] uppercase tracking-[0.25em] text-stone-600">slot</span>
          )}
        </div>
      </div>
    </div>
  );
}
