"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { SECTIONS, profile } from "@/content/portfolio";
import { DIFFICULTY } from "@/game/engine";
import { ITEMS } from "@/game/items";
import { useGame } from "@/game/store";
import { unlockAudio } from "@/game/sound";
import type { Difficulty, ItemId } from "@/game/types";
import { AchievementList } from "./AchievementToasts";
import { ItemIcon } from "./icons";

function Panel({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay, duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: delay + 0.15, duration: 0.5 } }}
        className="max-h-full w-full max-w-xl overflow-y-auto rounded-lg border border-stone-600/50 bg-[#0e0f11]/95 p-6 text-stone-200 shadow-2xl sm:p-8"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const primary =
  "rounded-md border border-amber-300/50 bg-amber-300/10 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-amber-100 transition hover:bg-amber-300/20";
const secondary =
  "rounded-md border border-stone-500/40 px-5 py-2.5 text-sm uppercase tracking-[0.2em] text-stone-300 transition hover:bg-white/5";

const RULE_ITEMS: ItemId[] = ["debugger", "hotfix", "coffee", "mergeConflict", "refactor", "prodDeploy", "stackTrace"];

const DIFFICULTY_BLURB: Record<Difficulty, string> = {
  easy: "+1 composure, 2 bonus items per reload, and a Recruiter who second-guesses itself.",
  normal: "An even fight. The Recruiter plays the odds and makes fewer mistakes.",
};

