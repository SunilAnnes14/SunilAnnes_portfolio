import type { GameState, ItemId } from "./types";

export type FaceTone = "ok" | "hurt" | "glee";

const ITEM_FACE: Record<ItemId, string> = {
  debugger: "o_O",
  stackTrace: "...?",
  hotfix: ";)",
  coffee: "c[_]",
  mergeConflict: ">:)",
  refactor: "?!",
  prodDeploy: "!!",
};

/** What the Recruiter's monitor shows for the current moment of the game. */
export function faceFor(game: GameState, busy: boolean): { text: string; tone: FaceTone } {
  if (game.phase === "intro") return { text: ":)", tone: "ok" };
  if (game.phase === "gameOver") return { text: "NEXT.", tone: "glee" };
  if (game.phase === "victory" || game.phase === "roundOver") return { text: "x_x", tone: "hurt" };
  const e = game.event;
  if (busy && e?.kind === "shot") {
    if (e.shell === "live" && e.target === "recruiter") return { text: "x_x", tone: "hurt" };
    if (e.shell === "live" && e.target === "player") return { text: ":D", tone: "glee" };
    if (e.shooter === "recruiter" && e.target === "recruiter") return { text: "B)", tone: "ok" };
    if (e.shooter === "recruiter") return { text: ":/", tone: "ok" };
    if (e.target === "player") return { text: "-_-", tone: "ok" };
    return { text: ":|", tone: "ok" };
  }
  if (busy && e?.kind === "item" && e.side === "recruiter") return { text: ITEM_FACE[e.item], tone: "ok" };
  if (busy && e?.kind === "item" && e.side === "player") return { text: "hm.", tone: "ok" };
  if (game.phase === "loading") return { text: ":)", tone: "ok" };
  if (game.phase === "turn" && game.turn === "recruiter") return { text: "...", tone: "ok" };
  return { text: ":|", tone: "ok" };
}
