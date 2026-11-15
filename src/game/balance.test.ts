import { describe, expect, it } from "vitest";
import { decide } from "./ai";
import { createGame, reduce } from "./engine";
import type { Action, Difficulty, GameState } from "./types";

/**
 * Plays a full game. The player uses the same logic as the AI with a fixed gut-call rate:
 * 0 is a careful player, 0.35 is a casual one who often goes with a hunch.
 */
function playOut(seed: number, difficulty: Difficulty, playerMistakes: number): GameState {
  let s = reduce(createGame(seed, difficulty), { type: "start", seed });
  let x = seed;
  const rand = () => ((x = (x * 16807) % 2147483647) / 2147483647);
  const mistakes = [playerMistakes, playerMistakes, playerMistakes];
  for (let i = 0; i < 3000 && s.phase !== "gameOver" && s.phase !== "victory"; i++) {
    let a: Action;
    if (s.phase === "loading") a = { type: "ready" };
    else if (s.phase === "reload") a = { type: "load" };
    else if (s.phase === "roundOver") a = { type: "nextRound" };
    else if (s.turn === "recruiter") a = decide(s, rand);
    else a = decide(s, rand, "player", mistakes);
    s = reduce(s, a);
  }
  return s;
}

function rates(difficulty: Difficulty, playerMistakes: number) {
  const games = Array.from({ length: 2000 }, (_, i) => playOut(i + 1, difficulty, playerMistakes));
  const clearedR1 = games.filter((g) => g.roundsWon >= 1).length / games.length;
  const won = games.filter((g) => g.phase === "victory").length / games.length;
  console.log(
    `${difficulty} / ${playerMistakes ? "casual" : "careful"} player: cleared R1 ${(clearedR1 * 100).toFixed(1)}%, won ${(won * 100).toFixed(1)}%`,
  );
  return { clearedR1, won };
}

describe("balance", () => {
  it("easy: most visitors clear round 1 and a careful player usually wins", () => {
    const careful = rates("easy", 0);
    const casual = rates("easy", 0.35);
    expect(careful.clearedR1).toBeGreaterThan(0.9);
    expect(careful.won).toBeGreaterThan(0.6);
    expect(casual.clearedR1).toBeGreaterThan(0.75);
    expect(casual.won).toBeGreaterThan(0.3);
  });

  it("normal: a real challenge, but winnable", () => {
    const careful = rates("normal", 0);
    expect(careful.clearedR1).toBeGreaterThan(0.5);
    expect(careful.won).toBeGreaterThan(0.15);
    expect(careful.won).toBeLessThan(0.85);
  });

  it("easy is easier than normal", () => {
    expect(rates("easy", 0.35).won).toBeGreaterThan(rates("normal", 0.35).won);
  });
});
