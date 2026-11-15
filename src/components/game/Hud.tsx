"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SECTIONS, funFacts } from "@/content/portfolio";
import { roundsFor } from "@/game/engine";
import { unlockedSections } from "@/game/unlocks";
import { TIMING, useGame } from "@/game/store";
import type { GameEvent } from "@/game/types";
import { ShellGlyph } from "./icons";

export function Composure({ value, max, label, align = "left" }: { value: number; max: number; label: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "flex flex-col items-center" : ""}>
      <div className="mb-1 flex items-baseline gap-2 text-[10px] uppercase tracking-[0.25em] text-stone-400">
        {label}
        <span className="tracking-normal text-stone-500">
          {value}/{max}
        </span>
      </div>
      <div className="flex gap-1" role="meter" aria-label={`${label} composure`} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
        {Array.from({ length: max }, (_, i) => (
          <motion.span
            key={i}
            animate={{ opacity: i < value ? 1 : 0.2, scale: i < value ? 1 : 0.85 }}
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

function MagazinePanel() {
  const shells = useGame((s) => s.game.shells);
  const known = useGame((s) => s.game.known.player);
  const info = useGame((s) => s.game.loadInfo);
  const spent = useGame((s) => s.game.spent);
  const phase = useGame((s) => s.game.phase);
  const loading = phase === "loading";
  const liveLeft = shells.filter((x) => x === "live").length;
  return (
    <div data-tour="magazine" className="rounded-md border border-stone-700/60 bg-black/55 p-2.5 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.25em] text-stone-500">
        <span>Shotgun</span>
        <span className="tracking-normal">{loading ? "loading…" : `${shells.length} left`}</span>
      </div>
      <div className="mt-1 whitespace-nowrap text-[11px] text-stone-300">
        <span className="text-red-400">{info.live} live</span> · <span className="text-sky-300">{info.blank} blank</span>
        <span className="text-stone-500"> loaded</span>
      </div>
      {!loading && (
        <>
          <div className="mt-2 flex items-end gap-1" aria-label={`${shells.length} shells remaining, ${liveLeft} live`}>
            {shells.map((_, i) => (
              <div key={i} className={i === 0 ? "w-5" : "w-3.5"} title={i === 0 ? "Next shell" : undefined}>
                <ShellGlyph kind={known[i] ?? "unknown"} className="w-full" />
              </div>
            ))}
            {spent.length > 0 && <div className="mx-1 h-8 w-px self-center bg-stone-700" />}
            {spent.map((k, i) => (
              <div key={`s${i}`} className="w-2.5" title="Spent">
                <ShellGlyph kind={k} className="w-full" dim />
              </div>
            ))}
          </div>
          <p className="mt-1 text-[10px] text-stone-500">
            <span className="text-red-400/90">{liveLeft} live</span> · <span className="text-sky-300/90">{shells.length - liveLeft} blank</span> remain
          </p>
        </>
      )}
    </div>
  );
}

function captionFor(e: GameEvent, eventId: number): { title: string; detail: string; tone: "live" | "blank" } | null {
  if (e.kind !== "shot") return null;
  const by = e.shooter === "player" ? "You" : "The Recruiter";
  const at = e.target === e.shooter ? (e.shooter === "player" ? "yourself" : "itself") : e.target === "player" ? "you" : "the Recruiter";
  if (e.shell === "live") {
    const hurt = e.target === "player" ? "You lose" : "The Recruiter loses";
    return { title: "LIVE", detail: `${by} shot ${at}. ${hurt} ${e.damage} composure.`, tone: "live" };
  }
  const again = e.target === e.shooter;
  const fact = funFacts[eventId % funFacts.length];
  return {
    title: "BLANK",
    detail: again
      ? `${by} shot ${at} and ${e.shooter === "player" ? "go" : "goes"} again. ${fact}`
      : `${by} shot ${at}. Nothing happens. ${fact}`,
    tone: "blank",
  };
}

/** Big, readable announcement of what the last shot did. */
function Caption() {
  const event = useGame((s) => s.game.event);
  const eventId = useGame((s) => s.game.eventId);
  const [shown, setShown] = useState<{ id: number; c: NonNullable<ReturnType<typeof captionFor>> } | null>(null);

  useEffect(() => {
    if (!event) return;
    const c = captionFor(event, eventId);
    if (!c) return;
    const on = setTimeout(() => setShown({ id: eventId, c }), TIMING.fireAt + 80);
    const off = setTimeout(() => setShown((v) => (v?.id === eventId ? null : v)), TIMING.fireAt + 2600);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [event, eventId]);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          key={shown.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className="pointer-events-none absolute left-1/2 top-[42%] z-20 w-[min(92vw,460px)] -translate-x-1/2 text-center"
          aria-live="assertive"
        >
          <div
            className={`font-display text-5xl tracking-[0.2em] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] sm:text-6xl ${
              shown.c.tone === "live" ? "text-red-400" : "text-sky-300"
            }`}
          >
            {shown.c.title}
          </div>
          <p className="mx-auto mt-2 w-fit rounded bg-black/70 px-3 py-1.5 text-xs leading-relaxed text-stone-200 backdrop-blur sm:text-sm">
            {shown.c.detail}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const chip = "rounded border bg-black/55 px-2.5 py-1.5 text-[11px] uppercase tracking-widest backdrop-blur-sm transition sm:px-3";

export function Hud() {
  const game = useGame((s) => s.game);
  const muted = useGame((s) => s.muted);
  const toggleMute = useGame((s) => s.toggleMute);
  const setDossier = useGame((s) => s.setDossier);
  const setTutorial = useGame((s) => s.setTutorial);
  const renderMode = useGame((s) => s.renderMode);
  const setRenderMode = useGame((s) => s.setRenderMode);
  const unlocked = unlockedSections(game).length;
  const rounds = roundsFor(game.length);
  const playing = game.phase !== "intro";

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:p-4">
        <div className="pointer-events-auto flex min-w-0 flex-col gap-2.5">
          <Link href="/" className={`${chip} w-fit border-stone-600/60 text-stone-300 hover:bg-white/10`}>
            ← Portfolio
          </Link>
          {playing && (
            <>
              <div>
                <div className="font-display text-sm tracking-[0.3em] text-stone-200">
                  ROUND {game.round + 1}
                  <span className="text-stone-500">/{rounds.length}</span>
                </div>
                <div className="mt-1 flex gap-1.5">
                  {rounds.map((_, i) => (
                    <span key={i} className={`h-1.5 w-6 rounded-full ${i < game.roundsWon ? "bg-amber-400" : i === game.round ? "bg-stone-300" : "bg-stone-700"}`} />
                  ))}
                </div>
              </div>
              <MagazinePanel />
            </>
          )}
        </div>

        {playing && (
          <div className="pointer-events-auto absolute right-3 top-[92px] rounded-md bg-black/40 px-3 py-2 backdrop-blur-sm sm:left-1/2 sm:right-auto sm:top-4 sm:-translate-x-1/2">
            <Composure value={game.hp.recruiter} max={game.maxHp.recruiter} label="Recruiter" align="center" />
          </div>
        )}

        <div className="pointer-events-auto flex shrink-0 flex-col items-end gap-2">
          <div className="flex flex-wrap justify-end gap-1.5 sm:gap-2">
            {playing && (
              <button onClick={() => setTutorial(0)} className={`${chip} border-stone-600/60 text-stone-300 hover:bg-white/10`} title="Replay the tutorial">
                ? <span className="hidden sm:inline">How to play</span>
              </button>
            )}
            <button data-tour="dossier" onClick={() => setDossier(true)} className={`${chip} border-amber-300/40 text-amber-200 hover:bg-amber-300/10`}>
              Dossier <span className="text-amber-400/70">{unlocked}/{SECTIONS.length}</span>
            </button>
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            <button onClick={toggleMute} aria-pressed={!muted} className={`${chip} border-stone-600/40 text-stone-400 hover:bg-white/10`}>
              {muted ? "Sound off" : "Sound on"}
            </button>
            <button
              onClick={() => setRenderMode(renderMode === "3d" ? "2d" : "3d")}
              className={`${chip} border-stone-600/40 text-stone-400 hover:bg-white/10`}
              title={renderMode === "3d" ? "Switch to the lightweight 2D view" : "Switch to the 3D view"}
            >
              {renderMode === "3d" ? "3D" : "2D"} view
            </button>
          </div>
        </div>
      </div>

      <Caption />
    </>
  );
}
