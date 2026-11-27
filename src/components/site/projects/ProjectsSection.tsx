"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { LayoutGroup, MotionConfig, useInView } from "motion/react";
import type { ShellProject } from "@/content/projectHighlights";
import { sfx, unlockAudio } from "@/game/sound";
import { LOAD_SHELL_EVENT } from "../fx/events";
import { Chamber } from "./Chamber";
import { Dossier } from "./Dossier";
import { Shell } from "./Shell";
import { useSoundSetting, useTabVisible } from "./soundPreference";

const EJECT_MS = 400;
const AUTO_LOAD_DELAY_MS = 600;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function SpeakerToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!on) unlockAudio();
        onChange(!on);
      }}
      aria-pressed={on}
      aria-label={on ? "Turn shell loader sounds off" : "Turn shell loader sounds on"}
      title={on ? "Sound on" : "Sound off"}
      className="grid h-8 w-8 shrink-0 place-items-center rounded border border-stone-700 text-stone-400 outline-none transition-colors hover:text-stone-100 focus-visible:ring-2 focus-visible:ring-amber-300/80"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 9h4l5-4v14l-5-4H4z" />
        {on ? <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="M17 9l5 6M22 9l-5 6" />}
      </svg>
    </button>
  );
}

/**
 * Shell Loader: each project is a shell on a table. Picking one flies it into the chamber,
 * pumps the action, and boots the dossier with the project and a looping mini demo.
 */
export function ProjectsSection({ projects, moreUrl }: { projects: ShellProject[]; moreUrl: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  /** The shell in the chamber right now. */
  const [loadedId, setLoadedId] = useState<string | null>(null);
  /** The shell being loaded or already loaded: PREV/NEXT count from this, so they stay correct mid-eject. */
  const [targetId, setTargetId] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);
  const [sound, setSound] = useSoundSetting();
  const tabVisible = useTabVisible();
  const halfInView = useInView(sectionRef, { amount: 0.5, once: true });
  const onScreen = useInView(sectionRef, { amount: 0.05 });

  const pending = useRef<number | null>(null);
  const userActed = useRef(false);
  const autoLoaded = useRef(false);

  const index = projects.findIndex((p) => p.id === loadedId);
  const loaded = index >= 0 ? projects[index] : null;
  const targetIndex = projects.findIndex((p) => p.id === targetId);

  const clearPending = () => {
    if (pending.current !== null) window.clearTimeout(pending.current);
    pending.current = null;
  };
  useEffect(() => clearPending, []);

  /** Load a shell (or null to unload). A different loaded shell is ejected back to the table first. */
  const load = useCallback(
    (id: string | null) => {
      clearPending();
      setTargetId(id);
      if (loadedId && id && id !== loadedId && !reducedMotion()) {
        setLoadedId(null);
        if (sound) sfx.shellDrop();
        pending.current = window.setTimeout(() => {
          pending.current = null;
          setLoadedId(id);
        }, EJECT_MS);
        return;
      }
      if (!id && loadedId && sound) sfx.shellDrop();
      setLoadedId(id);
    },
    [loadedId, sound],
  );

  const pick = useCallback(
    (id: string | null) => {
      userActed.current = true; // cancels a pending auto-load
      load(id);
    },
    [load],
  );

  const step = (dir: 1 | -1) => {
    const n = projects.length;
    const next = targetIndex < 0 ? (dir === 1 ? 0 : n - 1) : (targetIndex + dir + n) % n;
    pick(projects[next].id);
  };

  // The command terminal can load a shell by id (it also scrolls here).
  useEffect(() => {
    const onLoad = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (projects.some((p) => p.id === id)) pick(id);
    };
    window.addEventListener(LOAD_SHELL_EVENT, onLoad);
    return () => window.removeEventListener(LOAD_SHELL_EVENT, onLoad);
  }, [pick, projects]);

  // Auto-load the first shell once, the first time half the section is visible.
  useEffect(() => {
    if (!halfInView || autoLoaded.current || userActed.current || projects.length === 0) return;
    const t = window.setTimeout(() => {
      if (userActed.current) return;
      autoLoaded.current = true;
      setLoadedId(projects[0].id);
      setTargetId(projects[0].id);
      setPulse((p) => p + 1); // the other shells pulse once to hint they're clickable
    }, AUTO_LOAD_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [halfInView, projects]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Escape" && (loadedId || targetId)) {
      pick(null);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div ref={sectionRef} onKeyDown={onKeyDown} className="relative">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-stone-400">
            Pick a shell to load it.
            <span className="hidden text-stone-600 sm:inline"> Arrow keys switch, Esc unloads.</span>
          </p>
          <SpeakerToggle on={sound} onChange={setSound} />
        </div>

        <LayoutGroup>
          <div className="mt-6 flex flex-col gap-6">
            {/* Chamber and dossier sit above the table on desktop and below it on small screens. */}
            <div className="order-2 grid gap-5 lg:order-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
              <Chamber loaded={loaded} soundOn={sound} />
              <Dossier
                project={loaded}
                slot={index}
                paused={!onScreen || !tabVisible}
                soundOn={sound}
                onPrev={() => step(-1)}
                onNext={() => step(1)}
                onUnload={() => pick(null)}
              />
            </div>

            <div className="order-1 lg:order-2">
              <div
                className="rounded-xl border border-[#3a2616] p-3 shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)] sm:p-4"
                style={{ background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 34px), linear-gradient(180deg, #4a2d18, #2e1b0e)" }}
              >
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {projects.map((p, i) => (
                    <Shell
                      key={p.id}
                      project={p}
                      index={i}
                      loaded={p.id === loadedId}
                      pulse={p.id === projects[0].id ? 0 : pulse}
                      onPick={(id) => pick(id === targetId ? null : id)}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] text-stone-500">
                <span className="text-red-400">Red</span> = shipped · <span className="text-slate-300">Grey</span> = in progress
              </p>
            </div>
          </div>
        </LayoutGroup>

        <p className="sr-only" aria-live="polite">
          {loaded ? `Loaded ${loaded.title}. ${loaded.status === "live" ? "Shipped" : "In progress"}.` : "Chamber empty."}
        </p>

        <a
          href={moreUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block text-sm text-stone-400 underline-offset-4 hover:text-stone-100 hover:underline"
        >
          More projects on GitHub →
        </a>
      </div>
    </MotionConfig>
  );
}
