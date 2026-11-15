"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGame, type Bubble } from "@/game/store";

const SHOW_MS = 3000;

/** Speech bubble beside the Recruiter's head. */
export function RecruiterBubble() {
  const bubble = useGame((s) => s.bubble);
  const [shown, setShown] = useState<Bubble | null>(null);

  useEffect(() => {
    if (!bubble) return;
    const on = setTimeout(() => setShown(bubble), bubble.delay);
    const off = setTimeout(() => setShown((b) => (b?.id === bubble.id ? null : b)), bubble.delay + SHOW_MS);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [bubble]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-[150px] z-20 w-[min(84vw,300px)] -translate-x-1/2 sm:left-[calc(50%+150px)] sm:top-[16%] sm:translate-x-0" aria-live="polite">
      <AnimatePresence mode="wait">
        {shown && (
          <motion.div
            key={shown.id}
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="relative w-fit rounded-xl rounded-bl-sm border border-emerald-200/30 bg-[#e9f7ee] px-3.5 py-2 text-sm font-medium leading-snug text-[#0d1f15] shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
          >
            <span className="sr-only">The Recruiter says: </span>
            {shown.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
