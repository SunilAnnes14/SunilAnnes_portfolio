"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { DemoKind } from "@/content/projectHighlights";
import s from "./MiniDemo.module.css";

const STEPS = 16; // 16 × 250ms = a 4s loop
const TICK_MS = 250;
const FINAL = STEPS - 2; // last fully-built frame (the very last step fades out before looping)

/** Step counter that loops while playing, freezes when paused, and sits on the final frame for reduced motion. */
function useDemoClock(paused: boolean, reduced: boolean) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => setStep((v) => (v + 1) % STEPS), TICK_MS);
    return () => window.clearInterval(id);
  }, [paused, reduced]);
  return reduced ? FINAL : step;
}

const on = (visible: boolean) => ({ opacity: visible ? 1 : 0 });
const grow = (visible: boolean, axis: "X" | "Y" = "X") => ({ transform: `scale${axis}(${visible ? 1 : 0})` });

const C = {
  text: "#e7e5e4",
  dim: "#78716c",
  line: "#3f3a36",
  amber: "#fcd34d",
  red: "#ef4444",
  blue: "#7dd3fc",
};

function CareerGap({ step }: { step: number }) {
  const title = "ML Engineer";
  const typed = title.slice(0, Math.min(title.length, step * 2));
  const skills = [
    { name: "python", w: 92 },
    { name: "sql", w: 76 },
    { name: "docker", w: 58 },
    { name: "aws", w: 42 },
  ];
  const nodes = [
    { x: 178, y: 88, label: "python" },
    { x: 200, y: 68, label: "sql" },
    { x: 178, y: 48, label: "docker" },
    { x: 200, y: 28, label: "aws" },
  ];
  return (
    <>
      <text x="10" y="17" fontSize="10" fill={C.amber} fontWeight="700">
        {typed}
        <tspan className={s.cursor} fill={C.amber}>
          ▍
        </tspan>
      </text>
      <text x="10" y="31" fontSize="6.5" fill={C.dim}>
        demand across 30 postings
      </text>
      {skills.map((k, i) => (
        <g key={k.name} transform={`translate(0 ${42 + i * 15})`}>
          <text x="10" y="6" fontSize="7" fill={C.text}>
            {k.name}
          </text>
          <rect x="44" y="0" width="100" height="7" rx="2" fill={C.line} />
          <rect
            className={`${s.t} ${s.originLeft}`}
            x="44"
            y="0"
            width={k.w}
            height="7"
            rx="2"
            fill={C.amber}
            style={grow(step >= 6 + i)}
          />
        </g>
      ))}
      {/* roadmap: prerequisites first */}
      {nodes.slice(1).map((n, i) => (
        <line
          key={`l${i}`}
          className={s.t}
          x1={nodes[i].x}
          y1={nodes[i].y}
          x2={n.x}
          y2={n.y}
          stroke={C.amber}
          strokeWidth="1.5"
          strokeDasharray="3 2"
          style={on(step >= 11 + i)}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={n.label} className={`${s.t} ${s.originCenter}`} style={{ ...on(step >= 10 + i), transform: `scale(${step >= 10 + i ? 1 : 0.4})` }}>
          <circle cx={n.x} cy={n.y} r="5" fill="#0b0c0e" stroke={C.amber} strokeWidth="1.5" />
          <text x={n.x + 9} y={n.y + 2.5} fontSize="6.5" fill={C.text}>
            {i + 1}. {n.label}
          </text>
        </g>
      ))}
    </>
  );
}

const WAVE = [6, 14, 9, 20, 12, 24, 10, 17, 8, 13];

