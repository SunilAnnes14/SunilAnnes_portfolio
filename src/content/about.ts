/** Content for the homepage About section. Short pieces only; no block longer than two sentences. */

export interface AboutFact {
  label: string;
  text: string;
}

export interface AboutContent {
  heading: string;
  intro: string;
  facts: AboutFact[];
  learning: string[];
  hobbies: { lead: string; items: string[] };
  closing: string;
}

export const about: AboutContent = {
  heading: "Hi, I'm glad you stopped by.",
  intro: "I'm a third-year AI & Data Science student from Chennai who builds full-stack web apps and is getting deeper into AI.",
  facts: [
    { label: "Studying", text: "B.Tech AI & Data Science, LICET, Chennai (2024–2028)" },
    { label: "Building with", text: "TypeScript, Python, React, Node.js and FastAPI" },
    { label: "Recently built", text: "Stavlos AI, Voice Cloner and Chennai Flood Watch" },
  ],
  learning: ["Docker", "System design", "Cloud systems"],
  hobbies: {
    lead: "Side quests:",
    items: ["movies", "songs", "photography", "dance"],
  },
  closing: "Most days I'm probably debugging with coffee.",
};
