/** Things the Recruiter says in its speech bubble, grouped by moment. */
export const RECRUITER_LINES = {
  gameStart: ["Thanks for coming in. Let's see what you've got.", "Take a seat. This won't take long.", "Your résumé looked great. Let's verify that."],
  roundStart: ["Round two. I've seen your type before.", "Final round. No pressure.", "Let's raise the stakes, shall we?"],
  reload: ["Fresh shells. Fresh opportunities.", "Let's reload and continue.", "More questions. More shells."],
  thinking: ["Hmm. Interesting choice of career.", "Let me check my notes.", "Where do you see yourself in five seconds?"],
  playerHit: ["Tell me about a time you failed.", "That's going on your file.", "Stay calm. Interviews are stressful."],
  playerHitSelf: ["Bold. Very bold.", "Was that a strategy?", "I'll note that as a weakness."],
  recruiterHit: ["Ow. That wasn't in the job description.", "Let's call that a culture fit issue.", "HR will hear about this."],
  playerBlankSelf: ["Confident. I like that.", "Lucky. Or calculated?", "Okay, you get another question."],
  recruiterBlankSelf: ["See? Nerves of steel.", "Still employed.", "Just checking the equipment."],
  recruiterItem: ["Let me pull up your references.", "One moment, consulting my tools.", "Policy allows this, I checked."],
  playerItem: ["Using every tool available. Good.", "Resourceful. I'll write that down.", "Interesting approach."],
  playerLowHp: ["You're sweating. It's fine. Totally fine.", "Do you need a glass of water?"],
  poke: ["Please don't touch the equipment.", "That's my face. I'm using it.", "Personal space, please.", "I'm going to have to log that.", "Click me again and I'll remember it."],
} as const;

export type LineKey = keyof typeof RECRUITER_LINES;

/** Deterministic pick so the same moment doesn't flicker between lines. */
export function pickLine(key: LineKey, seed: number): string {
  const list = RECRUITER_LINES[key];
  return list[Math.abs(seed) % list.length];
}
