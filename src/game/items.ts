import type { ItemId } from "./types";

export interface ItemMeta {
  name: string;
  /** What it does, shown in the tooltip. */
  effect: string;
  flavor: string;
}

export const ITEMS: Record<ItemId, ItemMeta> = {
  debugger: {
    name: "Debugger",
    effect: "Reveal the chambered shell.",
    flavor: "Breakpoint set. Inspecting variables.",
  },
  stackTrace: {
    name: "Stack Trace",
    effect: "Reveal one random shell further down the magazine.",
    flavor: "The answer is somewhere on line 4,218.",
  },
  hotfix: {
    name: "Hotfix",
    effect: "Eject the chambered shell without firing it.",
    flavor: "Ship it. We'll write tests later.",
  },
  coffee: {
    name: "Coffee",
    effect: "Restore 1 composure.",
    flavor: "Fourth cup. Hands barely shaking.",
  },
  mergeConflict: {
    name: "Merge Conflict",
    effect: "Your opponent loses their next turn.",
    flavor: "<<<<<<< HEAD",
  },
  refactor: {
    name: "Refactor",
    effect: "Invert the chambered shell: live becomes blank, blank becomes live.",
    flavor: "Same behaviour. Probably.",
  },
  prodDeploy: {
    name: "Friday Deploy",
    effect: "Your next live shot deals double damage.",
    flavor: "What's the worst that could happen?",
  },
};
