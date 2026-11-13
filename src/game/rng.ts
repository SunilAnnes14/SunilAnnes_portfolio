/** Deterministic mulberry32 RNG. The seed lives in game state so the reducer stays pure. */
export function makeRng(seed: number) {
  let s = seed | 0;
  const next = () => {
    s = (s + 0x6d2b79f5) | 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    /** Inclusive integer range. */
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    get state() {
      return s;
    },
  };
}

export type Rng = ReturnType<typeof makeRng>;

export function shuffle<T>(arr: T[], rng: Rng): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
