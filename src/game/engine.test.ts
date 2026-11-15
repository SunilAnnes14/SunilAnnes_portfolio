import { describe, expect, it } from "vitest";
import { decide } from "./ai";
import { DIFFICULTY, ROUNDS, canGrantItem, canUseItem, createGame, liveProbability, reduce } from "./engine";
import type { Action, GameState, ItemId, Shell, Side } from "./types";

/** A game in the "turn" phase with a rigged magazine and inventories. */
function rig(opts: {
  shells: Shell[];
  turn?: Side;
  items?: Partial<Record<Side, ItemId[]>>;
  hp?: Partial<Record<Side, number>>;
  round?: number;
}): GameState {
  let s = reduce(createGame(42), { type: "start", seed: 42 });
  s = reduce(s, { type: "ready" });
  const round = opts.round ?? 0;
  return {
    ...s,
    round,
    maxHp: { player: ROUNDS[round].hp, recruiter: ROUNDS[round].hp },
    hp: { player: ROUNDS[round].hp, recruiter: ROUNDS[round].hp, ...opts.hp },
    shells: opts.shells,
    known: { player: opts.shells.map(() => null), recruiter: opts.shells.map(() => null) },
    items: { player: [], recruiter: [], ...opts.items },
    turn: opts.turn ?? "player",
  };
}

const shoot = (side: Side, target: Side): Action => ({ type: "shoot", side, target });

describe("loading", () => {
  it("announces counts that match the magazine and always mixes live and blank", () => {
    for (let seed = 1; seed < 300; seed++) {
      const s = reduce(createGame(seed), { type: "start", seed });
      const live = s.shells.filter((x) => x === "live").length;
      expect(s.phase).toBe("loading");
      expect(s.loadInfo).toEqual({ live, blank: s.shells.length - live });
      expect(live).toBeGreaterThanOrEqual(1);
      expect(s.loadInfo.blank).toBeGreaterThanOrEqual(1);
      expect(s.shells.length).toBeLessThanOrEqual(ROUNDS[0].maxShells);
      expect(s.items.player).toHaveLength(ROUNDS[0].itemsPerLoad + DIFFICULTY.normal.playerBonusItems);
    }
  });

  it("is deterministic for a seed", () => {
    const a = reduce(createGame(7), { type: "start", seed: 7 });
    const b = reduce(createGame(7), { type: "start", seed: 7 });
    expect(a.shells).toEqual(b.shells);
    expect(a.items).toEqual(b.items);
  });
});

describe("shooting", () => {
  it("keeps the turn after a blank at yourself", () => {
    const s = reduce(rig({ shells: ["blank", "live"] }), shoot("player", "player"));
    expect(s.turn).toBe("player");
    expect(s.hp.player).toBe(3);
  });

  it("passes the turn after a live shot at yourself", () => {
    const s = reduce(rig({ shells: ["live", "blank"] }), shoot("player", "player"));
    expect(s.turn).toBe("recruiter");
    expect(s.hp.player).toBe(2);
  });

  it("passes the turn after shooting the opponent, blank or live", () => {
    expect(reduce(rig({ shells: ["blank", "live"] }), shoot("player", "recruiter")).turn).toBe("recruiter");
    const s = reduce(rig({ shells: ["live", "live"] }), shoot("player", "recruiter"));
    expect(s.turn).toBe("recruiter");
    expect(s.hp.recruiter).toBe(2);
  });

  it("ignores out-of-turn actions", () => {
    const s = rig({ shells: ["live", "blank"] });
    expect(reduce(s, shoot("recruiter", "player"))).toBe(s);
  });

  it("asks for a reload when the magazine empties", () => {
    const s = reduce(rig({ shells: ["blank"] }), shoot("player", "recruiter"));
    expect(s.phase).toBe("reload");
    const loaded = reduce(s, { type: "load" });
    expect(loaded.phase).toBe("loading");
    expect(loaded.shells.length).toBeGreaterThan(0);
    expect(loaded.turn).toBe("recruiter");
  });

  it("ends the game when the player hits zero", () => {
    const s = reduce(rig({ shells: ["live", "blank"], hp: { player: 1 } }), shoot("player", "player"));
    expect(s.phase).toBe("gameOver");
  });

  it("clears the round, then wins the game on the last round", () => {
    const r1 = reduce(rig({ shells: ["live", "blank"], hp: { recruiter: 1 } }), shoot("player", "recruiter"));
    expect(r1.phase).toBe("roundOver");
    expect(r1.roundsWon).toBe(1);
    const r2 = reduce(r1, { type: "nextRound" });
    expect(r2.round).toBe(1);
    expect(r2.hp.player).toBe(ROUNDS[1].hp);

    const last = reduce(
      rig({ shells: ["live", "blank"], hp: { recruiter: 1 }, round: ROUNDS.length - 1 }),
      shoot("player", "recruiter"),
    );
    expect(last.phase).toBe("victory");
  });
});

