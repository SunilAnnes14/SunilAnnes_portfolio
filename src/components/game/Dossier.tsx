"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SECTIONS } from "@/content/portfolio";
import { useGame } from "@/game/store";
import { SECTION_COMPONENTS } from "../portfolio/Sections";
import { AchievementList } from "./AchievementToasts";

/** Slide-in folder of portfolio sections, unlocked by clearing rounds. */
export function Dossier() {
  const open = useGame((s) => s.dossierOpen);
  const setDossier = useGame((s) => s.setDossier);
  const roundsWon = useGame((s) => s.game.roundsWon);
  const lost = useGame((s) => s.game.phase === "gameOver");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDossier(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setDossier]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="dossier" className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setDossier(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Dossier"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-stone-700 bg-[#0d0e10] shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-stone-800 px-6 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500">Confidential</p>
                <h2 className="font-display text-xl tracking-[0.15em] text-stone-100">DOSSIER</h2>
              </div>
              <button ref={closeRef} onClick={() => setDossier(false)} className="rounded border border-stone-600 px-3 py-1 text-xs uppercase tracking-widest text-stone-300 hover:bg-white/5">
                Close <span className="text-stone-500">Esc</span>
              </button>
            </header>
            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              {SECTIONS.map((s) => {
                const Comp = SECTION_COMPONENTS[s.id];
                const unlocked = roundsWon >= s.unlockAt;
                return unlocked ? (
                  <Comp key={s.id} />
                ) : (
                  <div key={s.id} className="rounded border border-dashed border-stone-700 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-stone-500">{s.label}</p>
                    <div className="mt-2 space-y-1.5" aria-hidden>
                      <div className="h-2 w-3/4 rounded bg-stone-800" />
                      <div className="h-2 w-1/2 rounded bg-stone-800" />
                    </div>
                    <p className="mt-3 text-xs text-stone-500">[REDACTED] Clear round {s.unlockAt} to unlock.</p>
                  </div>
                );
              })}
              <AchievementList />
            </div>
            <footer className="border-t border-stone-800 px-6 py-3 text-xs text-stone-500">
              {lost ? "Didn't make it? " : "In a hurry? "}
              <Link href="/" className="text-amber-200 underline underline-offset-4">Read the full portfolio</Link>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
