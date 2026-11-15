# The Interview: Sunil Annes S K's portfolio

A portfolio you have to survive. You sit across a desk from the Recruiter, a figure in a suit with a CRT monitor for a head. Between you is a shotgun loaded with a known number of live and blank shells in an unknown order. Clear each of the three rounds to unlock more of the dossier: About, Skills, Projects, Timeline and Contact.

| Route | What it is |
|---|---|
| `/` | The portfolio: a hero with a live 3D view of the Recruiter's office, about, the featured game, project highlights, skills, timeline and contact. |
| `/interview` | The game in real-time 3D (React Three Fiber), with a lightweight 2D view as a toggle and an automatic fallback. A 7-step tutorial opens on the first turn and can be skipped or replayed from "How to play". |

`/resume` redirects to `/`. Unknown pages show a themed 404, and the site has a generated share image (`/opengraph-image`) and an SVG icon.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # rules engine + AI + balance simulation
npm run typecheck
npm run lint
npm run build      # production build; every route is prerendered as static
```

## Edit the content

All personal content is in [`src/content/portfolio.ts`](src/content/portfolio.ts): profile, links, skills, project highlights, timeline, the fun facts shown on blank shots, and the round that unlocks each dossier section.

## Deploy

The site is fully static, so any Next.js host works. On Vercel:

1. Push this repo to GitHub.
2. Import it at https://vercel.com/new. The defaults are correct, with no environment variables required.
3. Optional: if you use a custom domain, set `NEXT_PUBLIC_SITE_URL` (for example `https://sunil.dev`) so share-image links use it. Without it, Vercel's production URL is used automatically.

## How it's built

| Layer | Where | Notes |
|---|---|---|
| Rules engine | `src/game/engine.ts` | Pure reducer `(state, action) => state` with a seeded RNG stored in state, so it's deterministic and fully unit-tested. No React. |
| Opponent AI | `src/game/ai.ts` | Probability-based: tracks remaining live/blank counts and what it privately knows, uses items, then shoots. Its gut-call rate drops each round. |
| Store & pacing | `src/game/store.ts` | Zustand. Each event sets `busy` for its animation's length, and a director (`scheduleNext`) runs loading, reloading and the Recruiter's turns. Also holds the tutorial step and the 3D/2D view choice. |
| 3D scene | `src/components/three/` | `GameScene3D` (camera rig, lighting, gun animation, desk items, post-processing) and `HeroScene3D` (homepage teaser). |
| 3D assets | `src/components/three/assets/` | Procedural models built from three.js primitives, extrusions and canvas textures, so there are no model files: `Room`, `Desk`, `Recruiter` (its CRT screen renders live faces), `Shotgun`, `ShellModel`, `ItemModel`. The desk top is at y=0, the player sits at +z and the Recruiter at -z. |
| 2D scene | `src/components/game/Scene25D.tsx` | CSS 3D desk plane, SVG art and pointer parallax, for the 2D view and devices without WebGL. |
| Game UI | `src/components/game/` | HUD, controls, tutorial, overlays and the dossier. |
| Sound | `src/game/sound.ts` | Synthesized with Web Audio, so there are no audio files. |

### Items

| Item | Effect |
|---|---|
| Debugger | Reveal the chambered shell |
| Stack Trace | Reveal a random later shell |
| Hotfix | Eject the chambered shell |
| Coffee | +1 composure |
| Merge Conflict | Opponent skips their next turn |
| Refactor | Invert the chambered shell |
| Friday Deploy | Next live shot deals 2 |

### Extras

- **Difficulty:** Easy (the default) gives you +1 composure, 2 bonus items per reload, and a Recruiter that makes more mistakes. Normal is the even fight. The choice is saved in the browser.
- **Pop quiz:** on every second reload the Recruiter asks a dev/AI interview question (`src/content/quiz.ts`). A correct answer earns a random item from the round's pool. The game pauses while the quiz is open.
- **Speech bubbles:** the Recruiter reacts to shots, items and reloads (`src/content/recruiterLines.ts`). Click it to poke it.
- **Achievements:** 8 unlockables (`src/game/achievements.ts`), shown as pop-ups, listed on the end screens and in the dossier, and saved in the browser.

### Balance

`src/game/balance.test.ts` plays 2,000 games per setting against the AI:

| Mode | Player | Clears round 1 | Wins the interview |
|---|---|---|---|
| Easy | careful | ~97% | ~72% |
| Easy | casual (35% hunches) | ~96% | ~68% |
| Normal | careful | ~89% | ~42% |

Tune `MISTAKE_RATES` (ai.ts), and `DIFFICULTY` and `ROUNDS` (engine.ts).
