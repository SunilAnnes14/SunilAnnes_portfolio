import { describe, expect, it } from "vitest";
import { earnedBy, freshStats } from "./achievements";
import { ROUNDS, createGame, reduce } from "./engine";
import type { GameState, Shell } from "./types";

function inTurn(shells: Shell[], patch: Partial<GameState> = {}): GameState {
  const s = reduce(reduce(createGame(3), { type: "start", seed: 3 }), { type: "ready" });
  return {
    ...s,
    shells,
    known: { player: shells.map(() => null), recruiter: shells.map(() => null) },
    items: { player: [], recruiter: [] },
    turn: "player",
    ...patch,
  };
}

describe("achievements", () => {
  it("first day when an interview starts", () => {
    const intro = createGame(1);
    expect(earnedBy(intro, reduce(intro, { type: "start", seed: 1 }), freshStats())).toContain("first-day");
  });

  it("blank check for a blank at yourself", () => {
    const s = inTurn(["blank", "live"]);
    expect(earnedBy(s, reduce(s, { type: "shoot", side: "player", target: "player" }), freshStats())).toContain("blank-check");
  });

  it("calculated only when you knew the shell was live", () => {
    const blind = inTurn(["live", "blank"]);
    const shot = (s: GameState) => earnedBy(s, reduce(s, { type: "shoot", side: "player", target: "recruiter" }), freshStats());
    expect(shot(blind)).not.toContain("calculated");
    const known = { ...blind, known: { player: ["live", null] as (Shell | null)[], recruiter: [null, null] as (Shell | null)[] } };
    expect(shot(known)).toContain("calculated");
  });

  it("flawless and clutch on winning a round", () => {
    const s = inTurn(["live", "blank"], { hp: { player: 3, recruiter: 1 } });
    const won = reduce(s, { type: "shoot", side: "player", target: "recruiter" });
    expect(earnedBy(s, won, freshStats())).toContain("flawless");
    const tight = inTurn(["live", "blank"], { hp: { player: 1, recruiter: 1 } });
    const tightWin = reduce(tight, { type: "shoot", side: "player", target: "recruiter" });
    const got = earnedBy(tight, tightWin, { damageTakenThisRound: 2, quizCorrect: 0 });
    expect(got).toContain("clutch");
    expect(got).not.toContain("flawless");
  });

  it("hired on winning the last round", () => {
    const s = inTurn(["live", "blank"], { round: ROUNDS.length - 1, hp: { player: 2, recruiter: 1 } });
    expect(earnedBy(s, reduce(s, { type: "shoot", side: "player", target: "recruiter" }), freshStats())).toContain("hired");
  });

  it("know-it-all after three correct quiz answers", () => {
    const s = createGame(1);
    expect(earnedBy(s, s, { damageTakenThisRound: 0, quizCorrect: 3 })).toContain("know-it-all");
  });
});
