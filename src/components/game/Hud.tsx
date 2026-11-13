"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SECTIONS, funFacts } from "@/content/portfolio";
import { ROUNDS } from "@/game/engine";
import { TIMING, useGame } from "@/game/store";
import { ShellGlyph } from "./icons";

export function Composure({ value, max, label, align = "left" }: { value: number; max: number; label: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "flex flex-col items-center" : ""}>
      <div className="mb-1 text-[10px] uppercase tracking-[0.25em] text-stone-400">{label}</div>
      <div className="flex gap-1" role="meter" aria-label={`${label} composure`} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
        {Array.from({ length: max }, (_, i) => (
          <motion.span
            key={i}
            animate={{ opacity: i < value ? 1 : 0.18, scale: i < value ? 1 : 0.85 }}
            className="block h-4 w-6 rounded-[2px] border border-black/60 sm:h-5 sm:w-8"
            style={{
              background: i < value ? "linear-gradient(#ffd27a,#e08a1e)" : "#2a2c30",
              boxShadow: i < value ? "0 0 10px rgba(255,170,60,0.55)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ShellStrip() {
  const shells = useGame((s) => s.game.shells);
  const known = useGame((s) => s.game.known.player);
  const phase = useGame((s) => s.game.phase);
  if (phase === "intro" || phase === "loading") return null;
  return (
    <div className="flex items-end gap-1" aria-label={`${shells.length} shells remaining`}>
      {shells.map((_, i) => (
        <div key={i} className={`relative ${i === 0 ? "w-5 sm:w-6" : "w-3.5 sm:w-4"}`}>
          <ShellGlyph kind={known[i] ?? "unknown"} className="w-full" />
          {i === 0 && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest text-amber-300/80">next</div>}
        </div>
      ))}
    </div>
  );
}

function FunFactToast() {
  const event = useGame((s) => s.game.event);
  const eventId = useGame((s) => s.game.eventId);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (event?.kind !== "shot" || event.shell !== "blank") return;
    const on = setTimeout(() => setShown(eventId), TIMING.fireAt + 150);
    const off = setTimeout(() => setShown((v) => (v === eventId ? null : v)), TIMING.fireAt + 3400);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [event, eventId]);

  return (
    <AnimatePresence>
      {shown !== null && (
        <motion.div
          key={shown}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="pointer-events-none absolute left-1/2 top-[44%] z-20 w-[min(92vw,420px)] -translate-x-1/2 rounded border border-sky-300/20 bg-black/75 px-4 py-2 text-center text-xs text-sky-100 backdrop-blur"
        >
          <span className="mr-2 font-bold uppercase tracking-widest text-sky-300">Blank.</span>
          {funFacts[shown % funFacts.length]}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Hud() {
  const game = useGame((s) => s.game);
  const muted = useGame((s) => s.muted);
  const toggleMute = useGame((s) => s.toggleMute);
  const setDossier = useGame((s) => s.setDossier);
  const unlocked = SECTIONS.filter((x) => game.roundsWon >= x.unlockAt).length;
  const playing = game.phase !== "intro";

  return (
    <>
      {/* top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:p-5">
        <div className="pointer-events-auto min-w-0">
          {playing && (
            <>
              <div className="font-display text-sm tracking-[0.3em] text-stone-200 sm:text-base">
                ROUND {game.round + 1}
                <span className="text-stone-500">/{ROUNDS.length}</span>
              </div>
              <div className="mt-1 flex gap-1.5">
                {ROUNDS.map((_, i) => (
                  <span key={i} className={`h-1.5 w-6 rounded-full ${i < game.roundsWon ? "bg-amber-400" : i === game.round ? "bg-stone-300" : "bg-stone-700"}`} />
                ))}
              </div>
              <div className="mt-2 whitespace-nowrap text-[10px] text-stone-400 sm:text-[11px]">
                Loaded <span className="text-red-400">{game.loadInfo.live} live</span> ·{" "}
                <span className="text-sky-300">{game.loadInfo.blank} blank</span>
              </div>
              <div className="mt-3">
                <ShellStrip />
              </div>
            </>
          )}
        </div>

        {playing && (
          <div className="pointer-events-auto absolute left-1/2 top-[76px] -translate-x-1/2 sm:top-5">
            <Composure value={game.hp.recruiter} max={game.maxHp} label="Recruiter" align="center" />
          </div>
        )}

        <div className="pointer-events-auto flex shrink-0 flex-col items-end gap-2 text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setDossier(true)}
              className="rounded border border-amber-300/30 bg-black/50 px-3 py-1.5 uppercase tracking-widest text-amber-200 transition hover:bg-amber-300/10"
            >
              Dossier <span className="text-amber-400/70">{unlocked}/{SECTIONS.length}</span>
            </button>
            <button
              onClick={toggleMute}
              aria-pressed={muted}
              className="rounded border border-stone-500/30 bg-black/50 px-3 py-1.5 uppercase tracking-widest text-stone-300 transition hover:bg-white/5"
            >
              {muted ? "Sound off" : "Sound on"}
            </button>
          </div>
          <Link href="/resume" className="text-stone-500 underline-offset-4 hover:text-stone-200 hover:underline">
            Skip to portfolio →
          </Link>
        </div>
      </div>

      <FunFactToast />
    </>
  );
}
