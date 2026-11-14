/**
 * Everything personal lives here. Replace the placeholders with your own details;
 * the homepage, the game and its dossier all read from this file.
 */

export const profile = {
  name: "Your Name",
  initials: "YN",
  role: "Full-Stack Developer",
  location: "City, Country",
  availability: "Open to full-time roles",
  headline: "I build web products that feel good to use, and the systems that keep them fast.",
  summary:
    "I build fast, playful, well-tested web products. I like turning complicated systems into interfaces people actually enjoy using, and I care about the details: performance, accessibility and the feel of an interaction.",
  email: "you@example.com",
  links: [
    { label: "GitHub", href: "https://github.com/your-handle" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
  ],
  resumeUrl: "#",
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Motion", "Three.js"] },
  { group: "Backend", items: ["Node.js", "PostgreSQL", "REST & GraphQL", "Redis"] },
  { group: "Practice", items: ["Testing", "CI/CD", "Accessibility", "Performance"] },
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
    repo: "https://github.com/your-handle/chamber",
  },
  {
    title: "Project Two",
    blurb: "One or two sentences on the problem, what you built and the result. Numbers help.",
    stack: ["React", "Node.js", "PostgreSQL"],
    href: "#",
  },
  {
    title: "Project Three",
    blurb: "Another project worth showing. Link the live demo and the repo if you can.",
    stack: ["Python", "FastAPI"],
    href: "#",
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
    company: "Company Name",
    role: "Software Engineer",
    period: "2024 - Present",
    points: ["Shipped something that mattered.", "Improved something measurable by N%."],
  },
  {
    company: "Previous Company",
    role: "Intern",
    period: "2023",
    points: ["Built and owned a feature end to end."],
  },
];

/** Shown when a blank is fired. Keep them short. */
export const funFacts = [
  "I once fixed a bug by deleting 400 lines of code.",
  "Tabs or spaces? Whatever the formatter says.",
  "Favourite keyboard shortcut: Ctrl+Shift+P.",
  "I test in production. Kidding. Mostly.",
  "My rubber duck has a name.",
  "I read changelogs for fun.",
];

/** Dossier sections and the round you need to clear to unlock each one. */
export const SECTIONS = [
  { id: "about", label: "About", unlockAt: 1 },
  { id: "skills", label: "Skills", unlockAt: 1 },
  { id: "projects", label: "Projects", unlockAt: 2 },
  { id: "experience", label: "Experience", unlockAt: 3 },
  { id: "contact", label: "Contact", unlockAt: 3 },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
