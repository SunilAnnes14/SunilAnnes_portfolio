"use client";

import { useEffect } from "react";
import { motion, useAnimate } from "motion/react";
import { faceFor } from "@/game/face";
import { TIMING, useGame } from "@/game/store";

export function Recruiter() {
  const game = useGame((s) => s.game);
  const busy = useGame((s) => s.busy);
  const [scope, animate] = useAnimate();
  const face = faceFor(game, busy);

  useEffect(() => {
    const e = game.event;
    if (!scope.current || e?.kind !== "shot") return;
    const delay = TIMING.fireAt / 1000;
    if (e.shell === "live" && e.target === "recruiter") {
      animate(
        scope.current,
        { y: [0, -26, 10, 0], rotate: [0, -5, 2, 0], scale: [1, 0.96, 1.01, 1] },
        { delay, duration: 0.7, ease: "easeOut" },
      );
    } else if (e.shell === "blank" && e.target === "recruiter") {
      animate(scope.current, { y: [0, -6, 0] }, { delay, duration: 0.3 });
    }
  }, [game.eventId, game.event, animate, scope]);

  const screenColor = face.tone === "hurt" ? "#ff6b5e" : face.tone === "glee" ? "#ffd166" : "#7dffb0";
  const thinking = game.phase === "turn" && game.turn === "recruiter" && !busy;

  return (
    <div ref={scope} className="relative h-full w-full origin-bottom">
      <svg viewBox="0 0 400 380" className="h-full w-full overflow-visible drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" role="img" aria-label="The Recruiter, a figure in a suit with an old CRT monitor for a head">
        <defs>
          <linearGradient id="suit" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#23262b" />
            <stop offset="1" stopColor="#0c0d0f" />
          </linearGradient>
          <linearGradient id="bezel" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#c9c2ae" />
            <stop offset="1" stopColor="#8d8676" />
          </linearGradient>
          <radialGradient id="screen" cx="0.5" cy="0.45" r="0.7">
            <stop offset="0" stopColor="#173826" />
            <stop offset="1" stopColor="#050c08" />
          </radialGradient>
          <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="rgba(0,0,0,0.35)" />
          </pattern>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* torso */}
        <path d="M40 380 C40 280 80 235 150 222 L250 222 C320 235 360 280 360 380 Z" fill="url(#suit)" />
        {/* lapels and shirt */}
        <path d="M168 222 L200 300 L232 222 Z" fill="#d8d3c8" />
        <path d="M150 222 L200 330 L170 380 L120 380 Z" fill="#1a1c20" />
        <path d="M250 222 L200 330 L230 380 L280 380 Z" fill="#1a1c20" />
        {/* tie */}
        <path d="M193 230 L207 230 L212 246 L218 320 L200 345 L182 320 L188 246 Z" fill="#7a1a1a" />
        <path d="M193 230 L207 230 L204 246 L196 246 Z" fill="#5c1313" />
        {/* lanyard badge */}
        <rect x="262" y="290" width="38" height="50" rx="3" fill="#e9e4d6" opacity="0.9" />
        <rect x="267" y="296" width="28" height="8" fill="#7a1a1a" />
        <rect x="267" y="310" width="28" height="3" fill="#888" />
        <rect x="267" y="317" width="20" height="3" fill="#888" />

        {/* neck stand */}
        <path d="M178 196 L222 196 L232 226 L168 226 Z" fill="#7b7466" />

        {/* monitor head */}
        <motion.g
          animate={thinking ? { rotate: [0, -2, 0, 2, 0] } : { rotate: 0 }}
          transition={thinking ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
          style={{ originX: "200px", originY: "200px" }}
        >
          <rect x="96" y="20" width="208" height="182" rx="14" fill="url(#bezel)" />
          <rect x="96" y="20" width="208" height="182" rx="14" fill="none" stroke="#5f594d" strokeWidth="3" />
          <rect x="116" y="38" width="168" height="126" rx="18" fill="url(#screen)" />
          <rect x="116" y="38" width="168" height="126" rx="18" fill="url(#scan)" />
          <text
            key={face.text}
            x="200"
            y="118"
            textAnchor="middle"
            fontSize="56"
            fill={screenColor}
            filter="url(#glow)"
            style={{ fontFamily: "var(--font-vt)" }}
            className={face.tone === "hurt" ? "[animation:glitch_0.25s_steps(2)_4]" : undefined}
          >
            {face.text}
          </text>
          {/* screen glare */}
          <path d="M126 50 Q160 42 200 44 L196 54 Q160 54 130 62 Z" fill="#fff" opacity="0.07" />
          {/* front panel */}
          <rect x="116" y="174" width="60" height="6" rx="2" fill="#6d675a" />
          <circle cx="276" cy="182" r="5" fill={busy || thinking ? "#7dffb0" : "#355c44"} />
          <circle cx="258" cy="182" r="4" fill="#5f594d" />
        </motion.g>

        {/* hands resting on the desk */}
        <ellipse cx="96" cy="370" rx="40" ry="18" fill="#c4a689" />
        <rect x="56" y="350" width="70" height="22" rx="10" fill="#14161a" />
        <ellipse cx="304" cy="370" rx="40" ry="18" fill="#c4a689" />
        <rect x="274" y="350" width="70" height="22" rx="10" fill="#14161a" />
      </svg>
    </div>
  );
}
