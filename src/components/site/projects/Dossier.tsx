"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ShellProject } from "@/content/projectHighlights";
import { sfx } from "@/game/sound";
import { PUMP_AT } from "./Chamber";
import { MiniDemo } from "./MiniDemo";

/** Screen boot after the pump: flicker on, print LOADING, fill a bar, then reveal. */
const BOOT_START = PUMP_AT + 0.15; // seconds
const BOOT_MS = 1150;

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const control =
  "rounded border border-stone-700 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-300 transition-colors hover:border-amber-300/60 hover:text-amber-100 outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80 disabled:opacity-40";

function DossierScreen({ project, paused, soundOn }: { project: ShellProject; paused: boolean; soundOn: boolean }) {
  // Mounted only after a shell is picked (client only), so reading the media query here can't cause a hydration mismatch.
  const [stage, setStage] = useState<"boot" | "ready">(() => (reducedMotion() ? "ready" : "boot"));
  const soundRef = useRef(soundOn);
  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    if (stage === "ready") return;
    const t = window.setTimeout(() => {
      setStage("ready");
      if (soundRef.current) sfx.blip();
    }, BOOT_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  if (stage === "boot") {
    return (
      <motion.div
        key="boot"
        className="flex h-full flex-col justify-center gap-3 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 0.25, 1] }}
        transition={{ duration: 0.35, times: [0, 0.01, 0.4, 0.6, 1], delay: BOOT_START }}
      >
        <p className="text-sm tracking-[0.15em] text-amber-200">LOADING {project.title.toUpperCase()}…</p>
        <div className="h-1.5 w-full max-w-xs overflow-hidden rounded bg-stone-800">
          <motion.div
            className="h-full w-full origin-left bg-amber-300"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: BOOT_START + 0.3, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    );
  }

  const live = project.href && !project.href.startsWith("/") ? project.href : null;
  return (
    <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-2xl text-stone-50">{project.title}</h3>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
            project.status === "live" ? "bg-red-500/15 text-red-300" : "bg-slate-400/15 text-slate-300"
          }`}
        >
          {project.status === "live" ? "Live · shipped" : "Blank · in progress"}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-stone-300">{project.description}</p>

      <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
        <p className="shrink-0">
          <span className="block font-display text-3xl leading-none text-amber-200">{project.stat.value}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">{project.stat.label}</span>
        </p>
        <motion.ul
          className="flex flex-wrap gap-1.5"
          aria-label="Tech stack"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
        >
          {project.stack.map((t) => (
            <motion.li
              key={t}
              variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
              className="rounded border border-stone-700 px-2 py-0.5 text-[10px] uppercase tracking-wider text-stone-300"
            >
              {t}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <MiniDemo kind={project.demo} paused={paused} label={`Animated sketch of ${project.title}`} />

      <div className="flex flex-wrap gap-2">
        {project.repo && (
          <a className={control} href={project.repo} target="_blank" rel="noreferrer">
            Code
          </a>
        )}
        {live && (
          <a className={`${control} border-amber-300/50 text-amber-100`} href={live} target="_blank" rel="noreferrer">
            Live →
          </a>
        )}
      </div>
    </motion.div>
  );
}

interface DossierProps {
  project: ShellProject | null;
  slot: number;
  paused: boolean;
  soundOn: boolean;
  onPrev: () => void;
  onNext: () => void;
  onUnload: () => void;
}

/** The dossier screen beside the chamber. Fixed minimum height, so loading never shifts the page. */
export function Dossier({ project, slot, paused, soundOn, onPrev, onNext, onUnload }: DossierProps) {
  return (
    <div
      className="relative flex min-h-[560px] flex-col overflow-hidden rounded-xl border border-stone-700 bg-[#0a0b0a] p-4 sm:min-h-[520px] sm:p-5"
      style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 3px)" }}
    >
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-stone-500">
        <span>Dossier</span>
        <span>{project ? `ROM-0${slot + 1}` : "—"}</span>
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {project ? (
            <motion.div key={project.id} className="h-full" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
              <DossierScreen project={project} paused={paused} soundOn={soundOn} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="grid h-full min-h-[380px] place-items-center text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <div>
                <motion.p
                  className="font-mono text-xl tracking-[0.35em] text-stone-500"
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  CHAMBER EMPTY
                </motion.p>
                <p className="mt-2 text-xs text-stone-600">Pick a shell from the table.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-stone-800 pt-3">
        <div className="flex gap-2">
          <button type="button" className={control} onClick={onPrev} aria-label="Load previous project">
            ← Prev
          </button>
          <button type="button" className={control} onClick={onNext} aria-label="Load next project">
            Next →
          </button>
        </div>
        <button type="button" className={control} onClick={onUnload} disabled={!project} aria-label="Unload the chamber">
          Unload
        </button>
      </div>
    </div>
  );
}