describe("items", () => {
  it("debugger reveals the chamber only to its user", () => {
    const s = reduce(rig({ shells: ["live", "blank"], items: { player: ["debugger"] } }), {
      type: "useItem",
      side: "player",
      slot: 0,
    });
    expect(s.known.player[0]).toBe("live");
    expect(s.known.recruiter[0]).toBeNull();
    expect(s.items.player).toHaveLength(0);
  });

  it("hotfix ejects the chambered shell and can trigger a reload", () => {
    const s = reduce(rig({ shells: ["live"], items: { player: ["hotfix"] } }), {
      type: "useItem",
      side: "player",
      slot: 0,
    });
    expect(s.spent).toEqual(["live"]);
    expect(s.phase).toBe("reload");
  });

  it("coffee heals but is unusable at full composure", () => {
    const full = rig({ shells: ["live", "blank"], items: { player: ["coffee"] } });
    expect(canUseItem(full, "player", 0)).toBe(false);
    const hurt = rig({ shells: ["live", "blank"], items: { player: ["coffee"] }, hp: { player: 1 } });
    expect(reduce(hurt, { type: "useItem", side: "player", slot: 0 }).hp.player).toBe(2);
  });

  it("merge conflict skips the opponent's next turn once", () => {
    let s = rig({ shells: ["blank", "blank", "live"], items: { player: ["mergeConflict"] } });
    s = reduce(s, { type: "useItem", side: "player", slot: 0 });
    s = reduce(s, shoot("player", "recruiter"));
    expect(s.turn).toBe("player");
    expect(s.event).toMatchObject({ kind: "shot", skipped: "recruiter" });
    s = reduce(s, shoot("player", "recruiter"));
    expect(s.turn).toBe("recruiter");
  });

  it("refactor inverts the chambered shell and any knowledge of it", () => {
    let s = rig({ shells: ["live", "blank"], items: { player: ["debugger", "refactor"] } });
    s = reduce(s, { type: "useItem", side: "player", slot: 0 });
    s = reduce(s, { type: "useItem", side: "player", slot: 0 });
    expect(s.shells[0]).toBe("blank");
    expect(s.known.player[0]).toBe("blank");
  });

  it("friday deploy doubles the next live shot only", () => {
    let s = rig({ shells: ["live", "live", "blank"], items: { player: ["prodDeploy"] }, round: 2 });
    s = reduce(s, { type: "useItem", side: "player", slot: 0 });
    s = reduce(s, shoot("player", "recruiter"));
    expect(s.hp.recruiter).toBe(ROUNDS[2].hp - 2);
    expect(s.doubleDamage).toBe(false);
  });
});

describe("recruiter AI", () => {
  it("computes live probability from public info plus private knowledge", () => {
    const s = rig({ shells: ["live", "blank", "blank", "live"] });
    expect(liveProbability(s, "recruiter")).toBe(0.5);
    s.known.recruiter[1] = "blank";
    expect(liveProbability(s, "recruiter")).toBeCloseTo(2 / 3);
  });

  it("shoots the player when it knows the shell is live", () => {
    const s = rig({ shells: ["live", "blank"], turn: "recruiter" });
    s.known.recruiter[0] = "live";
    expect(decide(s)).toEqual(shoot("recruiter", "player"));
  });

  it("shoots itself when it knows the shell is blank", () => {
    const s = rig({ shells: ["blank", "live"], turn: "recruiter" });
    s.known.recruiter[0] = "blank";
    expect(decide(s)).toEqual(shoot("recruiter", "recruiter"));
  });

  it("only ever picks legal moves, and games always finish", () => {
    for (let seed = 1; seed <= 400; seed++) {
      let s = reduce(createGame(seed), { type: "start", seed });
      let rand = seed;
      const r = () => ((rand = (rand * 16807) % 2147483647) / 2147483647);
      for (let step = 0; step < 2000; step++) {
        if (s.phase === "gameOver" || s.phase === "victory") break;
        let action: Action;
        if (s.phase === "loading") action = { type: "ready" };
        else if (s.phase === "reload") action = { type: "load" };
        else if (s.phase === "roundOver") action = { type: "nextRound" };
        else if (s.turn === "recruiter") action = decide(s, r);
        else {
          // Player: random legal move.
          const usable = s.items.player.map((_, i) => i).filter((i) => canUseItem(s, "player", i));
          action =
            usable.length && r() < 0.4
              ? { type: "useItem", side: "player", slot: usable[0] }
              : shoot("player", r() < 0.5 ? "player" : "recruiter");
        }
        const next = reduce(s, action);
        expect(next, `seed ${seed} step ${step} ${JSON.stringify(action)}`).not.toBe(s);
        s = next;
      }
      expect(["gameOver", "victory"]).toContain(s.phase);
    }
  });
});

describe("difficulty and rewards", () => {
  it("easy gives the player extra composure and items, not the Recruiter", () => {
    const s = reduce(createGame(5, "easy"), { type: "start", seed: 5 });
    expect(s.difficulty).toBe("easy");
    expect(s.maxHp.player).toBe(ROUNDS[0].hp + DIFFICULTY.easy.playerHpBonus);
    expect(s.maxHp.recruiter).toBe(ROUNDS[0].hp);
    expect(s.items.player).toHaveLength(ROUNDS[0].itemsPerLoad + DIFFICULTY.easy.playerBonusItems);
    expect(s.items.recruiter).toHaveLength(ROUNDS[0].itemsPerLoad);
  });

  it("restart keeps the chosen difficulty unless a new one is given", () => {
    const easy = reduce(createGame(5, "easy"), { type: "start", seed: 5 });
    expect(reduce(easy, { type: "restart", seed: 6 }).difficulty).toBe("easy");
    expect(reduce(easy, { type: "restart", seed: 6, difficulty: "normal" }).difficulty).toBe("normal");
  });

  it("grantItem adds an item during play and respects the item cap", () => {
    const s = rig({ shells: ["live", "blank"] });
    const granted = reduce(s, { type: "grantItem", side: "player", item: "coffee", reason: "Quiz" });
    expect(granted.items.player).toEqual(["coffee"]);
    const full = rig({ shells: ["live"], items: { player: Array<"coffee">(6).fill("coffee") } });
    expect(canGrantItem(full, "player")).toBe(false);
    expect(reduce(full, { type: "grantItem", side: "player", item: "debugger" })).toBe(full);
  });
});
