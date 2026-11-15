"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ACHIEVEMENTS } from "@/game/achievements";
import { useGame } from "@/game/store";

/** Slide-in "Achievement unlocked" cards, shown one after another. */
export function AchievementToasts() {
  const toasts = useGame((s) => s.toasts);
  const dismiss = useGame((s) => s.dismissToast);
  const unlocked = useGame((s) => s.unlocked);
  const current = toasts[0];

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => dismiss(current.id), 3800);
    return () => clearTimeout(t);
  }, [current, dismiss]);

  return (
    <div className="pointer-events-none fixed right-3 top-[124px] z-[58] w-[min(88vw,300px)] sm:right-4 sm:top-[96px]" aria-live="polite">
      <AnimatePresence>
        {current && (
          <motion.button
            key={current.id}
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={() => dismiss(current.id)}
            className="pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-amber-300/50 bg-[#151208]/95 p-3 text-left shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-300/20 text-lg" aria-hidden>
              ★
            </span>
            <span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-amber-300/90">
                Achievement · {unlocked.length}/{ACHIEVEMENTS.length}
              </span>
              <span className="block font-display text-base text-stone-50">{current.name}</span>
              <span className="block text-xs text-stone-400">{current.how}</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Compact list of every achievement, for end screens and the dossier. */
export function AchievementList() {
  const unlocked = useGame((s) => s.unlocked);
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
        Achievements · {unlocked.length}/{ACHIEVEMENTS.length}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {ACHIEVEMENTS.map((a) => {
          const got = unlocked.includes(a.id);
          return (
            <li
              key={a.id}
              title={a.how}
              className={`rounded border px-2 py-1 text-[11px] ${got ? "border-amber-300/50 bg-amber-300/10 text-amber-100" : "border-stone-800 text-stone-600"}`}
            >
              {got ? "★ " : "☆ "}
              {a.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
