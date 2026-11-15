import { create } from "zustand";
import { QUIZ, type QuizQuestion } from "@/content/quiz";
import { pickLine, type LineKey } from "@/content/recruiterLines";
import { ACHIEVEMENTS, earnedBy, freshStats, type Achievement, type RunStats } from "./achievements";
import { decide } from "./ai";
import { canGrantItem, createGame, reduce, roundsFor } from "./engine";
import { ITEMS } from "./items";
import { sfx } from "./sound";
import type { Action, Difficulty, GameEvent, GameLength, GameState, ItemId } from "./types";

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

export interface QuizState {
  question: QuizQuestion;
  /** Option the player picked, once answered. */
  picked: number | null;
  /** Item granted for a correct answer (null if wrong, or no room on the desk). */
  reward: ItemId | null;
}

export interface Bubble {
  id: number;
  text: string;
  /** Wait before showing, e.g. until a shot's outcome is visible. */
  delay: number;
}

export type RenderMode = "3d" | "2d";

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
  /** False until the client has read saved preferences and picked a view. */
  viewReady: boolean;
  /** Read saved preferences (view, difficulty, achievements) once on the client. */
  initClient: () => void;
  setRenderMode: (mode: RenderMode) => void;

  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  /** Quick (one round) or Full (three rounds). */
  length: GameLength;
  setLength: (l: GameLength) => void;

  /** Pop quiz between reloads; the game pauses while it's open. */
  quiz: QuizState | null;
  answerQuiz: (option: number) => void;
  closeQuiz: () => void;

  /** The Recruiter's current speech bubble. */
  bubble: Bubble | null;
  poke: () => void;

  /** Unlocked achievement ids, saved in the browser. */
  unlocked: string[];
  /** Achievements unlocked this session that still need a toast. */
  toasts: Achievement[];
  dismissToast: (id: string) => void;
}

export function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

const TUTORIAL_KEY = "interview:tutorial-done";
const MODE_KEY = "interview:render-mode";
const DIFFICULTY_KEY = "interview:difficulty";
const LENGTH_KEY = "interview:length";
const ACHIEVEMENTS_KEY = "interview:achievements";

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
// Session-only counters that don't need to trigger renders.
let loadsThisGame = 0;
let bubbleSeq = 0;
let pokes = 0;
let stats: RunStats = freshStats();
const askedQuiz = new Set<string>();

function nextQuestion(): QuizQuestion {
  let pool = QUIZ.filter((q) => !askedQuiz.has(q.id));
  if (pool.length === 0) {
    askedQuiz.clear();
    pool = QUIZ;
  }
  const q = pool[Math.floor(Math.random() * pool.length)];
  askedQuiz.add(q.id);
  return q;
}

/** What the Recruiter says about a state transition, if anything. */
function lineFor(prev: GameState, next: GameState, action: Action): { key: LineKey; seed: number; delay: number } | null {
  const seed = next.eventId + next.round;
  if ((action.type === "start" || action.type === "restart") && next !== prev) return { key: "gameStart", seed, delay: 300 };
  if (action.type === "nextRound" && next !== prev) return { key: "roundStart", seed: next.round - 1, delay: 300 };
  const e = next.event;
  if (!e || next.eventId === prev.eventId) return null;
  if (e.kind === "load" && action.type === "load") return { key: "reload", seed, delay: 400 };
  const after = TIMING.fireAt + 250;
  if (e.kind === "shot") {
    if (next.phase === "gameOver" || next.phase === "roundOver" || next.phase === "victory") return null;
    if (e.shell === "live" && e.target === "player") {
      if (next.hp.player === 1) return { key: "playerLowHp", seed, delay: after };
      return { key: e.shooter === "player" ? "playerHitSelf" : "playerHit", seed, delay: after };
    }
    if (e.shell === "live" && e.target === "recruiter") return { key: "recruiterHit", seed, delay: after };
    if (e.shooter === "player" && e.target === "player") return { key: "playerBlankSelf", seed, delay: after };
    if (e.shooter === "recruiter" && e.target === "recruiter") return { key: "recruiterBlankSelf", seed, delay: after };
    return null;
  }
  if (e.kind === "item") return { key: e.side === "recruiter" ? "recruiterItem" : "playerItem", seed, delay: 150 };
  return null;
}

