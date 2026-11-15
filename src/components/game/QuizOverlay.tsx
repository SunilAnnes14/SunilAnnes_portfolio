"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ITEMS } from "@/game/items";
import { useGame } from "@/game/store";
import { ItemIcon } from "./icons";

/** "Quick question before we continue": answer right to earn an item. */
export function QuizOverlay() {
  const quiz = useGame((s) => s.quiz);
  const answer = useGame((s) => s.answerQuiz);
  const close = useGame((s) => s.closeQuiz);

  useEffect(() => {
    if (!quiz) return;
    const onKey = (e: KeyboardEvent) => {
      if (quiz.picked === null && /^[1-4]$/.test(e.key)) answer(Number(e.key) - 1);
      else if (quiz.picked !== null && (e.key === "Enter" || e.key === "Escape")) close();
      else if (quiz.picked === null && e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quiz, answer, close]);

  return (
    <AnimatePresence>
      {quiz && (
        <motion.div
          key={quiz.question.id}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-q"
        >
          <motion.div
            initial={{ y: 20, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            className="w-full max-w-lg rounded-lg border border-emerald-300/30 bg-[#0c100e] p-6 text-stone-200 shadow-[0_0_60px_rgba(125,255,176,0.08)]"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-300/90">Pop quiz · bonus item if you&apos;re right</p>
            <p className="mt-1 text-xs italic text-stone-500">&ldquo;Quick question before we continue.&rdquo;</p>
            <h2 id="quiz-q" className="mt-3 font-display text-xl leading-snug text-stone-50">
              {quiz.question.q}
            </h2>

            <ol className="mt-5 grid gap-2">
              {quiz.question.options.map((opt, i) => {
                const answered = quiz.picked !== null;
                const isRight = i === quiz.question.answer;
                const isPicked = i === quiz.picked;
                const tone = !answered
                  ? "border-stone-600 hover:border-emerald-300/60 hover:bg-emerald-300/5"
                  : isRight
                    ? "border-emerald-400 bg-emerald-400/15 text-emerald-100"
                    : isPicked
                      ? "border-red-400 bg-red-500/15 text-red-100"
                      : "border-stone-800 text-stone-500";
                return (
                  <li key={opt}>
                    <button
                      autoFocus={i === 0}
                      disabled={answered}
                      onClick={() => answer(i)}
                      className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition ${tone}`}
                    >
                      <kbd className="grid h-6 w-6 shrink-0 place-items-center rounded border border-current/30 text-[11px] opacity-70">{i + 1}</kbd>
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ol>

            {quiz.picked !== null ? (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                <p className={`text-sm font-bold ${quiz.picked === quiz.question.answer ? "text-emerald-300" : "text-red-300"}`}>
                  {quiz.picked === quiz.question.answer ? "Correct." : "Not quite."}
                </p>
                <p className="mt-1 text-sm text-stone-400">{quiz.question.why}</p>
                {quiz.reward && (
                  <p className="mt-3 flex items-center gap-2 rounded border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">
                    <ItemIcon id={quiz.reward} className="h-5 w-5" />
                    You earned a <strong>{ITEMS[quiz.reward].name}</strong>: {ITEMS[quiz.reward].effect.toLowerCase()}
                  </p>
                )}
                <button
                  autoFocus
                  onClick={close}
                  className="mt-4 rounded-md border border-amber-300/50 bg-amber-300/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-amber-100 hover:bg-amber-300/20"
                >
                  Continue
                </button>
              </motion.div>
            ) : (
              <button onClick={close} className="mt-4 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-200">
                Skip question
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