function Voice({ step }: { step: number }) {
  return (
    <>
      <text x="10" y="16" fontSize="7" fill={C.dim}>
        6–30s sample
      </text>
      {WAVE.map((h, i) => (
        <rect
          key={i}
          className={`${s.t} ${s.originBottom}`}
          x={12 + i * 6}
          y={64 - h}
          width="3.5"
          height={h * 2}
          rx="1.5"
          fill={C.blue}
          style={{ ...on(step >= 1 + Math.floor(i / 2)), transform: `scaleY(${step >= 1 + Math.floor(i / 2) ? 1 : 0.2})` }}
        />
      ))}
      {/* arrow */}
      <g className={s.t} style={{ ...on(step >= 6), transform: `translateX(${step >= 6 ? 0 : -10}px)` }}>
        <line x1="80" y1="64" x2="102" y2="64" stroke={C.dim} strokeWidth="1.5" />
        <path d="M100 60 L106 64 L100 68 Z" fill={C.dim} />
      </g>
      {/* voice model icon */}
      <g className={`${s.t} ${s.originCenter}`} style={{ ...on(step >= 7), transform: `scale(${step >= 8 ? 1 : 0.5})` }}>
        <circle cx="122" cy="64" r="14" fill="#1c1917" stroke={C.amber} strokeWidth="1.5" />
        <rect x="118" y="55" width="8" height="12" rx="4" fill={C.amber} />
        <path d="M114 64 a8 8 0 0 0 16 0" fill="none" stroke={C.amber} strokeWidth="1.5" />
        <line x1="122" y1="72" x2="122" y2="75" stroke={C.amber} strokeWidth="1.5" />
      </g>
      <text x="108" y="94" fontSize="6.5" fill={C.dim} className={s.t} style={on(step >= 8)}>
        XTTS-v2
      </text>
      {/* cloned output plays out */}
      <g className={s.t} style={on(step >= 9)}>
        <text x="150" y="16" fontSize="7" fill={C.dim}>
          cloned voice
        </text>
        {WAVE.map((h, i) => (
          <rect
            key={i}
            className={s.eq}
            x={150 + i * 7}
            y={64 - h}
            width="4"
            height={h * 2}
            rx="1.5"
            fill={C.amber}
            style={{ animationDelay: `${(i % 5) * -110}ms` }}
          />
        ))}
        <text x="150" y="100" fontSize="6" fill={C.red}>
          ● AI-generated
        </text>
      </g>
    </>
  );
}

const POSTERS = ["#7c3aed", "#0e7490", "#b45309", "#be123c", "#15803d"];
const STAR = "M0,-5 L1.5,-1.6 L5,-1.5 L2.3,0.9 L3.1,4.6 L0,2.6 L-3.1,4.6 L-2.3,0.9 L-5,-1.5 L-1.5,-1.6 Z";

function CineVault({ step }: { step: number }) {
  const filteredOut = [1, 3]; // not sci-fi
  return (
    <>
      <g className={`${s.t} ${s.originLeft}`} style={{ ...on(step >= 3), transform: `scale(${step >= 3 ? 1 : 0.6})` }}>
        <rect x="10" y="8" width="42" height="13" rx="6.5" fill="#1c1917" stroke={C.amber} />
        <text x="31" y="17" fontSize="7" textAnchor="middle" fill={C.amber}>
          Sci-fi
        </text>
      </g>
      <text x="60" y="17" fontSize="6.5" fill={C.dim} className={s.t} style={on(step >= 3)}>
        filter applied
      </text>
      {POSTERS.map((c, i) => {
        const dim = step >= 5 && filteredOut.includes(i);
        const selected = i === 0 && step >= 7;
        return (
          <g
            key={i}
            className={`${s.t} ${s.originBottom}`}
            style={{ opacity: step >= 1 ? (dim ? 0.18 : 1) : 0, transform: `translateY(${step >= 1 ? 0 : 6}px)` }}
          >
            <rect x={10 + i * 45} y="28" width="38" height="52" rx="3" fill={c} />
            <rect x={10 + i * 45} y="28" width="38" height="52" rx="3" fill="url(#poster-shine)" />
            <rect x={10 + i * 45 + 6} y="68" width="26" height="3" rx="1" fill="#000" opacity="0.35" />
            {selected && <rect x={8 + i * 45} y="26" width="42" height="56" rx="4" fill="none" stroke={C.amber} strokeWidth="1.5" />}
          </g>
        );
      })}
      <defs>
        <linearGradient id="poster-shine" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((k) => (
        <g key={k} transform={`translate(${16 + k * 12} 95)`}>
          <path d={STAR} fill={C.line} />
          <path
            d={STAR}
            fill={C.amber}
            className={`${s.t} ${s.originCenter}`}
            style={{ ...on(step >= 8 + k), transform: `scale(${step >= 8 + k ? 1 : 0.3})` }}
          />
        </g>
      ))}
      <text x="80" y="98" fontSize="6.5" fill={C.dim} className={s.t} style={on(step >= 13)}>
        rated 5/5
      </text>
    </>
  );
}

