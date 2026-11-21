import { projects, type Project } from "./portfolio";

/** Who the project descriptions are written for. */
export type Reader = "recruiter" | "developer";

export interface ProjectHighlight extends Project {
  id: string;
  /** The same project explained two ways: plain language, or technical detail. */
  summary: Record<Reader, string>;
}

const SUMMARIES: Record<string, Record<Reader, string>> = {
  CareerGapAI: {
    recruiter:
      "Shows job seekers which skills they are missing for a target job and turns them into a step-by-step learning plan, based on real, current job postings.",
    developer:
      "FastAPI service that pulls up to 30 live Google Jobs postings via SerpAPI, measures skill frequency, scores gaps by demand and by how many skills they unlock, and orders them into a prerequisite-aware roadmap. Pydantic models for validation.",
  },
  "Voice Cloner": {
    recruiter:
      "Reads any text aloud in someone's voice after hearing just a few seconds of them speaking, in 17 languages, with a consent check and an AI label on every output.",
    developer:
      "Zero-shot voice cloning on Coqui XTTS-v2 with an audio preprocessing pipeline, cached speaker embeddings, a FastAPI service and a browser recorder. Needs 6–30 seconds of reference audio.",
  },
  CineVault: {
    recruiter:
      "A movie review and rating site where people search, rate, review and keep watchlists, and admins moderate the content.",
    developer:
      "Angular and Node/Express app with MongoDB, real-time search, genre filters, 5-star ratings, JWT authentication and role-based access for catalog management and review moderation.",
  },
  "Kolly Guess Game": {
    recruiter: "A real-time multiplayer version of the classic Kollywood paper game that friends can play together in the browser.",
    developer:
      "React 19 and Convex app where players hide a film's hero, heroine, movie and song and others guess with nine chances. Answers are validated server-side so nobody can cheat.",
  },
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Homepage highlights: the existing projects (tags, stacks, links) plus both readings. */
export const projectHighlights: ProjectHighlight[] = projects.map((p) => ({
  ...p,
  id: slug(p.title),
  summary: SUMMARIES[p.title] ?? { recruiter: p.blurb, developer: p.blurb },
}));
