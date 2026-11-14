import { create } from "zustand";
import { decide } from "./ai";
import { createGame, reduce } from "./engine";
import { sfx } from "./sound";
import type { Action, GameEvent, GameState } from "./types";

/** Animation timings (ms). Components read these so visuals and game flow stay in sync. */
export const TIMING = {
  load: 3200,
  shot: 1700,
  /** When the trigger is pulled within a shot animation. */
  fireAt: 650,
  item: 1000,
  reloadPause: 700,
  aiThink: 900,
  aiItemThink: 600,
};

function durationFor(e: GameEvent) {
  return e.kind === "load" ? TIMING.load : e.kind === "shot" ? TIMING.shot : TIMING.item;
}

function play(e: GameEvent) {
  const fire = TIMING.fireAt / 1000;
  switch (e.kind) {
    case "load":
      sfx.rack(0.1);
      for (let i = 0; i < e.live + e.blank; i++) sfx.shellDrop(1.6 + i * 0.12);
      sfx.rack(2.6);
      break;
    case "shot":
      sfx.rack(0.05);
      if (e.shell === "live") sfx.blast(fire);
      else sfx.click(fire);
      sfx.shellDrop(fire + 0.4);
      break;
    case "item":
      if (e.item === "coffee") sfx.sip();
      else if (e.item === "hotfix") sfx.rack();
      else sfx.blip();
      break;
  }
}

interface GameStore {
  game: GameState;
  /** True while an event animation is playing; input and the director wait for it. */
  busy: boolean;
  muted: boolean;
  dossierOpen: boolean;
  dispatch: (action: Action) => boolean;
  /** Runs the next automatic step (loading, reloading, Recruiter turn) when idle. Returns a cancel fn. */
  scheduleNext: () => (() => void) | undefined;
  toggleMute: () => void;
  setDossier: (open: boolean) => void;
  /** Index of the open tutorial step, or null when the tour is closed. */
  tutorial: number | null;
  setTutorial: (step: number | null) => void;
  /** Close the tour and remember it was seen. */
  finishTutorial: () => void;
  renderMode: RenderMode;
  /** False until the client has picked a view (saved choice, else 3D when WebGL works). */
  viewReady: boolean;
  initRenderMode: () => void;
  setRenderMode: (mode: RenderMode) => void;
}

export function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export type RenderMode = "3d" | "2d";

const TUTORIAL_KEY = "interview:tutorial-done";
const MODE_KEY = "interview:render-mode";

/** Storage can throw (private mode, blocked site data), so every access is guarded. */
export function readPref(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writePref(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}
export const tutorialSeen = () => readPref(TUTORIAL_KEY) === "1";
export const savedRenderMode = (): RenderMode | null => {
  const v = readPref(MODE_KEY);
  return v === "2d" || v === "3d" ? v : null;
};

let busyTimer: ReturnType<typeof setTimeout> | undefined;

export const useGame = create<GameStore>((set, get) => ({
  game: createGame(1),
  busy: false,
  muted: false,
  dossierOpen: false,
  tutorial: null,
  renderMode: "3d",
  viewReady: false,

  initRenderMode: () => {
    if (get().viewReady) return;
    set({ renderMode: savedRenderMode() ?? (webglAvailable() ? "3d" : "2d"), viewReady: true });
  },
  setTutorial: (step) => set({ tutorial: step }),
  finishTutorial: () => {
    writePref(TUTORIAL_KEY, "1");
    set({ tutorial: null });
  },
  setRenderMode: (mode) => {
    writePref(MODE_KEY, mode);
    set({ renderMode: mode });
  },

  dispatch: (action) => {
    const { game, muted } = get();
    const next = reduce(game, action);
    if (next === game) return false;
    const fresh = next.eventId !== game.eventId && next.event;
    set({ game: next, busy: Boolean(fresh) });
    if (fresh && next.event) {
      if (!muted) play(next.event);
      clearTimeout(busyTimer);
      busyTimer = setTimeout(() => set({ busy: false }), durationFor(next.event));
    }
    return true;
  },

  scheduleNext: () => {
    const { game, busy, dispatch, tutorial } = get();
    // The game waits while the tutorial is open.
    if (busy || tutorial !== null) return;
    let delay: number;
    let action: () => Action;
    if (game.phase === "loading") {
      delay = 0;
      action = () => ({ type: "ready" });
    } else if (game.phase === "reload") {
      delay = TIMING.reloadPause;
      action = () => ({ type: "load" });
    } else if (game.phase === "turn" && game.turn === "recruiter") {
      const firstMove = game.event?.kind !== "item" || game.event.side !== "recruiter";
      delay = firstMove ? TIMING.aiThink : TIMING.aiItemThink;
      action = () => decide(get().game);
    } else {
      return;
    }
    const t = setTimeout(() => dispatch(action()), delay);
    return () => clearTimeout(t);
  },

  toggleMute: () => set((s) => ({ muted: !s.muted })),
  setDossier: (open) => set({ dossierOpen: open }),
}));
