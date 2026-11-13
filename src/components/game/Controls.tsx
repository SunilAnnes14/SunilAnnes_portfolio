"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { canUseItem, liveProbability } from "@/game/engine";
import { ITEMS } from "@/game/items";
import { useGame } from "@/game/store";
import { Composure } from "./Hud";
import { ItemIcon } from "./icons";

function statusLine(phase: string, turn: string, busy: boolean, skip: boolean) {
  if (phase === "loading") return "Loading the shotgun…";
  if (phase === "reload") return "Empty. Reloading…";
  if (phase !== "turn") return "";
  if (busy) return "…";
  if (turn === "player") return "Your move.";
  return skip ? "Resolving merge conflict…" : "The Recruiter is deciding…";
}

export function Controls() {
  const game = useGame((s) => s.game);
  const busy = useGame((s) => s.busy);
  const dispatch = useGame((s) => s.dispatch);
  const dossierOpen = useGame((s) => s.dossierOpen);
  const setDossier = useGame((s) => s.setDossier);

  const myTurn = game.phase === "turn" && game.turn === "player" && !busy;
  const chamber = game.known.player[0];
  const odds = game.phase === "turn" ? liveProbability(game, "player") : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "d") return setDossier(!dossierOpen);
      if (dossierOpen) return;
      const s = useGame.getState();
      const ready = s.game.phase === "turn" && s.game.turn === "player" && !s.busy;
      if (!ready) return;
      if (k === "o") s.dispatch({ type: "shoot", side: "player", target: "recruiter" });
      else if (k === "s") s.dispatch({ type: "shoot", side: "player", target: "player" });
      else if (/^[1-6]$/.test(k)) s.dispatch({ type: "useItem", side: "player", slot: Number(k) - 1 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dossierOpen, setDossier]);

  if (game.phase === "intro") return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-3 pb-3 sm:pb-5">
      {/* items */}
      <div className="flex flex-wrap justify-center gap-2" aria-label="Your items">
        <AnimatePresence>
          {game.items.player.map((id, i) => {
            const usable = myTurn && canUseItem(game, "player", i);
            return (
              <motion.button
                key={`${id}-${i}`}
                layout
                initial={{ opacity: 0, y: 40, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -60, scale: 1.2 }}
                whileHover={usable ? { y: -6 } : undefined}
                disabled={!usable}
                onClick={() => dispatch({ type: "useItem", side: "player", slot: i })}
                className="group relative flex w-[68px] flex-col items-center gap-1 rounded-md border border-stone-500/40 bg-gradient-to-b from-[#26292e] to-[#141619] px-1.5 pb-1.5 pt-2 text-amber-100 shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition enabled:hover:border-amber-300/60 disabled:opacity-45 sm:w-[84px]"
              >
                <span className="absolute left-1 top-0.5 text-[9px] text-stone-500">{i + 1}</span>
                <ItemIcon id={id} className="h-6 w-6 sm:h-7 sm:w-7" />
                <span className="text-center text-[9px] leading-tight uppercase tracking-wider text-stone-300 sm:text-[10px]">
                  {ITEMS[id].name}
                </span>
                {/* tooltip */}
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-52 -translate-x-1/2 rounded border border-stone-600 bg-black/95 p-2 text-left text-[11px] normal-case leading-snug tracking-normal text-stone-200 shadow-xl group-hover:block group-focus-visible:block">
                  <span className="block font-bold text-amber-200">{ITEMS[id].name}</span>
                  {ITEMS[id].effect}
                  <span className="mt-1 block italic text-stone-500">{ITEMS[id].flavor}</span>
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex w-full max-w-5xl items-end justify-between gap-3">
        <div className="w-28 shrink-0 sm:w-56">
          <Composure value={game.hp.player} max={game.maxHp} label="You" />
          <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] uppercase tracking-wider">
            {game.skip.player && <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-violet-200">Turn blocked</span>}
            {game.skip.recruiter && <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-violet-200">Recruiter blocked</span>}
            {game.doubleDamage && <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-200">x2 damage</span>}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="h-5 text-center text-xs text-stone-300 sm:text-sm" aria-live="polite">
            {statusLine(game.phase, game.turn, busy, game.skip.recruiter)}
            {myTurn && chamber && (
              <span className={`ml-2 font-bold ${chamber === "live" ? "text-red-400" : "text-sky-300"}`}>
                Chamber: {chamber.toUpperCase()}
              </span>
            )}
            {myTurn && !chamber && odds !== null && (
              <span className="ml-2 text-stone-500">({Math.round(odds * 100)}% live)</span>
            )}
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              disabled={!myTurn}
              onClick={() => dispatch({ type: "shoot", side: "player", target: "recruiter" })}
              className="rounded-md border border-red-400/40 bg-gradient-to-b from-[#5a1a16] to-[#2a0b09] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-red-100 shadow-[0_0_24px_rgba(200,40,30,0.25)] transition enabled:hover:brightness-125 disabled:opacity-35 sm:px-6 sm:py-3 sm:text-sm"
            >
              Shoot Recruiter <kbd className="ml-1 hidden text-red-300/60 sm:inline">O</kbd>
            </button>
            <button
              disabled={!myTurn}
              onClick={() => dispatch({ type: "shoot", side: "player", target: "player" })}
              className="rounded-md border border-stone-400/30 bg-gradient-to-b from-[#2d3035] to-[#16181b] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-stone-200 transition enabled:hover:brightness-125 disabled:opacity-35 sm:px-6 sm:py-3 sm:text-sm"
            >
              Shoot Yourself <kbd className="ml-1 hidden text-stone-400/60 sm:inline">S</kbd>
            </button>
          </div>
        </div>

        <TranscriptLog />
      </div>
    </div>
  );
}

const TONE: Record<string, string> = {
  danger: "text-red-300",
  safe: "text-sky-200",
  info: "text-amber-100/80",
};

function TranscriptLog() {
  const log = useGame((s) => s.game.log);
  const recent = log.slice(-5);
  return (
    <div className="hidden w-56 shrink-0 rounded border border-stone-700/50 bg-black/55 p-2 font-mono text-[10.5px] leading-snug backdrop-blur-sm md:block lg:w-72">
      <div className="mb-1 text-[9px] uppercase tracking-[0.3em] text-stone-500">Transcript</div>
      <ol aria-live="polite" className="space-y-0.5">
        {recent.map((l) => (
          <motion.li key={l.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className={TONE[l.tone ?? ""] ?? "text-stone-400"}>
            <span className="text-stone-600">›</span> {l.text}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
