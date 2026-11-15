import { canUseItem, liveProbability, opponent } from "./engine";
import type { Action, Difficulty, GameState, ItemId, Side } from "./types";

/** Chance per round that the AI makes a gut call instead of the best play. */
export const MISTAKE_RATES: Record<Difficulty, number[]> = {
  easy: [0.55, 0.45, 0.35],
  normal: [0.4, 0.3, 0.2],
};

/**
 * Picks the next action for `me` (the Recruiter by default). Called repeatedly
 * during its turn: each call returns one item use or a final shot.
 */
export function decide(
  state: GameState,
  rand: () => number = Math.random,
  me: Side = "recruiter",
  mistakeRate: number[] = MISTAKE_RATES[state.difficulty],
): Action {
  const them = opponent(me);
  const items = state.items[me];

  const slotOf = (id: ItemId) =>
    items.findIndex((it, i) => it === id && canUseItem(state, me, i));
  const can = (id: ItemId) => slotOf(id) >= 0;
  const apply = (id: ItemId): Action => ({ type: "useItem", side: me, slot: slotOf(id) });
  const shoot = (target: Side): Action => ({ type: "shoot", side: me, target });

  if (can("coffee")) return apply("coffee");

  const p = liveProbability(state, me);
  const uncertain = p > 0 && p < 1;

  if (uncertain && can("debugger")) return apply("debugger");
  if (
    uncertain &&
    state.shells.length > 1 &&
    state.known[me].slice(1).some((k) => k === null) &&
    can("stackTrace")
  ) {
    return apply("stackTrace");
  }
  if (uncertain && p >= 0.35 && p <= 0.65 && can("hotfix")) return apply("hotfix");

  if (p === 1) {
    if (can("prodDeploy")) return apply("prodDeploy");
    if (can("mergeConflict")) return apply("mergeConflict");
    return shoot(them);
  }
  if (p === 0) {
    if (can("refactor")) return apply("refactor");
    return shoot(me);
  }

  if (rand() < (mistakeRate[state.round] ?? 0.05)) {
    return shoot(rand() < 0.5 ? me : them);
  }
  if (p > 0.5) {
    if (can("mergeConflict") && rand() < 0.5) return apply("mergeConflict");
    return shoot(them);
  }
  if (p < 0.5) return shoot(me);
  return shoot(rand() < 0.5 ? me : them);
}