export const useGame = create<GameStore>((set, get) => {
  const say = (text: string, delay = 0) => set({ bubble: { id: ++bubbleSeq, text, delay } });

  const unlock = (ids: string[]) => {
    const { unlocked, toasts } = get();
    const fresh = ids.filter((id, i) => !unlocked.includes(id) && ids.indexOf(id) === i);
    if (fresh.length === 0) return;
    const all = [...unlocked, ...fresh];
    writePref(ACHIEVEMENTS_KEY, JSON.stringify(all));
    set({ unlocked: all, toasts: [...toasts, ...ACHIEVEMENTS.filter((a) => fresh.includes(a.id))] });
  };

  return {
    game: createGame(1, "easy", "quick"),
    busy: false,
    muted: false,
    dossierOpen: false,
    tutorial: null,
    renderMode: "3d",
    viewReady: false,
    difficulty: "easy",
    length: "quick",
    quiz: null,
    bubble: null,
    unlocked: [],
    toasts: [],

    initClient: () => {
      if (get().viewReady) return;
      const d = readPref(DIFFICULTY_KEY);
      let unlocked: string[] = [];
      try {
        const parsed: unknown = JSON.parse(readPref(ACHIEVEMENTS_KEY) ?? "[]");
        if (Array.isArray(parsed)) unlocked = parsed.filter((x): x is string => typeof x === "string");
      } catch {
        /* ignore corrupt data */
      }
      set({
        renderMode: savedRenderMode() ?? (webglAvailable() ? "3d" : "2d"),
        difficulty: d === "normal" ? "normal" : "easy",
        length: readPref(LENGTH_KEY) === "full" ? "full" : "quick",
        unlocked,
        viewReady: true,
      });
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
    setDifficulty: (d) => {
      writePref(DIFFICULTY_KEY, d);
      set({ difficulty: d });
    },
    setLength: (l) => {
      writePref(LENGTH_KEY, l);
      // On the intro screen, show the chosen length straight away (round count, dossier hints).
      set((s) => ({ length: l, game: s.game.phase === "intro" ? { ...s.game, length: l } : s.game }));
    },

    dispatch: (action) => {
      const { game, muted } = get();
      // New interviews use the chosen difficulty.
      const act: Action =
        action.type === "start" || action.type === "restart"
          ? { ...action, difficulty: action.difficulty ?? get().difficulty, length: action.length ?? get().length }
          : action;
      const next = reduce(game, act);
      if (next === game) return false;

      if (act.type === "start" || act.type === "restart") {
        stats = freshStats();
        loadsThisGame = 0;
      }
      if (act.type === "nextRound") stats.damageTakenThisRound = 0;
      const e = next.event;
      const fresh = next.eventId !== game.eventId && e;
      if (fresh && e?.kind === "shot" && e.target === "player") stats.damageTakenThisRound += e.damage;
      if (fresh && e?.kind === "load") loadsThisGame += 1;

      set({ game: next, busy: Boolean(fresh) });
      if (fresh && e) {
        if (!muted) play(e);
        clearTimeout(busyTimer);
        busyTimer = setTimeout(() => set({ busy: false }), durationFor(e));
      }

      const line = lineFor(game, next, act);
      if (line) say(pickLine(line.key, line.seed), line.delay);

      // Every second load, the Recruiter pops a quiz question before play resumes.
      if (act.type === "ready" && loadsThisGame >= 2 && loadsThisGame % 2 === 0 && get().tutorial === null) {
        set({ quiz: { question: nextQuestion(), picked: null, reward: null } });
      }

      unlock(earnedBy(game, next, stats));
      return true;
    },

    answerQuiz: (option) => {
      const { quiz, game, dispatch } = get();
      if (!quiz || quiz.picked !== null) return;
      const correct = option === quiz.question.answer;
      let reward: ItemId | null = null;
      if (correct) {
        stats.quizCorrect += 1;
        if (canGrantItem(game, "player")) {
          const pool = roundsFor(game.length)[game.round].pool;
          reward = pool[Math.floor(Math.random() * pool.length)];
          dispatch({ type: "grantItem", side: "player", item: reward, reason: "Quiz answered" });
          if (!get().muted) sfx.sip();
        }
        say(reward ? `Correct. Take a ${ITEMS[reward].name}.` : "Correct. Your desk is full, though.");
        unlock(earnedBy(game, get().game, stats));
      } else {
        if (!get().muted) sfx.thud();
        say("Wrong. I'll be noting that.");
      }
      set({ quiz: { ...quiz, picked: option, reward } });
    },
    closeQuiz: () => set({ quiz: null }),

    poke: () => {
      pokes += 1;
      if (!get().muted) sfx.blip();
      say(pickLine("poke", pokes));
    },

    dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

    scheduleNext: () => {
      const { game, busy, dispatch, tutorial, quiz } = get();
      // The game waits while the tutorial or a quiz is open.
      if (busy || tutorial !== null || quiz !== null) return;
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
  };
});
