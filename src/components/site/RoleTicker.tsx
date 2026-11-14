"use client";

import { useEffect, useState } from "react";

/** Cycles through role titles. Each one slides in with a CSS animation that always ends visible. */
export function RoleTicker({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % roles.length), 2600);
    return () => window.clearInterval(id);
  }, [roles.length]);
  return (
    <span className="inline-block" aria-label={roles.join(", ")}>
      <span key={i} aria-hidden className="inline-block whitespace-nowrap [animation:role-in_0.4s_ease-out]">
        {roles[i]}
      </span>
    </span>
  );
}
