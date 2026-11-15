"use client";

import { useEffect } from "react";
import { motion, useAnimate, useMotionValue, useSpring, useTransform } from "motion/react";
import { TIMING, useGame } from "@/game/store";
import { Backdrop } from "./Backdrop";
import { Desk } from "./Desk";
import { Recruiter } from "./Recruiter";

/** Lightweight 2.5D scene (CSS 3D desk + SVG art). Used when 3D is off or unavailable. */
export function Scene25D() {
  const event = useGame((s) => s.game.event);
  const eventId = useGame((s) => s.game.eventId);
  const [scope, animate] = useAnimate<HTMLDivElement>();

  // Pointer parallax: each layer moves by its depth.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const backX = useTransform(sx, (v) => v * -12);
  const backY = useTransform(sy, (v) => v * -6);
  const midX = useTransform(sx, (v) => v * -24);
  const midY = useTransform(sy, (v) => v * -10);
  const frontX = useTransform(sx, (v) => v * -40);
  const frontRot = useTransform(sx, (v) => v * 1.5);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py]);

  // Screen shake on live shots; heavier when you're the one hit.
  useEffect(() => {
    if (!scope.current || event?.kind !== "shot" || event.shell !== "live") return;
    const hard = event.target === "player";
    const a = hard ? 18 : 7;
    animate(
      scope.current,
      { x: [0, -a, a * 0.8, -a * 0.5, a * 0.3, 0], y: [0, a * 0.6, -a * 0.5, a * 0.3, 0, 0] },
      { delay: TIMING.fireAt / 1000, duration: hard ? 0.55 : 0.35 },
    );
  }, [eventId, event, animate, scope]);

  return (
    <div ref={scope} className="absolute inset-0">
      <motion.div className="absolute -inset-[3%]" style={{ x: backX, y: backY }}>
        <Backdrop />
      </motion.div>
      <motion.div className="absolute bottom-[49.5%] left-1/2 h-[min(46vh,70vw)] w-[min(48vh,74vw)] -translate-x-1/2" style={{ x: midX, y: midY }}>
        <Recruiter interactive />
      </motion.div>
      <motion.div className="absolute inset-0" style={{ x: frontX, rotateZ: frontRot }}>
        <Desk />
      </motion.div>
    </div>
  );
}
