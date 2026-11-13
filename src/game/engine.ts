import { makeRng, shuffle } from "./rng";
import type {
  Action,
  GameEvent,
  GameState,
  ItemEvent,
  ItemId,
  LogEntry,
  Shell,
  Side,
} from "./types";

export const SIDES: Side[] = ["player", "recruiter"];
export const MAX_ITEMS = 6;
/** "You came prepared": the player gets this many extra items per load. */
export const PLAYER_BONUS_ITEMS = 1;

export interface RoundConfig {
  hp: number;
  minShells: number;
  maxShells: number;
  /** Items dealt to each side per load. */
  itemsPerLoad: number;
  pool: ItemId[];
}

export const ROUNDS: RoundConfig[] = [
  {
    hp: 3,
    minShells: 2,
    maxShells: 4,
    itemsPerLoad: 1,
    pool: ["debugger", "coffee", "hotfix"],
  },
  {
    hp: 4,
    minShells: 3,
    maxShells: 6,
    itemsPerLoad: 2,
    pool: ["debugger", "coffee", "hotfix", "refactor", "mergeConflict"],
  },
  {
    hp: 5,
    minShells: 4,
    maxShells: 8,
    itemsPerLoad: 3,
    pool: [
      "debugger",
      "stackTrace",
      "coffee",
      "hotfix",
      "refactor",
      "mergeConflict",
      "prodDeploy",
    ],
  },
];

export const opponent = (side: Side): Side =>
  side === "player" ? "recruiter" : "player";

const who = (side: Side) => (side === "player" ? "You" : "The Recruiter");

export function createGame(seed = 1): GameState {
  return {
    phase: "intro",
    round: 0,
    roundsWon: 0,
    hp: { player: 0, recruiter: 0 },
    maxHp: 0,
    shells: [],
    known: { player: [], recruiter: [] },
    loadInfo: { live: 0, blank: 0 },
    spent: [],
    items: { player: [], recruiter: [] },
    turn: "player",
    skip: { player: false, recruiter: false },
    doubleDamage: false,
    event: null,
    eventId: 0,
    log: [],
    rng: seed >>> 0,
  };
}

function clone(s: GameState): GameState {
  return {
    ...s,
    hp: { ...s.hp },
    shells: [...s.shells],
    known: { player: [...s.known.player], recruiter: [...s.known.recruiter] },
    loadInfo: { ...s.loadInfo },
    spent: [...s.spent],
    items: { player: [...s.items.player], recruiter: [...s.items.recruiter] },
    skip: { ...s.skip },
    log: [...s.log],
  };
}

function log(s: GameState, side: LogEntry["side"], text: string, tone?: LogEntry["tone"]) {
  const id = (s.log.at(-1)?.id ?? 0) + 1;
  s.log.push({ id, side, text, tone });
  if (s.log.length > 60) s.log.shift();
}

function emit(s: GameState, event: GameEvent) {
  s.event = event;
  s.eventId += 1;
}

function popChamber(s: GameState): Shell {
  const shell = s.shells.shift()!;
  s.known.player.shift();
  s.known.recruiter.shift();
  s.spent.push(shell);
  return shell;
}

function loadShotgun(s: GameState) {
  const cfg = ROUNDS[s.round];
  const rng = makeRng(s.rng);
  const total = rng.int(cfg.minShells, cfg.maxShells);
  const live = Math.min(
    total - 1,
    Math.max(1, Math.round(total * (0.35 + 0.3 * rng.next()))),
  );
  const shells = shuffle<Shell>(
    [...Array<Shell>(live).fill("live"), ...Array<Shell>(total - live).fill("blank")],
    rng,
  );

  const dealt: Record<Side, ItemId[]> = { player: [], recruiter: [] };
  for (const side of SIDES) {
    const count = cfg.itemsPerLoad + (side === "player" ? PLAYER_BONUS_ITEMS : 0);
    for (let i = 0; i < count && s.items[side].length < MAX_ITEMS; i++) {
      const item = cfg.pool[rng.int(0, cfg.pool.length - 1)];
      s.items[side].push(item);
      dealt[side].push(item);
    }
  }

  s.rng = rng.state;
  s.shells = shells;
  s.known = { player: shells.map(() => null), recruiter: shells.map(() => null) };
  s.loadInfo = { live, blank: total - live };
  s.spent = [];
  s.skip = { player: false, recruiter: false };
  s.doubleDamage = false;
  s.phase = "loading";
  log(
    s,
    "system",
    `Loaded ${live} live, ${total - live} blank, in an unknown order.`,
    "info",
  );
  emit(s, { kind: "load", live, blank: total - live, dealt });
}

function startRound(s: GameState, round: number) {
  const cfg = ROUNDS[round];
  s.round = round;
  s.maxHp = cfg.hp;
  s.hp = { player: cfg.hp, recruiter: cfg.hp };
  s.items = { player: [], recruiter: [] };
  s.turn = "player";
  log(s, "system", `Round ${round + 1} of ${ROUNDS.length}. Composure set to ${cfg.hp}.`, "info");
  loadShotgun(s);
}

export function canUseItem(state: GameState, side: Side, slot: number): boolean {
  if (state.phase !== "turn" || state.turn !== side) return false;
  const item = state.items[side][slot];
  if (!item || state.shells.length === 0) return false;
  switch (item) {
    case "coffee":
      return state.hp[side] < state.maxHp;
    case "mergeConflict":
      return !state.skip[opponent(side)];
    case "prodDeploy":
      return !state.doubleDamage;
    default:
      return true;
  }
}

