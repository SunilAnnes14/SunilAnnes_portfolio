import type { GameState } from "./types";

export interface Achievement {
  id: string;
  name: string;
  how: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-day", name: "First Day", how: "Start an interview." },
  { id: "blank-check", name: "Blank Check", how: "Shoot yourself with a blank and keep your turn." },
  { id: "calculated", name: "Calculated", how: "Shoot the Recruiter with a shell you knew was live." },
  { id: "friday-deploy", name: "Deploy on Friday", how: "Land a double-damage shot." },
  { id: "know-it-all", name: "Know-It-All", how: "Answer 3 pop-quiz questions correctly in one interview." },
  { id: "flawless", name: "Flawless", how: "Win a round without losing composure." },
  { id: "clutch", name: "Clutch Hire", how: "Win a round on your last point of composure." },
  { id: "hired", name: "Hired", how: "Win the whole interview." },
];

/** Per-interview counters the checks need beyond the game state itself. */
export interface RunStats {
  damageTakenThisRound: number;
  quizCorrect: number;
}

export const freshStats = (): RunStats => ({ damageTakenThisRound: 0, quizCorrect: 0 });

/** Achievements earned by the transition from `prev` to `next`. */
export function earnedBy(prev: GameState, next: GameState, stats: RunStats): string[] {
  const out: string[] = [];
  const started = next.phase === "loading" && next.round === 0 && ["intro", "gameOver", "victory"].includes(prev.phase);
  if (started) out.push("first-day");
  const e = next.event;
  if (e && next.eventId !== prev.eventId && e.kind === "shot" && e.shooter === "player") {
    if (e.target === "player" && e.shell === "blank") out.push("blank-check");
    if (e.target === "recruiter" && e.shell === "live" && prev.known.player[0] === "live") out.push("calculated");
    if (e.target === "recruiter" && e.damage >= 2) out.push("friday-deploy");
  }
  const wonRound = (next.phase === "roundOver" || next.phase === "victory") && next.phase !== prev.phase;
  if (wonRound) {
    if (stats.damageTakenThisRound === 0) out.push("flawless");
    if (next.hp.player === 1) out.push("clutch");
    if (next.phase === "victory") out.push("hired");
  }
  if (stats.quizCorrect >= 3) out.push("know-it-all");
  return out;
}
