export type Side = "player" | "recruiter";
export type Shell = "live" | "blank";

export type ItemId =
  | "debugger"
  | "stackTrace"
  | "hotfix"
  | "coffee"
  | "mergeConflict"
  | "refactor"
  | "prodDeploy";

export type Phase =
  | "intro"
  | "loading"
  | "turn"
  | "reload"
  | "roundOver"
  | "gameOver"
  | "victory";

export type LoadEvent = {
  kind: "load";
  live: number;
  blank: number;
  dealt: Record<Side, ItemId[]>;
};

export type ShotEvent = {
  kind: "shot";
  shooter: Side;
  target: Side;
  shell: Shell;
  damage: number;
  /** Side whose turn was skipped because of a Merge Conflict, if any. */
  skipped: Side | null;
};

export type ItemEvent = {
  kind: "item";
  side: Side;
  item: ItemId;
  reveal?: { index: number; shell: Shell };
  ejected?: Shell;
};

export type GameEvent = LoadEvent | ShotEvent | ItemEvent;

export type Difficulty = "easy" | "normal";

export type Action =
  | { type: "start"; seed?: number; difficulty?: Difficulty }
  | { type: "restart"; seed?: number; difficulty?: Difficulty }
  | { type: "load" }
  | { type: "ready" }
  | { type: "shoot"; side: Side; target: Side }
  | { type: "useItem"; side: Side; slot: number }
  /** A reward from outside the shotgun loop, e.g. the pop quiz. */
  | { type: "grantItem"; side: Side; item: ItemId; reason?: string }
  | { type: "nextRound" };

export interface LogEntry {
  id: number;
  side: Side | "system";
  text: string;
  tone?: "danger" | "safe" | "info";
}

export interface GameState {
  phase: Phase;
  /** Zero-based round index. */
  round: number;
  roundsWon: number;
  difficulty: Difficulty;
  hp: Record<Side, number>;
  maxHp: Record<Side, number>;
  /** Remaining shells; index 0 is the chambered one. */
  shells: Shell[];
  /** What each side privately knows, aligned with `shells`. */
  known: Record<Side, (Shell | null)[]>;
  loadInfo: { live: number; blank: number };
  /** Shells fired or ejected during the current load (public). */
  spent: Shell[];
  items: Record<Side, ItemId[]>;
  turn: Side;
  /** A side flagged here loses its next turn. */
  skip: Record<Side, boolean>;
  doubleDamage: boolean;
  event: GameEvent | null;
  eventId: number;
  log: LogEntry[];
  rng: number;
}
