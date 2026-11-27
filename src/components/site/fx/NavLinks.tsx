"use client";

import { useEffect, useState } from "react";
import { MotionConfig, motion } from "motion/react";

export interface NavItem {
  href: `#${string}`;
  label: string;
}

/** Desktop nav links; the one for the section you're reading lights up with a sliding underline. */
export function NavLinks({ links }: { links: NavItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) return setActive(ids[ids.length - 1]);
      // The active section is the last one whose top has passed 40% of the viewport.
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [links]);

  return (
    <MotionConfig reducedMotion="user">
      <ul className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] md:flex">
        {links.map((l) => {
          const on = active === l.href.slice(1);
          return (
            <li key={l.href} className="relative">
              <a
                href={l.href}
                aria-current={on ? "true" : undefined}
                className={`rounded px-0.5 py-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-amber-300/80 ${
                  on ? "text-amber-200" : "text-stone-400 hover:text-stone-100"
                }`}
              >
                {l.label}
              </a>
              {on && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1.5 left-0 right-0 h-px bg-amber-300"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ul>
    </MotionConfig>
  );
}
