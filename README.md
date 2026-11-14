# The Interview

A portfolio you have to survive. You sit across a desk from the Recruiter, a figure in a suit with a CRT monitor for a head. Between you is a shotgun loaded with a known number of live and blank shells in an unknown order. Clearing each of the three rounds unlocks more of the dossier: About, Skills, Projects, Experience and Contact.

| Route | What it is |
|---|---|
| `/` | The portfolio: hero with a live 3D view of the Recruiter's office, about, featured project, work, skills, experience and contact. |
| `/interview` | The game, in real-time 3D (React Three Fiber) with a lightweight 2D view as a toggle and automatic fallback. A 7-step tutorial opens on the first turn and can be skipped or replayed from "How to play". |

`/resume` redirects to `/`.

### 3D assets

All models are procedural (three.js primitives, extrusions and canvas textures), so there are no model or texture files to download. They live in `src/components/three/assets/`: `Room`, `Desk`, `Recruiter` (its CRT screen renders live faces), `Shotgun`, `ShellModel` and `ItemModel`. Coordinates follow one contract: the desk top is at y=0, the player sits at +z and the Recruiter at -z.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # rules engine + AI + balance simulation
npm run typecheck
npm run lint
```

## Make it yours

All personal content is in [`src/content/portfolio.ts`](src/content/portfolio.ts): name, summary, links, skills, projects, experience, the fun facts shown on blanks, and the round that unlocks each dossier section.

## How it's built

| Layer | Where | Notes |
|---|---|---|
| Rules engine | `src/game/engine.ts` | Pure reducer `(state, action) => state` with a seeded RNG stored in state, so it's deterministic and fully unit-tested. No React. |
| Opponent AI | `src/game/ai.ts` | Probability-based: tracks remaining live/blank counts and what it privately knows, plays items, then shoots. Its gut-call rate drops each round. |
| Store & pacing | `src/game/store.ts` | Zustand. Each event sets `busy` for its animation's length; a director (`scheduleNext`) runs loading, reloading and the Recruiter's turns. |
| Sound | `src/game/sound.ts` | Synthesized with Web Audio, so there are no audio files. |
| 2.5D scene | `src/components/game/*` | CSS 3D desk plane, SVG art, pointer parallax and Motion animations. |
| Portfolio | `src/components/portfolio/Sections.tsx` | Shared by the in-game dossier and `/resume`. |

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

### Balance

`src/game/balance.test.ts` plays 2,000 games with a careful player against the AI. Current numbers: about 88% of players clear round 1 and about 42% win the whole interview. Tune `MISTAKE_RATE` (ai.ts), `PLAYER_BONUS_ITEMS` and `ROUNDS` (engine.ts).

## Roadmap

- [x] 2.5D version: engine, AI, scene, dossier
- [x] 3D version: React Three Fiber scene driven by the same engine and store
- [x] Portfolio homepage, tutorial, friendlier HUD
- [ ] Real content, OG image, deploy