function DifficultyPicker() {
  const difficulty = useGame((s) => s.difficulty);
  const setDifficulty = useGame((s) => s.setDifficulty);
  return (
    <fieldset className="mt-5">
      <legend className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Difficulty</legend>
      <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup">
        {(["easy", "normal"] as const).map((d) => (
          <button
            key={d}
            role="radio"
            aria-checked={difficulty === d}
            onClick={() => setDifficulty(d)}
            className={`rounded-md border px-3 py-2 text-left transition ${
              difficulty === d ? "border-amber-300/70 bg-amber-300/10" : "border-stone-700 hover:border-stone-500"
            }`}
          >
            <span className="block text-sm font-bold uppercase tracking-[0.2em] text-stone-100">
              {DIFFICULTY[d].label}
              {d === "easy" && <span className="ml-2 text-[10px] font-normal tracking-widest text-emerald-300">recommended</span>}
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-stone-400">{DIFFICULTY_BLURB[d]}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Intro() {
  const dispatch = useGame((s) => s.dispatch);
  const start = () => {
    unlockAudio();
    dispatch({ type: "start", seed: (Date.now() ^ (Math.random() * 1e9)) >>> 0 });
  };
  return (
    <Panel>
      <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500">Final round · {profile.name}</p>
      <h1 className="mt-2 font-display text-4xl tracking-[0.15em] text-stone-100 sm:text-5xl">THE INTERVIEW</h1>
      <p className="mt-2 text-sm italic text-stone-400">A portfolio you have to survive.</p>

      <ol className="mt-6 grid gap-3 text-sm leading-relaxed text-stone-300 sm:grid-cols-3">
        <li className="rounded border border-stone-800 bg-black/30 p-3">
          <span className="block font-display text-lg text-amber-200">1 · Read</span>
          You&apos;re told how many <span className="text-red-400">live</span> and <span className="text-sky-300">blank</span> shells are loaded.
        </li>
        <li className="rounded border border-stone-800 bg-black/30 p-3">
          <span className="block font-display text-lg text-amber-200">2 · Decide</span>
          Shoot the Recruiter, or yourself. A blank at yourself means you go again.
        </li>
        <li className="rounded border border-stone-800 bg-black/30 p-3">
          <span className="block font-display text-lg text-amber-200">3 · Unlock</span>
          Each round you win reveals more of my portfolio.
        </li>
      </ol>
      <p className="mt-4 text-xs text-stone-500">
        New here? A 30-second tutorial starts on your first turn. Between reloads the Recruiter may throw you a{" "}
        <span className="text-emerald-300">pop quiz</span>: answer right for a free item.
      </p>

      <DifficultyPicker />

      <div className="mt-4 flex flex-wrap gap-2">
        {RULE_ITEMS.map((id) => (
          <span key={id} title={ITEMS[id].effect} className="flex items-center gap-1.5 rounded border border-stone-700 px-2 py-1 text-[11px] text-stone-400">
            <ItemIcon id={id} className="h-3.5 w-3.5 text-amber-200/80" />
            {ITEMS[id].name}
          </span>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button autoFocus onClick={start} className={primary}>Begin interview</button>
        <Link href="/" className={secondary}>Back to portfolio</Link>
      </div>
      <p className="mt-4 text-[11px] text-stone-600">Sound on recommended · Keys: O shoot Recruiter, S shoot yourself, 1-6 items, D dossier</p>
    </Panel>
  );
}

function RoundOver() {
  const game = useGame((s) => s.game);
  const dispatch = useGame((s) => s.dispatch);
  const setDossier = useGame((s) => s.setDossier);
  const fresh = SECTIONS.filter((x) => x.unlockAt === game.roundsWon);
  return (
    <Panel delay={1.2}>
      <p className="text-[10px] uppercase tracking-[0.4em] text-amber-400">Round {game.round + 1} cleared</p>
      <h2 className="mt-2 font-display text-3xl tracking-[0.1em]">The Recruiter reboots.</h2>
      <p className="mt-3 text-sm text-stone-400">
        Unlocked in your dossier:{" "}
        <span className="text-amber-200">{fresh.map((x) => x.label).join(" & ")}</span>
      </p>
      <p className="mt-1 text-sm text-stone-500">Next round: more composure, more shells, new items.</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <button autoFocus onClick={() => dispatch({ type: "nextRound" })} className={primary}>Next round</button>
        <button onClick={() => setDossier(true)} className={secondary}>Read dossier</button>
      </div>
    </Panel>
  );
}

function GameOver() {
  const dispatch = useGame((s) => s.dispatch);
  const roundsWon = useGame((s) => s.game.roundsWon);
  const difficulty = useGame((s) => s.difficulty);
  const setDifficulty = useGame((s) => s.setDifficulty);
  return (
    <Panel delay={1.4}>
      <p className="text-[10px] uppercase tracking-[0.4em] text-red-400">Application status: rejected</p>
      <h2 className="mt-2 font-display text-3xl tracking-[0.1em]">You didn&apos;t get the job.</h2>
      <p className="mt-3 text-sm text-stone-400">
        {roundsWon > 0 ? `You made it through ${roundsWon} round${roundsWon > 1 ? "s" : ""}. ` : ""}
        The good news: I&apos;m not the Recruiter. Here&apos;s the whole portfolio anyway.
      </p>
      <div className="mt-5">
        <AchievementList />
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <button autoFocus onClick={() => dispatch({ type: "restart", seed: (Date.now() * 7) >>> 0 })} className={primary}>Reapply</button>
        {difficulty === "normal" && (
          <button
            onClick={() => {
              setDifficulty("easy");
              dispatch({ type: "restart", seed: (Date.now() * 3) >>> 0, difficulty: "easy" });
            }}
            className={secondary}
          >
            Reapply on Easy
          </button>
        )}
        <Link href="/" className={secondary}>View portfolio</Link>
      </div>
    </Panel>
  );
}

function Victory() {
  const dispatch = useGame((s) => s.dispatch);
  const setDossier = useGame((s) => s.setDossier);
  const difficulty = useGame((s) => s.difficulty);
  const setDifficulty = useGame((s) => s.setDifficulty);
  return (
    <Panel delay={1.4}>
      <p className="text-[10px] uppercase tracking-[0.4em] text-amber-400">Offer extended</p>
      <h2 className="mt-2 font-display text-3xl tracking-[0.1em]">You&apos;re hired.</h2>
      <p className="mt-3 text-sm text-stone-400">
        The full dossier is unlocked. If you got this far, we should probably talk.
      </p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <a className="text-amber-200 underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a>
        {profile.links.map((l) => (
          <a key={l.href} className="text-stone-300 underline underline-offset-4" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
        ))}
      </div>
      <div className="mt-5">
        <AchievementList />
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <button autoFocus onClick={() => setDossier(true)} className={primary}>Open dossier</button>
        {difficulty === "easy" ? (
          <button
            onClick={() => {
              setDifficulty("normal");
              dispatch({ type: "restart", seed: (Date.now() * 13) >>> 0, difficulty: "normal" });
            }}
            className={secondary}
          >
            Try Normal mode
          </button>
        ) : (
          <button onClick={() => dispatch({ type: "restart", seed: (Date.now() * 13) >>> 0 })} className={secondary}>Play again</button>
        )}
      </div>
    </Panel>
  );
}

export function Overlays() {
  const phase = useGame((s) => s.game.phase);
  const dossierOpen = useGame((s) => s.dossierOpen);
  return (
    <AnimatePresence>
      {phase === "intro" && !dossierOpen && <Intro key="intro" />}
      {phase === "roundOver" && !dossierOpen && <RoundOver key="round" />}
      {phase === "gameOver" && !dossierOpen && <GameOver key="over" />}
      {phase === "victory" && !dossierOpen && <Victory key="win" />}
    </AnimatePresence>
  );
}
