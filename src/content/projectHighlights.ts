import { projects, type Project } from "./portfolio";

/** Red shell = LIVE (shipped). Grey shell = BLANK (in progress). */
export type ShellStatus = "live" | "blank";

/** Which looping mini demo the dossier plays for a project. */
export type DemoKind = "careergap" | "voice" | "cinevault" | "kolly";

export interface ShellProject extends Project {
  id: string;
  /** Short tag printed under the shell. */
  label: string;
  status: ShellStatus;
  /** One-sentence description shown in the dossier. */
  description: string;
  stat: { value: string; label: string };
  demo: DemoKind;
  /** Hull color: a different shade per shell, red for shipped, blue-grey for in progress. */
  hull: string;
}

type ShellDetails = Omit<ShellProject, keyof Project | "id">;

const DETAILS: Record<string, ShellDetails> = {
  CareerGapAI: {
    label: "AI",
    status: "blank",
    description:
      "Tells you which skills stand between you and a target job. Analyzes up to 30 live Google Jobs postings, scores gaps by demand and by how many skills they unlock, and builds a prerequisite-aware learning roadmap.",
    stat: { value: "30", label: "live postings analyzed" },
    demo: "careergap",
    hull: "#56708f",
  },
  "Voice Cloner": {
    label: "Deep learning",
    status: "live",
    description:
      "Zero-shot voice cloning: 6–30 seconds of someone speaking is enough to read any text aloud in that voice, in 17 languages, with a consent check and an AI label on every output.",
    stat: { value: "17", label: "languages" },
    demo: "voice",
    hull: "#b3261e",
  },
  CineVault: {
    label: "Full-stack",
    status: "live",
    description:
      "Movie review and rating platform with real-time search, genre filters, 5-star ratings, reviews and watchlists, with JWT auth and role-based admin moderation.",
    stat: { value: "RBAC", label: "role-based admin moderation" },
    demo: "cinevault",
    hull: "#c2452b",
  },
  "Kolly Guess Game": {
    label: "Game",
    status: "live",
    description:
      "The classic KOLLYWOOD paper game as a real-time multiplayer web app, with nine chances per guess and server-side answer validation.",
    stat: { value: "Live", label: "real-time multiplayer" },
    demo: "kolly",
    hull: "#8f1d35",
  },
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** The four project shells, in table order. Links and stacks come from the shared portfolio data. */
export const shellProjects: ShellProject[] = projects
  .filter((p) => DETAILS[p.title])
  .map((p) => ({ ...p, id: slug(p.title), ...DETAILS[p.title] }));
