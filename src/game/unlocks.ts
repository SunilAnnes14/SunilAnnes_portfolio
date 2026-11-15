import { SECTIONS } from "@/content/portfolio";
import type { GameState } from "./types";

type Progress = Pick<GameState, "length" | "roundsWon">;
type Section = (typeof SECTIONS)[number];

/** Quick interviews unlock everything with one win; full interviews unlock round by round. */
export function isUnlocked(section: Section, game: Progress): boolean {
  return game.length === "quick" ? game.roundsWon >= 1 : game.roundsWon >= section.unlockAt;
}

export const unlockedSections = (game: Progress) => SECTIONS.filter((s) => isUnlocked(s, game));

/** Sections that opened with the most recent round win. */
export const justUnlocked = (game: Progress) =>
  game.length === "quick" ? (game.roundsWon === 1 ? [...SECTIONS] : []) : SECTIONS.filter((s) => s.unlockAt === game.roundsWon);

/** What a locked section tells the player to do. */
export const unlockHint = (section: Section, game: Progress) =>
  game.length === "quick" ? "Win the interview to unlock." : `Clear round ${section.unlockAt} to unlock.`;
