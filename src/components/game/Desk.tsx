"use client";

import { AnimatePresence, motion } from "motion/react";
import { ITEMS } from "@/game/items";
import { useGame } from "@/game/store";
import type { Shell } from "@/game/types";
import { ItemIcon, ShellGlyph } from "./icons";
import { Shotgun } from "./Shotgun";

/** Shells laid out on the desk while loading: grouped (not in firing order), then swept into the gun. */
function LoadReveal() {
  const phase = useGame((s) => s.game.phase);
  const busy = useGame((s) => s.busy);
  const info = useGame((s) => s.game.loadInfo);
  const eventId = useGame((s) => s.game.eventId);
  const show = phase === "loading" && busy;
  const shells: Shell[] = [
    ...Array<Shell>(info.live).fill("live"),
    ...Array<Shell>(info.blank).fill("blank"),
  ];
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={eventId}
          className="absolute left-1/2 top-[23%] flex -translate-x-1/2 justify-center gap-[2%]"
          style={{ width: "50%" }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          {shells.map((kind, i) => (
            <motion.div
              key={i}
              className="w-[4.5%] min-w-[16px] flex-none"
              initial={{ opacity: 0, y: -60 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [-60, 0, 0, -140],
                scale: [1, 1, 1, 0.6],
              }}
              transition={{ duration: 2.9, delay: i * 0.12, times: [0, 0.15, 0.7, 1], ease: "easeInOut" }}
            >
              <ShellGlyph kind={kind} className="w-full drop-shadow-[0_6px_6px_rgba(0,0,0,0.7)]" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SpentPile() {
  const spent = useGame((s) => s.game.spent);
  return (
    <div className="absolute right-[8%] top-[12%] h-[20%] w-[18%]" aria-hidden>
      {spent.map((kind, i) => (
        <motion.div
          key={i}
          className="absolute w-[18%] min-w-[14px]"
          initial={{ opacity: 0, x: -120, y: 40, rotate: 0 }}
          animate={{ opacity: 0.85, x: (i % 4) * 22, y: Math.floor(i / 4) * 26, rotate: 70 + ((i * 37) % 50) }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.9 }}
          style={{ left: "10%", top: "10%" }}
        >
          <ShellGlyph kind={kind} className="w-full" />
        </motion.div>
      ))}
    </div>
  );
}

function RecruiterItems() {
  const items = useGame((s) => s.game.items.recruiter);
  return (
    <div className="absolute left-1/2 top-[3.5%] flex w-[70%] -translate-x-1/2 justify-center gap-[1.5%]">
      <AnimatePresence>
        {items.map((id, i) => (
          <motion.div
            key={`${id}-${i}`}
            layout
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40, scale: 1.3 }}
            className="flex aspect-[3/4] w-[5.5%] min-w-[30px] flex-col items-center justify-center rounded-md border border-stone-600/60 bg-[#1b1d20] text-amber-200/80 shadow-[0_8px_12px_rgba(0,0,0,0.6)]"
            title={`Recruiter's ${ITEMS[id].name}`}
          >
            <ItemIcon id={id} className="w-[55%]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** The desk, drawn on a tilted 3D plane for the 2.5D look. */
export function Desk() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-[52%]"
      style={{ perspective: "900px", perspectiveOrigin: "50% -40%" }}
    >
      <div
        className="absolute left-1/2 top-0 h-[190%] w-[min(1200px,150vw)]"
        style={{
          transform: "translateX(-50%) rotateX(56deg)",
          transformOrigin: "50% 0%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* wood */}
        <div
          className="absolute inset-0 rounded-t-[18px]"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 37px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 11px), linear-gradient(180deg, #4a2d18, #2e1b0e 60%, #1a0f07)",
            boxShadow: "inset 0 12px 30px rgba(0,0,0,0.6), 0 -4px 0 #5e3a20",
          }}
        />
        {/* lamp pool of light */}
        <div
          className="pointer-events-none absolute left-1/2 top-[4%] h-[60%] w-[70%] -translate-x-1/2 [animation:flicker_7s_infinite]"
          style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,214,150,0.22), transparent 65%)" }}
        />
        {/* desk mat */}
        <div className="absolute left-1/2 top-[12%] h-[30%] w-[58%] -translate-x-1/2 rounded-xl border border-black/50 bg-gradient-to-b from-[#1f3a2c] to-[#132219] shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]" />
        {/* nameplate */}
        <div className="absolute left-[12%] top-[3%] hidden w-[14%] rounded-sm border border-[#8a6a2a] bg-gradient-to-b from-[#c9a24a] to-[#7d5e22] px-2 py-1 text-center font-display text-[11px] uppercase tracking-widest text-[#2a1e08] shadow-lg md:block">
          The Recruiter
          <div className="text-[8px] tracking-[0.2em] opacity-70">Talent Acquisition</div>
        </div>
        {/* coffee ring */}
        <div className="absolute left-[16%] top-[30%] h-[8%] w-[7%] rounded-full border-[3px] border-[#20140a]/70" />

        <RecruiterItems />
        <SpentPile />
        <LoadReveal />

        <div className="absolute left-1/2 top-[14.5%] w-[32%] -translate-x-1/2" style={{ transformStyle: "preserve-3d" }}>
          <Shotgun />
        </div>
      </div>
    </div>
  );
}