const ANSWER = "GHILLI";
const KOLLYWOOD = "KOLLYWOOD";

function Kolly({ step }: { step: number }) {
  const wrong = [3, 7, 11].filter((t) => step >= t).length; // a miss every few steps
  const chances = 9 - wrong;
  return (
    <>
      <text x="10" y="15" fontSize="7" fill={C.dim}>
        guess the movie
      </text>
      {ANSWER.split("").map((ch, i) => {
        const shown = step >= 2 + i * 2;
        return (
          <g key={i} transform={`translate(${10 + i * 24} 24)`}>
            <rect width="20" height="24" rx="3" fill="#1c1917" stroke={shown ? C.amber : C.line} />
            <text
              x="10"
              y="17"
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill={C.amber}
              className={`${s.t} ${s.originCenter}`}
              style={{ ...on(shown), transform: `scaleY(${shown ? 1 : 0})` }}
            >
              {ch}
            </text>
          </g>
        );
      })}
      {/* chances: one KOLLYWOOD letter is crossed out per miss */}
      {KOLLYWOOD.split("").map((ch, i) => {
        const lost = i < wrong;
        return (
          <g key={i}>
            <text x={10 + i * 13} y="72" fontSize="10" fontWeight="700" fill={lost ? C.dim : C.text}>
              {ch}
            </text>
            <line
              className={`${s.t} ${s.originLeft}`}
              x1={8 + i * 13}
              y1="68"
              x2={19 + i * 13}
              y2="68"
              stroke={C.red}
              strokeWidth="1.6"
              style={grow(lost)}
            />
          </g>
        );
      })}
      <g transform="translate(162 26)">
        <text x="0" y="8" fontSize="6.5" fill={C.dim}>
          CHANCES
        </text>
        <text key={chances} x="0" y="34" fontSize="26" fontWeight="700" fill={chances < 9 ? C.red : C.amber} className={s.t}>
          {chances}
        </text>
      </g>
      <text x="10" y="96" fontSize="6.5" fill={C.dim}>
        answers checked server-side
      </text>
    </>
  );
}

const DEMOS: Record<DemoKind, (p: { step: number }) => React.ReactElement> = {
  careergap: CareerGap,
  voice: Voice,
  cinevault: CineVault,
  kolly: Kolly,
};

/** A looping 4-second SVG/CSS sketch of what the project does. */
export function MiniDemo({ kind, paused, label }: { kind: DemoKind; paused: boolean; label: string }) {
  const reduced = useReducedMotion() ?? false;
  const step = useDemoClock(paused, reduced);
  const Demo = DEMOS[kind];
  return (
    <div className="rounded-md border border-stone-800 bg-black/50">
      <svg
        viewBox="0 0 240 110"
        className={`${s.svg} ${paused ? s.paused : ""} block h-auto w-full`}
        role="img"
        aria-label={label}
        // The whole frame fades on the loop's last step, so restarting never looks like a glitch.
        style={{ opacity: step === STEPS - 1 ? 0 : 1, transition: "opacity 220ms ease" }}
      >
        <Demo step={step} />
      </svg>
    </div>
  );
}
