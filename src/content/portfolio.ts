/**
 * Everything personal lives here. The homepage, the game and its dossier all read from this file.
 */

export const profile = {
  name: "Sunil Annes S K",
  initials: "SK",
  role: "Full-Stack Developer",
  /** Rotated through under the name on the homepage. */
  roles: ["Full-Stack Developer", "Angular + TypeScript Builder", "AI & Data Science Student", "Always Shipping Something New"],
  education: "B.Tech Artificial Intelligence and Data Science · LICET · Class of 2026",
  location: "Chennai, India",
  availability: "Open to internships & research",
  headline: "Full-stack developer and AI & Data Science student. First, solve the problem. Then, write the code.",
  summary:
    "I'm a third-year B.Tech Artificial Intelligence and Data Science student at Loyola-ICAM College of Engineering and Technology (LICET) in Chennai. I focus on web development, Angular and full-stack systems, with a growing interest in AI and machine learning. Right now I'm building CareerGapAI and a retro CRT web architecture, and learning Node.js, Docker, system design and cloud systems. Most days I'm probably debugging with coffee.",
  // TODO: add your real email and profile links.
  email: "you@example.com",
  links: [
    { label: "GitHub", href: "https://github.com/your-handle" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
  ],
  resumeUrl: "#",
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["Angular", "TypeScript", "Web Development"] },
  { group: "Full-stack", items: ["Full-Stack Systems", "Node.js"] },
  { group: "AI & Data", items: ["Artificial Intelligence", "Machine Learning", "Data Science"] },
  { group: "Learning now", items: ["Node.js", "Docker", "System Design", "Cloud Systems"] },
];

export interface Project {
  title: string;
  blurb: string;
  stack: string[];
  href?: string;
  repo?: string;
  /** Short label shown on the card, e.g. "2025" or "Side project". */
  tag?: string;
}

export const projects: Project[] = [
  {
    title: "The Interview",
    tag: "This site",
    blurb:
      "A turn-based game of risk and deduction played against a hostile recruiter, rendered in real-time 3D. Built around a pure, unit-tested TypeScript rules engine and a probability-driven AI.",
    stack: ["Next.js", "React Three Fiber", "TypeScript", "Zustand", "Vitest"],
    href: "/interview",
  },
  {
    title: "CareerGapAI",
    tag: "In progress",
    // TODO: one or two sentences on what it does and who it's for.
    blurb: "An AI project I'm building right now. Details coming soon.",
    stack: ["AI & ML"],
  },
  {
    title: "Retro CRT Web Architecture",
    tag: "In progress",
    // TODO: describe what it is and link a demo.
    blurb: "A retro, CRT-inspired web architecture I'm currently building.",
    stack: ["Web"],
  },
];

export interface Job {
  company: string;
  role: string;
  period: string;
  points: string[];
}

export const experience: Job[] = [
  {
    company: "Loyola-ICAM College of Engineering and Technology (LICET), Chennai",
    role: "B.Tech, Artificial Intelligence and Data Science",
    period: "3rd year · Class of 2026",
    points: [
      "Focus: web development, Angular, full-stack systems, AI and machine learning.",
      "Currently learning Node.js, Docker, system design and cloud systems.",
    ],
  },
];

/** Shown when a blank is fired. Keep them short. */
export const funFacts = [
  "First, solve the problem. Then, write the code. (John Johnson)",
  "Probably debugging with coffee right now.",
  "Currently learning Docker. The containers are winning.",
  "Callsign: sunil@sk-linux.",
  "Running SK-Linux 1.0 LTS on sk-kernel-5.15-ai-rt.",
  "Always shipping something new.",
];

/** Dossier sections and the round you need to clear to unlock each one. */
export const SECTIONS = [
  { id: "about", label: "About", unlockAt: 1 },
  { id: "skills", label: "Skills", unlockAt: 1 },
  { id: "projects", label: "Projects", unlockAt: 2 },
  { id: "experience", label: "Education", unlockAt: 3 },
  { id: "contact", label: "Contact", unlockAt: 3 },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
