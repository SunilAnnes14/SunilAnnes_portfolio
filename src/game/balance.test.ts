import { describe, expect, it } from "vitest";
import { decide } from "./ai";
import { createGame, reduce } from "./engine";
import type { Action, GameState } from "./types";

/** Plays a full game with a careful player (same logic as the AI, no gut calls). */
function playOut(seed: number): GameState {
  let s = reduce(createGame(seed), { type: "start", seed });
  let x = seed;
  const rand = () => ((x = (x * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 3000 && s.phase !== "gameOver" && s.phase !== "victory"; i++) {
    let a: Action;
    if (s.phase === "loading") a = { type: "ready" };
    else if (s.phase === "reload") a = { type: "load" };
    else if (s.phase === "roundOver") a = { type: "nextRound" };
    else if (s.turn === "recruiter") a = decide(s, rand);
    else a = decide(s, rand, "player", [0, 0, 0]);
    s = reduce(s, a);
  }
  return s;
}

describe("balance", () => {
  it("a careful player usually clears round 1 and sometimes wins outright", () => {
    const games = Array.from({ length: 2000 }, (_, i) => playOut(i + 1));
    const clearedR1 = games.filter((g) => g.roundsWon >= 1).length / games.length;
    const won = games.filter((g) => g.phase === "victory").length / games.length;
    console.log(`careful player: cleared R1 ${(clearedR1 * 100).toFixed(1)}%, won ${(won * 100).toFixed(1)}%`);
    expect(clearedR1).toBeGreaterThan(0.5);
    expect(won).toBeGreaterThan(0.15);
    expect(won).toBeLessThan(0.85);
  });
});
