"use client";

import { useEffect } from "react";
import { useAnimate } from "motion/react";
import { TIMING, useGame } from "@/game/store";

/** Shotgun lying on the desk plane. Rotation happens within the plane: -90deg points at the Recruiter, 90deg at you. */
export function Shotgun() {
  const event = useGame((s) => s.game.event);
  const eventId = useGame((s) => s.game.eventId);
  const doubleDamage = useGame((s) => s.game.doubleDamage);
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    if (!scope.current || event?.kind !== "shot") return;
    const total = TIMING.shot / 1000;
    const fire = TIMING.fireAt / total / 1000;
    const rot = event.target === "recruiter" ? -90 : 90;
    // The holder lifts the gun on their side of the desk.
    const y = event.shooter === "player" ? 110 : -150;
    const z = event.shooter === "player" ? (event.target === "player" ? 260 : 150) : 90;
    const kick = event.shell === "live" ? (rot < 0 ? 26 : -26) : 0;
    const times = [0, 0.28, fire - 0.02, fire + 0.03, fire + 0.15, 0.8, 1];
    animate(
      scope.current,
      {
        rotate: [0, rot, rot, rot + (event.shell === "live" ? 6 : 0), rot, rot, 0],
        y: [0, y, y, y + kick, y, y, 0],
        z: [0, z, z, z + (event.shell === "live" ? 30 : 0), z, z, 0],
      },
      { duration: total, times, ease: "easeInOut" },
    );
    const flash = scope.current.querySelector("[data-flash]");
    if (flash && event.shell === "live") {
      animate(
        flash,
        { opacity: [0, 0, 1, 0], scale: [0.4, 0.4, 1.4, 1.8] },
        { duration: total, times: [0, fire - 0.005, fire + 0.01, fire + 0.08] },
      );
    }
    const smoke = scope.current.querySelector("[data-smoke]");
    if (smoke && event.shell === "live") {
      animate(
        smoke,
        { opacity: [0, 0, 0.5, 0], x: [0, 0, 30, 80], scale: [0.5, 0.5, 1.2, 2.4] },
        { duration: total, times: [0, fire, fire + 0.1, 0.9] },
      );
    }
  }, [eventId, event, animate, scope]);

  return (
    <div
      ref={scope}
      className="relative aspect-[520/120] w-full"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* contact shadow */}
      <div className="absolute inset-x-[4%] top-[55%] h-[40%] rounded-full bg-black/60 blur-md" />
      <svg viewBox="0 0 520 120" className="absolute inset-0 h-full w-full overflow-visible" aria-label="Shotgun" role="img">
        <defs>
          <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#8a5a34" />
            <stop offset="0.5" stopColor="#6a4022" />
            <stop offset="1" stopColor="#3e2412" />
          </linearGradient>
          <linearGradient id="metal" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#5c636b" />
            <stop offset="0.45" stopColor="#2c3136" />
            <stop offset="1" stopColor="#15181b" />
          </linearGradient>
        </defs>
        {/* stock */}
        <path d="M4 50 L150 38 L162 70 L120 76 L20 96 Q4 98 4 84 Z" fill="url(#wood)" stroke="#2a180b" strokeWidth="2" />
        <path d="M20 60 L130 48" stroke="#a87448" strokeOpacity="0.4" strokeWidth="2" />
        {/* receiver */}
        <rect x="148" y="34" width="110" height="40" rx="5" fill="url(#metal)" stroke="#0b0c0e" strokeWidth="2" />
        <rect x="176" y="44" width="44" height="8" rx="2" fill="#0b0c0e" />
        {/* trigger guard */}
        <path d="M180 74 Q190 98 214 92 L220 74" fill="none" stroke="#1a1d21" strokeWidth="5" />
        <path d="M200 74 L196 88" stroke="#1a1d21" strokeWidth="4" />
        {/* barrel */}
        <rect x="250" y="36" width="266" height="16" rx="3" fill="url(#metal)" stroke="#0b0c0e" strokeWidth="2" />
        {/* magazine tube */}
        <rect x="256" y="54" width="230" height="12" rx="3" fill="#202428" stroke="#0b0c0e" strokeWidth="2" />
        {/* pump */}
        <rect x="300" y="50" width="96" height="22" rx="6" fill="url(#wood)" stroke="#2a180b" strokeWidth="2" />
        {[312, 324, 336, 348, 360, 372, 384].map((x) => (
          <line key={x} x1={x} y1="53" x2={x} y2="69" stroke="#2a180b" strokeOpacity="0.6" />
        ))}
        {/* bead sight */}
        <circle cx="508" cy="34" r="3" fill="#c9c2ae" />
        {/* "FRIDAY DEPLOY" sticker */}
        {doubleDamage && (
          <g>
            <rect x="420" y="30" width="70" height="26" rx="3" fill="#c9a227" transform="rotate(-6 455 43)" />
            <text x="455" y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1a1a1a" transform="rotate(-6 455 43)">
              x2 DMG
            </text>
          </g>
        )}
      </svg>
      {/* muzzle flash */}
      <div
        data-flash
        className="absolute right-[-14%] top-[-30%] h-[160%] w-[30%] rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle, #fff 0%, #ffe9a8 25%, #ff9a3c 45%, rgba(255,80,20,0) 70%)",
          filter: "blur(2px)",
        }}
      />
      <div data-smoke className="absolute right-[-20%] top-[-10%] h-[120%] w-[30%] rounded-full bg-stone-400/40 opacity-0 blur-xl" />
    </div>
  );
}
