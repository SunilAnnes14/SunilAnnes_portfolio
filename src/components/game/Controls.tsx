"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { canUseItem, liveProbability } from "@/game/engine";
import { ITEMS } from "@/game/items";
import { useGame } from "@/game/store";
import { Composure } from "./Hud";
import { ItemIcon } from "./icons";

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return coarse;
}

function TurnBanner() {
  const phase = useGame((s) => s.game.phase);
  const turn = useGame((s) => s.game.turn);
  const busy = useGame((s) => s.busy);
  const skip = useGame((s) => s.game.skip.recruiter);
  let label = "";
  let tone = "border-stone-600 text-stone-300";
  if (phase === "loading") label = "Loading the shotgun";
  else if (phase === "reload") label = "Empty · reloading";
  else if (phase === "turn" && turn === "player") {
    label = busy ? "Your turn" : "Your turn · choose";
    tone = "border-amber-300/70 text-amber-200 shadow-[0_0_20px_rgba(252,211,77,0.25)]";
  } else if (phase === "turn") {
    label = skip ? "Recruiter is stuck in a merge conflict" : "Recruiter's turn";
    tone = "border-red-400/50 text-red-200";
  }
  if (!label) return null;
  return (
    <motion.div
      key={label}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-full border bg-black/60 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.3em] backdrop-blur ${tone}`}
    >
      {label}
    </motion.div>
  );
}

function OddsMeter() {
  const game = useGame((s) => s.game);
  if (game.phase !== "turn") return <div data-tour="odds" className="h-[38px]" />;
  const known = game.known.player[0];
  const p = liveProbability(game, "player");
  const pct = Math.round(p * 100);
  return (
    <div data-tour="odds" className="w-[min(78vw,340px)] rounded-md bg-black/55 px-3 py-1.5 backdrop-blur-sm">
      <div className="flex items-baseline justify-between text-[11px]">
        <span className="uppercase tracking-[0.2em] text-stone-400">Next shell</span>
        {known ? (
          <span className={`font-bold uppercase tracking-widest ${known === "live" ? "text-red-400" : "text-sky-300"}`}>
            {known} <span className="font-normal normal-case tracking-normal text-stone-500">(you know this)</span>
          </span>
        ) : (
          <span className="text-stone-200">
            <span className="text-red-400">{pct}% live</span> · <span className="text-sky-300">{100 - pct}% blank</span>
          </span>
        )}
      </div>
      <div className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-sky-400/60">
        <motion.div className="h-full bg-red-500" animate={{ width: `${known ? (known === "live" ? 100 : 0) : pct}%` }} />
      </div>
    </div>
  );
}

function ItemTray({ myTurn, align = "center" }: { myTurn: boolean; align?: "center" | "left" }) {
  const justify = align === "left" ? "items-start justify-start" : "items-center justify-center";
  const game = useGame((s) => s.game);
  const dispatch = useGame((s) => s.dispatch);
  const coarse = useCoarsePointer();
  const [focus, setFocus] = useState<number | null>(null);
  const items = game.items.player;
  const focused = focus !== null && focus < items.length ? focus : null;
  const meta = focused !== null ? ITEMS[items[focused]] : null;

  const use = (i: number) => {
    dispatch({ type: "useItem", side: "player", slot: i });
    setFocus(null);
  };

  return (
    <div data-tour="items" className={`flex flex-col gap-2 ${align === "left" ? "items-start" : "items-center"}`}>
      <AnimatePresence>
        {meta && focused !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex max-w-[min(92vw,420px)] items-center gap-3 rounded-md border border-stone-600 bg-black/85 px-3 py-2 text-left text-xs text-stone-200 backdrop-blur"
          >
            <div>
              <span className="font-bold text-amber-200">{meta.name}.</span> {meta.effect}
              <span className="block italic text-stone-500">{meta.flavor}</span>
            </div>
            {coarse && (
              <button
                disabled={!(myTurn && canUseItem(game, "player", focused))}
                onClick={() => use(focused)}
                className="shrink-0 rounded border border-amber-300/60 bg-amber-300/15 px-3 py-1.5 font-bold uppercase tracking-widest text-amber-100 disabled:opacity-40"
              >
                Use
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex min-h-[64px] flex-wrap gap-2 ${justify}`} aria-label="Your items">
        {items.length === 0 && <p className="text-[11px] italic text-stone-500">No items. New ones arrive with each reload.</p>}
        <AnimatePresence>
          {items.map((id, i) => {
            const usable = myTurn && canUseItem(game, "player", i);
            return (
              <motion.button
                key={`${id}-${i}`}
                layout
                initial={{ opacity: 0, y: 40, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -60, scale: 1.2 }}
                whileHover={usable ? { y: -6 } : undefined}
                aria-disabled={!usable}
                aria-label={`${ITEMS[id].name}: ${ITEMS[id].effect}`}
                onMouseEnter={() => !coarse && setFocus(i)}
                onMouseLeave={() => !coarse && setFocus(null)}
                onFocus={() => setFocus(i)}
                onBlur={() => !coarse && setFocus(null)}
                onClick={() => {
                  if (coarse && focused !== i) return setFocus(i);
                  if (usable) use(i);
                }}
                className={`relative flex w-[66px] flex-col items-center gap-1 rounded-md border px-1.5 pb-1.5 pt-2 shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition sm:w-[80px] ${
                  focused === i ? "border-amber-300/80" : "border-stone-500/40"
                } ${usable ? "bg-gradient-to-b from-[#2b2e33] to-[#15171a] text-amber-100" : "bg-[#141518] text-stone-500"}`}
              >
                <span className="absolute left-1 top-0.5 text-[9px] text-stone-500">{i + 1}</span>
                <ItemIcon id={id} className="h-6 w-6 sm:h-7 sm:w-7" />
                <span className="text-center text-[9px] uppercase leading-tight tracking-wider sm:text-[10px]">{ITEMS[id].name}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusChips() {
  const skip = useGame((s) => s.game.skip);
  const doubleDamage = useGame((s) => s.game.doubleDamage);
  if (!skip.player && !skip.recruiter && !doubleDamage) return null;
  return (
    <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] uppercase tracking-wider">
      {skip.player && <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-violet-200">You lose next turn</span>}
      {skip.recruiter && <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-violet-200">Recruiter loses next turn</span>}
      {doubleDamage && <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-200">Next live: x2</span>}
    </div>
  );
}

export function Controls() {
  const game = useGame((s) => s.game);
  const busy = useGame((s) => s.busy);
  const dispatch = useGame((s) => s.dispatch);
  const tutorial = useGame((s) => s.tutorial);

  const quizOpen = useGame((s) => s.quiz !== null);
  const myTurn = game.phase === "turn" && game.turn === "player" && !busy && tutorial === null && !quizOpen;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return;
      const s = useGame.getState();
      const k = e.key.toLowerCase();
      if (s.tutorial !== null || s.quiz !== null) return;
      if (k === "d") return s.setDossier(!s.dossierOpen);
      if (s.dossierOpen) return;
      const ready = s.game.phase === "turn" && s.game.turn === "player" && !s.busy;
      if (!ready) return;
      if (k === "o") s.dispatch({ type: "shoot", side: "player", target: "recruiter" });
      else if (k === "s") s.dispatch({ type: "shoot", side: "player", target: "player" });
      else if (/^[1-6]$/.test(k)) s.dispatch({ type: "useItem", side: "player", slot: Number(k) - 1 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (game.phase === "intro") return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 px-3 pb-3 sm:pb-4">
      <div className="pointer-events-auto lg:hidden">
        <ItemTray myTurn={myTurn} />
      </div>

      <div className="flex w-full max-w-7xl items-end justify-center gap-3 sm:justify-between">
        {/* left column (tablet and up): items on wide screens, then your composure */}
        <div className="pointer-events-auto hidden shrink-0 flex-col gap-2 sm:flex lg:w-72">
          <div className="hidden lg:block">
            <ItemTray myTurn={myTurn} align="left" />
          </div>
          <div data-tour="hp" className="w-56 rounded-md bg-black/40 p-2 backdrop-blur-sm">
            <Composure value={game.hp.player} max={game.maxHp.player} label="You" />
            <StatusChips />
          </div>
        </div>

        <div className="pointer-events-auto flex w-full flex-col items-center gap-2 sm:w-auto">
          {/* phones: composure sits beside the turn banner */}
          <div className="flex w-full items-end justify-between gap-2 sm:hidden">
            <div data-tour="hp" className="rounded-md bg-black/40 p-1.5 backdrop-blur-sm">
              <Composure value={game.hp.player} max={game.maxHp.player} label="You" />
            </div>
            <TurnBanner />
          </div>
          <div className="hidden sm:block">
            <TurnBanner />
          </div>
          <div className="sm:hidden">
            <StatusChips />
          </div>
          <OddsMeter />
          <div data-tour="actions" className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-3">
            <button
              disabled={!myTurn}
              onClick={() => dispatch({ type: "shoot", side: "player", target: "recruiter" })}
              className="flex flex-col items-center rounded-md border border-red-400/50 bg-gradient-to-b from-[#5a1a16] to-[#2a0b09] px-3 py-2 text-red-100 shadow-[0_0_24px_rgba(200,40,30,0.25)] transition enabled:hover:brightness-125 disabled:opacity-35 sm:px-6 sm:py-2.5"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
                Shoot Recruiter <kbd className="ml-1 hidden text-red-300/60 sm:inline">O</kbd>
              </span>
              <span className="mt-0.5 text-[10px] normal-case tracking-normal text-red-200/70">Live: it loses 1 · then its turn</span>
            </button>
            <button
              disabled={!myTurn}
              onClick={() => dispatch({ type: "shoot", side: "player", target: "player" })}
              className="flex flex-col items-center rounded-md border border-stone-400/40 bg-gradient-to-b from-[#2d3035] to-[#16181b] px-3 py-2 text-stone-100 transition enabled:hover:brightness-125 disabled:opacity-35 sm:px-6 sm:py-2.5"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
                Shoot Yourself <kbd className="ml-1 hidden text-stone-400/60 sm:inline">S</kbd>
              </span>
              <span className="mt-0.5 text-[10px] normal-case tracking-normal text-stone-400">Blank: you go again</span>
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
    <div className="pointer-events-auto hidden w-56 shrink-0 rounded border border-stone-700/50 bg-black/60 p-2 font-mono text-[10.5px] leading-snug backdrop-blur-sm lg:block lg:w-72">
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
