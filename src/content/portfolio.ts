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
    { label: "Previous portfolio", href: "https://sunilannesskportfolio.vercel.app/" },
    // TODO: add LinkedIn (and Kaggle) once you have the exact profile URLs.
  ],
  resumeUrl: "#",
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "Java", "C", "SQL", "HTML & CSS"] },
  { group: "Frontend", items: ["Angular", "React", "Next.js", "Tailwind CSS", "RxJS", "Sass", "Three.js"] },
  { group: "Backend & data", items: ["Node.js", "Express", "Flask", "Spring Boot", "MongoDB", "PostgreSQL", "MySQL", "Firebase"] },
  { group: "AI & ML", items: ["Scikit-learn", "Pandas", "Jupyter", "Matplotlib", "NLP"] },
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
    tag: "AI · In progress",
    blurb:
      "A career gap analyzer and upskilling engine. It finds the skills you're missing for a target role, maps how they depend on each other, pulls live market evidence through SerpAPI, and builds a prioritized learning roadmap.",
    stack: ["Python", "FastAPI", "NLP", "SerpAPI"],
    repo: "https://github.com/SunilAnnes14/CareerGapAI",
  },
  {
    title: "CineVault",
    tag: "Full-stack",
    blurb:
      "A movie review and rating platform with real-time search, genre filters, 5-star ratings, reviews and watchlists. JWT auth with role-based access gives admins catalog management and review moderation.",
    stack: ["Angular", "TypeScript", "Node.js", "Express", "MongoDB"],
    repo: "https://github.com/SunilAnnes14/movie-review-system",
  },
  {
    title: "Kolly Guess Game",
    tag: "Game",
    blurb:
      "A Kollywood cinema guessing game with 3D visuals in Three.js, a Convex backend with authentication, and Framer Motion transitions.",
    stack: ["React 19", "TypeScript", "Three.js", "Convex", "Tailwind v4"],
    href: "https://attividuuu.vercel.app/",
    repo: "https://github.com/SunilAnnes14/kolly-guess-game",
  },
  {
    title: "Loan Approval ML",
    tag: "Machine learning",
    blurb:
      "A loan approval classifier: exploratory data analysis, feature engineering and supervised classification on financial loan data to predict applicant creditworthiness.",
    stack: ["Python", "Scikit-learn", "Pandas", "Matplotlib", "Jupyter"],
    repo: "https://github.com/SunilAnnes14/loan_project_ML",
  },
  {
    title: "Hello Blockchain",
    tag: "Web3",
    blurb:
      "My first Web3 dApp: a Solidity smart contract on a local Hardhat chain that stores and updates a message, with a frontend that reads and writes it through Ethers.js.",
    stack: ["Solidity", "Hardhat", "Ethers.js", "TypeScript"],
    repo: "https://github.com/SunilAnnes14/hello-blockchain",
  },
  {
    title: "Inside the Machine",
    tag: "Portfolio v1",
    blurb:
      "My previous portfolio: a retro amber CRT computer running \"SK-Linux\", with BIOS boot text, CRT page transitions, a hidden command line and 3D project cartridges.",
    stack: ["JavaScript", "GSAP", "Three.js", "HTML & CSS"],
    href: "https://sunilannesskportfolio.vercel.app/",
    repo: "https://github.com/SunilAnnes14/sunilannes_SK_portfolio",
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
    ],
  },
  {
    company: "Personal projects",
    role: "Full-stack & AI builder",
    period: "2024 – present",
    points: [
      "Built CareerGapAI, CineVault (Angular + Node.js + MongoDB), Kolly Guess Game (React 19 + Convex) and a Web3 smart-contract dApp.",
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
