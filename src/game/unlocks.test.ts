import { describe, expect, it } from "vitest";
import { SECTIONS } from "@/content/portfolio";
import { justUnlocked, unlockedSections } from "./unlocks";

describe("portfolio unlocks", () => {
  it("quick: nothing before the win, everything after", () => {
    expect(unlockedSections({ length: "quick", roundsWon: 0 })).toHaveLength(0);
    expect(unlockedSections({ length: "quick", roundsWon: 1 })).toHaveLength(SECTIONS.length);
    expect(justUnlocked({ length: "quick", roundsWon: 1 })).toHaveLength(SECTIONS.length);
  });

  it("full: sections open round by round", () => {
    const counts = [0, 1, 2, 3].map((r) => unlockedSections({ length: "full", roundsWon: r }).length);
    expect(counts[0]).toBe(0);
    expect(counts[1]).toBeLessThan(counts[2]);
    expect(counts[3]).toBe(SECTIONS.length);
  });
});
