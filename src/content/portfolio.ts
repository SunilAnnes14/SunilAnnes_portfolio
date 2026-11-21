/**
 * Everything personal lives here. The homepage, the game and its dossier all read from this file.
 * Project details come from github.com/SunilAnnes14.
 */

export const profile = {
  name: "Sunil Annes S K",
  initials: "SK",
  role: "Full-Stack Developer",
  /** Rotated through under the name on the homepage. */
  roles: ["Full-Stack Developer", "Angular + TypeScript Builder", "AI & Data Science Student", "Always Shipping Something New"],
  education: "B.Tech Artificial Intelligence and Data Science · LICET · 2022–2026",
  location: "Chennai, India",
  availability: "Open to internships & research",
  headline: "Full-stack developer and AI & Data Science student. First, solve the problem. Then, write the code.",
  summary:
    "I'm a third-year B.Tech Artificial Intelligence and Data Science student at Loyola-ICAM College of Engineering and Technology (LICET) in Chennai. I build full-stack web apps, mostly with Angular, TypeScript, Node.js and MongoDB, and I'm increasingly working on AI: my current project, CareerGapAI, maps the skills someone is missing for a career and turns them into a learning roadmap. I'm learning Docker, system design and cloud systems, and most days I'm probably debugging with coffee.",
  email: "annessunil14@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/SunilAnnes14" },
    { label: "Kaggle", href: "https://www.kaggle.com/sunilannessk" },
    // TODO: add LinkedIn once you have the exact profile URL.
  ],
  /** Shown under the projects grid. */
  moreProjectsUrl: "https://github.com/SunilAnnes14?tab=repositories",
  resumeUrl: "#",
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "Java", "C", "SQL", "HTML & CSS"] },
  { group: "Frontend", items: ["Angular", "React", "Next.js", "Tailwind CSS", "RxJS", "Sass", "Three.js", "Leaflet"] },
  { group: "Backend & data", items: ["Node.js", "Express", "FastAPI", "Flask", "Socket.IO", "Spring Boot", "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Firebase"] },
  { group: "AI & ML", items: ["PyTorch", "Scikit-learn", "Pandas", "Jupyter", "Matplotlib", "librosa"] },
  { group: "Web3", items: ["Solidity", "Hardhat", "Ethers.js"] },
  { group: "Tools", items: ["Git", "Docker", "Linux", "Vercel", "AWS", "Postman", "Figma"] },
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
  // Only the strongest work goes here; The Interview has its own featured section on the homepage,
  // and everything else is one click away via profile.moreProjectsUrl.
  {
    title: "Chennai Flood Watch",
    tag: "Full-stack · Team project",
    blurb:
      "A flood-safety website for Chennai, built with team CR7 Flows: live rainfall for 8 areas, citizen flood reports that admins verify, street-level flood forecasts from rainfall, flood history and terrain, road closures and safer driving routes, all on Leaflet maps.",
    stack: ["React", "Vite", "Tailwind CSS", "Leaflet", "Python", "FastAPI", "SQLite"],
    href: "https://flows-cr7.vercel.app/",
    repo: "https://github.com/SunilAnnes14/chennai-floodwatch",
  },
  {
    title: "MoviQ",
    tag: "Full-stack · AI",
    blurb:
      "An AI-powered social movie platform (formerly CineVault): a personal film vault, ratings and reviews, friends, movie communities with real-time group chat, watch polls and movie nights, plus six AI features including recommendations and spoiler detection.",
    stack: ["Angular", "TypeScript", "Node.js", "Express", "Socket.IO", "MongoDB"],
    repo: "https://github.com/SunilAnnes14/movie-review-system",
  },
  {
    title: "Stavlos AI",
    tag: "AI agents · In progress",
    blurb:
      "A risk-first, explainable multi-agent DeFi trading agent: a Scout argues for each trade, a Bear argues against it, and a deterministic Risk Guardian can veto it. Runs in paper mode on replayed markets and writes a verifiable Trade Passport for every decision, including rejected ones.",
    stack: ["Python", "FastAPI", "Pydantic", "Next.js", "TypeScript", "SQLite"],
    repo: "https://github.com/SunilAnnes14/stavlos-master",
  },
  {
    title: "CareerGapAI",
    tag: "AI · In progress",
    blurb:
      "Tells you which skills stand between you and a target job. It analyzes up to 30 live Google Jobs postings, measures how often each skill is asked for, scores your gaps by demand and by how many skills they unlock, and orders them into a prerequisite-aware learning roadmap.",
    stack: ["Python", "FastAPI", "SerpAPI", "Pydantic"],
    repo: "https://github.com/SunilAnnes14/CareerGapAI",
  },
  {
    title: "Voice Cloner",
    tag: "Deep learning",
    blurb:
      "Neural text-to-speech with zero-shot voice cloning: give it 6–30 seconds of someone speaking and it reads any text aloud in that voice, in 17 languages. Built on Coqui XTTS-v2 with an audio preprocessing pipeline, cached speaker embeddings, a FastAPI service and a browser recorder, plus a consent check and an AI-generated label on every output.",
    stack: ["Python", "PyTorch", "Coqui XTTS-v2", "FastAPI", "librosa"],
    repo: "https://github.com/SunilAnnes14/voice-cloner",
  },
  {
    title: "Kolly Guess Game",
    tag: "Game",
    blurb:
      "The classic KOLLYWOOD paper game as a real-time multiplayer web app. Players take turns hiding a film's hero, heroine, movie and song; everyone races to guess them with nine chances. Answers are validated server-side so nobody can cheat.",
    stack: ["React 19", "TypeScript", "Convex", "Tailwind v4", "Framer Motion"],
    href: "https://attividuuu.vercel.app/",
    repo: "https://github.com/SunilAnnes14/kolly-guess-game",
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
    period: "2022 – 2026 · 3rd year",
    points: [
      "Coursework in linear algebra, neural networks, statistical modeling, big data systems and algorithm optimization.",
      "Neural Networks and Deep Learning mini project: Voice Cloner, zero-shot voice cloning with Coqui XTTS-v2.",
    ],
  },
  {
    company: "Personal projects",
    role: "Full-stack & AI builder",
    period: "2024 – present",
    points: [
      "Built MoviQ (Angular + Node.js + Socket.IO + MongoDB), CareerGapAI, Stavlos AI (multi-agent trading in paper mode), Kolly Guess Game (React 19 + Convex) and a Web3 smart-contract dApp.",
      "Co-built Chennai Flood Watch with team CR7 Flows: a live flood-safety site with React, Leaflet and FastAPI.",
    ],
  },
  {
    company: "Technical projects",
    role: "Full-stack web development",
    period: "2023 – 2024",
    points: [
      "Built client-server apps with TypeScript, Angular, Node.js, Express and MongoDB, with reactive state management in RxJS.",
    ],
  },
  {
    company: "State Board",
    role: "Higher Secondary Certificate, Computer Science",
    period: "2020 – 2022",
    points: ["Foundations in mathematics, physics, and programming in C++ and Python."],
  },
];

/** Shown when a blank is fired. Keep them short. */
export const funFacts = [
  "First, solve the problem. Then, write the code. (John Johnson)",
  "Probably debugging with coffee right now.",
  "Currently learning Docker. The containers are winning.",
  "Callsign: sunil@sk-linux.",
  "My last portfolio booted into SK-Linux 1.0 LTS.",
  "Always shipping something new.",
];

/** Dossier sections and the round you need to clear to unlock each one. */
export const SECTIONS = [
  { id: "about", label: "About", unlockAt: 1 },
  { id: "skills", label: "Skills", unlockAt: 1 },
  { id: "projects", label: "Projects", unlockAt: 2 },
  { id: "experience", label: "Timeline", unlockAt: 3 },
  { id: "contact", label: "Contact", unlockAt: 3 },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
