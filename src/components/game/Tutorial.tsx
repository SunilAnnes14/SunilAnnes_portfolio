"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { tutorialSeen, useGame } from "@/game/store";

interface Step {
  /** `data-tour` value of the element to spotlight; null centers the card. */
  target: string | null;
  title: string;
  body: string;
}

export const TUTORIAL_STEPS: Step[] = [
  {
    target: null,
    title: "Welcome to the interview",
    body: "You and the Recruiter take turns with one shotgun. Outlast it for three rounds to unlock my portfolio. This tour takes about 30 seconds.",
  },
  {
    target: "magazine",
    title: "Read the shotgun",
    body: "You're told how many live (red) and blank (blue) shells were loaded, but never their order. This strip shows what's left. The big one is fired next.",
  },
  {
    target: "odds",
    title: "Know the odds",
    body: "This is the chance the next shell is live, worked out from what's left. Above 50%? Point it at the Recruiter. Below? Point it at yourself.",
  },
  {
    target: "actions",
    title: "Pick a target",
    body: "Shoot the Recruiter and a live shell costs it 1 composure. Shoot yourself: a blank means you go again, but a live one hurts you.",
  },
  {
    target: "items",
    title: "Use items first",
    body: "Items are free moves before you shoot. The Debugger reveals the next shell, Coffee restores composure. Hover or tap an item to read what it does.",
  },
  {
    target: "hp",
    title: "Keep your composure",
    body: "Yours is down here; the Recruiter's is at the top. Whoever hits zero loses the round.",
  },
  {
    target: "dossier",
    title: "Your reward",
    body: "Each round you clear unlocks part of my portfolio in the Dossier. Short on time? The portfolio link up top is always there.",
  },
];

type Rect = { top: number; left: number; width: number; height: number };

function measure(target: string | null): Rect | null {
  if (!target) return null;
  // Several layouts may render the same target; use the first one that's visible.
  for (const el of document.querySelectorAll(`[data-tour="${target}"]`)) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 || r.height > 0) return { top: r.top, left: r.left, width: r.width, height: r.height };
  }
  return null;
}

const CARD_W = 340;
const PAD = 8;

export function Tutorial() {
  const step = useGame((s) => s.tutorial);
  const setTutorial = useGame((s) => s.setTutorial);
  const finish = useGame((s) => s.finishTutorial);
  const phase = useGame((s) => s.game.phase);
  const turn = useGame((s) => s.game.turn);
  const busy = useGame((s) => s.busy);
  const autoStarted = useRef(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const [vw, setVw] = useState({ w: 1280, h: 800 });

  // First visit: open the tour on the player's first turn.
  useEffect(() => {
    if (autoStarted.current || step !== null) return;
    if (phase === "turn" && turn === "player" && !busy && !tutorialSeen()) {
      autoStarted.current = true;
      setTutorial(0);
    }
  }, [phase, turn, busy, step, setTutorial]);

  const current = step === null ? null : TUTORIAL_STEPS[step];

  // Track the target element while it animates or the window resizes.
  useLayoutEffect(() => {
    if (!current) return;
    const update = () => {
      setRect(measure(current.target));
      setVw({ w: window.innerWidth, h: window.innerHeight });
    };
    update();
    const id = window.setInterval(update, 250);
    window.addEventListener("resize", update);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", update);
    };
  }, [current]);

  useEffect(() => {
    if (step === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (step >= TUTORIAL_STEPS.length - 1) finish();
        else setTutorial(step + 1);
      } else if (e.key === "ArrowLeft" && step > 0) setTutorial(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, finish, setTutorial]);

  if (step === null || !current) return null;

  const last = step === TUTORIAL_STEPS.length - 1;
  const cardW = Math.min(CARD_W, vw.w - 32);
  let cardStyle: React.CSSProperties;
  if (rect) {
    const below = rect.top + rect.height / 2 < vw.h / 2;
    const left = Math.max(16, Math.min(vw.w - cardW - 16, rect.left + rect.width / 2 - cardW / 2));
    cardStyle = below
      ? { left, top: Math.min(vw.h - 220, rect.top + rect.height + PAD + 14), width: cardW }
      : { left, bottom: Math.min(vw.h - 220, vw.h - rect.top + PAD + 14), width: cardW };
  } else {
    // Positioned numerically: the card's own motion transform would override a CSS translate.
    cardStyle = { left: (vw.w - cardW) / 2, top: Math.max(16, vw.h / 2 - 130), width: cardW };
  }

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      {/* dim everything except the spotlight */}
      {rect ? (
        <motion.div
          className="pointer-events-none absolute rounded-lg border-2 border-amber-300/80"
          initial={false}
          animate={{ top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          style={{ boxShadow: "0 0 0 9999px rgba(0,0,0,0.72), 0 0 24px rgba(252,211,77,0.35)" }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/72" />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute rounded-lg border border-stone-600 bg-[#0f1012] p-5 text-stone-200 shadow-2xl"
          style={cardStyle}
        >
          <p className="text-[10px] uppercase tracking-[0.35em] text-amber-300/90">
            Tutorial · {step + 1}/{TUTORIAL_STEPS.length}
          </p>
          <h2 id="tour-title" className="mt-1.5 font-display text-xl text-stone-50">
            {current.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-300">{current.body}</p>

          <div className="mt-4 flex items-center gap-1.5" aria-hidden>
            {TUTORIAL_STEPS.map((_, i) => (
              <span key={i} className={`h-1 rounded-full transition-all ${i === step ? "w-5 bg-amber-300" : "w-1.5 bg-stone-600"}`} />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button onClick={finish} className="rounded px-2 py-1.5 text-xs uppercase tracking-widest text-stone-400 hover:text-stone-100">
              Skip tutorial
            </button>
            <div className="flex gap-2">
              {step > 0 && (
                <button onClick={() => setTutorial(step - 1)} className="rounded border border-stone-600 px-3 py-1.5 text-xs uppercase tracking-widest text-stone-300 hover:bg-white/5">
                  Back
                </button>
              )}
              <button
                autoFocus
                onClick={() => (last ? finish() : setTutorial(step + 1))}
                className="rounded border border-amber-300/60 bg-amber-300/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-100 hover:bg-amber-300/25"
              >
                {last ? "Let's play" : "Next"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
