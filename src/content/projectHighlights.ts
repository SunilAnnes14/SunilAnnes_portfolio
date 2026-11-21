import { projects, type Project } from "./portfolio";

/** Red shell = LIVE (shipped). Grey shell = BLANK (in progress). */
export type ShellStatus = "live" | "blank";

/** Which looping mini demo the dossier plays for a project. */
export type DemoKind = "careergap" | "voice" | "moviq" | "kolly" | "floodwatch" | "stavlos";

export interface ShellProject extends Project {
  id: string;
  /** Name printed on the shell body, when the full title is too long to read there. */
  shellName?: string;
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
  "Chennai Flood Watch": {
    shellName: "Flood Watch",
    label: "Full-stack · Team",
    status: "live",
    description:
      "A live flood-safety site for Chennai, built with team CR7 Flows: rainfall for 8 areas, citizen flood reports verified by admins, street-level flood forecasts from rainfall, flood history and terrain, road closures and safer driving routes on Leaflet maps.",
    stat: { value: "97", label: "automated tests" },
    demo: "floodwatch",
    hull: "#b3261e",
  },
  MoviQ: {
    label: "Full-stack · AI",
    status: "live",
    description:
      "AI-powered social movie platform (formerly CineVault): film vault, ratings and reviews, friends, movie communities with real-time group chat, watch polls and movie nights, plus six AI features such as recommendations and spoiler detection.",
    stat: { value: "6", label: "AI features" },
    demo: "moviq",
    hull: "#c2452b",
  },
  "Stavlos AI": {
    label: "AI agents",
    status: "blank",
    description:
      "Risk-first multi-agent DeFi trading: a Scout argues for each trade, a Bear argues against it, and a deterministic Risk Guardian can veto it. Runs in paper mode on replayed markets, with a hash-verified Trade Passport for every decision, even rejected ones.",
    stat: { value: "Veto", label: "deterministic risk guardian" },
    demo: "stavlos",
    hull: "#4f6b8a",
  },
  CareerGapAI: {
    label: "AI",
    status: "blank",
    description:
      "Tells you which skills stand between you and a target job. Analyzes up to 30 live Google Jobs postings, scores gaps by demand and by how many skills they unlock, and builds a prerequisite-aware learning roadmap.",
    stat: { value: "30", label: "live postings analyzed" },
    demo: "careergap",
    hull: "#6b7f99",
  },
  "Voice Cloner": {
    label: "Deep learning",
    status: "live",
    description:
      "Zero-shot voice cloning: 6–30 seconds of someone speaking is enough to read any text aloud in that voice, in 17 languages, with a consent check and an AI label on every output.",
    stat: { value: "17", label: "languages" },
    demo: "voice",
    hull: "#d0583a",
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
