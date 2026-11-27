"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

/** Small floating button that appears after you scroll down, styled as a shell standing on its brass head. */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setShow(window.scrollY > 900);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {show && (
          <motion.button
            key="top"
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.92 }}
            className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full border border-stone-700 bg-[#0d0e10]/90 shadow-[0_10px_30px_rgba(0,0,0,0.5)] outline-none backdrop-blur hover:border-amber-300/50 focus-visible:ring-2 focus-visible:ring-amber-300/80"
          >
            <svg viewBox="0 0 24 40" className="h-7 w-4" aria-hidden>
              <rect x="4" y="1" width="16" height="26" rx="3" fill="#b3261e" />
              <rect x="4" y="1" width="16" height="26" rx="3" fill="url(#btt-sheen)" />
              <rect x="3" y="25" width="18" height="12" rx="1.5" fill="#d4a845" />
              <rect x="2" y="35" width="20" height="4" rx="1" fill="#a07a2c" />
              <defs>
                <linearGradient id="btt-sheen" x1="0" x2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
                  <stop offset="1" stopColor="#000" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
