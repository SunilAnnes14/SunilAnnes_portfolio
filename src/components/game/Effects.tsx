"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TIMING, useGame } from "@/game/store";

/** Film grain, vignette, scanlines, plus flashes when a live shell fires. */
export function Effects() {
  const event = useGame((s) => s.game.event);
  const eventId = useGame((s) => s.game.eventId);
  const lowHp = useGame((s) => s.game.phase === "turn" && s.game.hp.player === 1);
  const [flash, setFlash] = useState<null | { id: number; hurt: boolean }>(null);

  useEffect(() => {
    if (event?.kind !== "shot" || event.shell !== "live") return;
    const t = setTimeout(() => setFlash({ id: eventId, hurt: event.target === "player" }), TIMING.fireAt);
    const off = setTimeout(() => setFlash(null), TIMING.fireAt + 900);
    return () => {
      clearTimeout(t);
      clearTimeout(off);
    };
  }, [event, eventId]);

  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-hidden>
      <AnimatePresence>
        {flash && (
          <motion.div
            key={flash.id}
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: flash.hurt ? 0.9 : 0.35 }}
            style={{
              background: flash.hurt
                ? "radial-gradient(ellipse at center, rgba(255,255,255,0.85), rgba(170,10,10,0.85) 70%)"
                : "rgba(255,240,210,0.35)",
            }}
          />
        )}
      </AnimatePresence>
      {lowHp && <div className="absolute inset-0 [animation:heartbeat_1.4s_infinite] [box-shadow:inset_0_0_140px_rgba(180,0,0,0.6)]" />}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(0deg,#000_0_1px,transparent_1px_3px)]" />
      <div className="grain absolute -inset-[50%] opacity-[0.09]" />
    </div>
  );
}