function shoot(state: GameState, side: Side, target: Side): GameState {
  if (state.phase !== "turn" || state.turn !== side || state.shells.length === 0) return state;
  const s = clone(state);
  const shell = popChamber(s);
  const damage = shell === "live" ? (s.doubleDamage ? 2 : 1) : 0;
  s.doubleDamage = false;
  s.hp[target] = Math.max(0, s.hp[target] - damage);

  const aim = target === side ? (side === "player" ? "yourself" : "itself") : target === "player" ? "you" : "the Recruiter";
  if (shell === "live") {
    log(s, side, `${who(side)} fired at ${aim}. LIVE. -${damage} composure.`, "danger");
  } else {
    log(s, side, `${who(side)} fired at ${aim}. Blank.`, "safe");
  }

  let skipped: Side | null = null;

  if (s.hp[target] === 0) {
    if (target === "player") {
      s.phase = "gameOver";
      log(s, "system", "You have been let go.", "danger");
    } else {
      s.roundsWon += 1;
      s.phase = s.round === ROUNDS.length - 1 ? "victory" : "roundOver";
      log(s, "system", `Round ${s.round + 1} cleared.`, "safe");
    }
  } else {
    const keepsTurn = target === side && shell === "blank";
    if (keepsTurn) {
      log(s, "system", `${who(side)} keep${side === "player" ? "" : "s"} the turn.`);
    } else {
      const other = opponent(side);
      if (s.skip[other]) {
        s.skip[other] = false;
        skipped = other;
        log(s, "system", `${who(other)} ${other === "player" ? "are" : "is"} stuck in a merge conflict. Turn skipped.`);
      } else {
        s.turn = other;
      }
    }
    if (s.shells.length === 0) s.phase = "reload";
  }

  emit(s, { kind: "shot", shooter: side, target, shell, damage, skipped });
  return s;
}

function applyItem(state: GameState, side: Side, slot: number): GameState {
  if (!canUseItem(state, side, slot)) return state;
  const s = clone(state);
  const [item] = s.items[side].splice(slot, 1);
  const ev: ItemEvent = { kind: "item", side, item };
  const mine = side === "player";

  switch (item) {
    case "debugger": {
      const shell = s.shells[0];
      s.known[side][0] = shell;
      ev.reveal = { index: 0, shell };
      log(
        s,
        side,
        mine
          ? `Debugger attached: the chambered shell is ${shell.toUpperCase()}.`
          : "The Recruiter attaches a debugger and studies the chamber.",
        mine ? (shell === "live" ? "danger" : "safe") : undefined,
      );
      break;
    }
    case "stackTrace": {
      const rng = makeRng(s.rng);
      const index = s.shells.length > 1 ? rng.int(1, s.shells.length - 1) : 0;
      s.rng = rng.state;
      const shell = s.shells[index];
      s.known[side][index] = shell;
      ev.reveal = { index, shell };
      log(
        s,
        side,
        mine
          ? `Stack trace: shell #${index + 1} is ${shell.toUpperCase()}.`
          : "The Recruiter reads a stack trace and nods slowly.",
        mine ? "info" : undefined,
      );
      break;
    }
    case "hotfix": {
      const shell = popChamber(s);
      ev.ejected = shell;
      log(s, side, `${who(side)} shipped a hotfix and ejected a ${shell.toUpperCase()} shell.`, "info");
      if (s.shells.length === 0) s.phase = "reload";
      break;
    }
    case "coffee": {
      s.hp[side] = Math.min(s.maxHp, s.hp[side] + 1);
      log(s, side, `${who(side)} drank coffee. +1 composure.`, "safe");
      break;
    }
    case "mergeConflict": {
      s.skip[opponent(side)] = true;
      log(s, side, `${who(side)} opened a merge conflict. ${who(opponent(side))} will lose a turn.`, "info");
      break;
    }
    case "refactor": {
      s.shells[0] = s.shells[0] === "live" ? "blank" : "live";
      for (const k of [s.known.player, s.known.recruiter]) {
        if (k[0]) k[0] = k[0] === "live" ? "blank" : "live";
      }
      log(s, side, `${who(side)} refactored the chambered shell. Whatever it was, it's now the opposite.`, "info");
      break;
    }
    case "prodDeploy": {
      s.doubleDamage = true;
      log(s, side, `${who(side)} deployed on a Friday. The next live shot deals 2.`, "danger");
      break;
    }
  }

  emit(s, ev);
  return s;
}

export function reduce(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "start":
    case "restart": {
      if (action.type === "start" && state.phase !== "intro") return state;
      const s = createGame(action.seed ?? state.rng + 0x9e3779b9);
      s.eventId = state.eventId;
      startRound(s, 0);
      return s;
    }
    case "load": {
      if (state.phase !== "reload") return state;
      const s = clone(state);
      loadShotgun(s);
      return s;
    }
    case "ready": {
      if (state.phase !== "loading") return state;
      return { ...state, phase: "turn" };
    }
    case "nextRound": {
      if (state.phase !== "roundOver") return state;
      const s = clone(state);
      startRound(s, s.round + 1);
      return s;
    }
    case "shoot":
      return shoot(state, action.side, action.target);
    case "useItem":
      return applyItem(state, action.side, action.slot);
  }
}

/** Probability, from `side`'s point of view, that the chambered shell is live. */
export function liveProbability(state: GameState, side: Side): number {
  const known = state.known[side];
  if (known[0]) return known[0] === "live" ? 1 : 0;
  // Remaining live count is public: the load is announced and every spent shell is shown.
  let live = state.shells.filter((x) => x === "live").length;
  let unknown = state.shells.length;
  known.forEach((k) => {
    if (k) {
      unknown -= 1;
      if (k === "live") live -= 1;
    }
  });
  return unknown > 0 ? live / unknown : 0;
}
