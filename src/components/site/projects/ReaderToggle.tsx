"use client";

import { motion } from "motion/react";
import type { Reader } from "@/content/projectHighlights";

const OPTIONS: { value: Reader; label: string; hint: string }[] = [
  { value: "recruiter", label: "Recruiter", hint: "Simple" },
  { value: "developer", label: "Developer", hint: "Technical" },
];

/** "Read it as a… Recruiter | Developer" segmented control. */
export function ReaderToggle({ value, onChange }: { value: Reader; onChange: (r: Reader) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span id="reader-label" className="text-xs uppercase tracking-[0.25em] text-stone-500">
        Read it as a…
      </span>
      <div
        role="radiogroup"
        aria-labelledby="reader-label"
        className="relative inline-flex rounded-md border border-stone-700 bg-black/40 p-1"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            onChange(value === "recruiter" ? "developer" : "recruiter");
          }
        }}
      >
        {OPTIONS.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(o.value)}
              className={`relative rounded px-3 py-1.5 text-xs uppercase tracking-[0.2em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-amber-300/70 ${
                active ? "text-amber-100" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="reader-pill"
                  className="absolute inset-0 rounded border border-amber-300/50 bg-amber-300/10"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  aria-hidden
                />
              )}
              <span className="relative">
                {o.label}
                <span className="ml-1.5 hidden text-[10px] normal-case tracking-normal text-stone-500 sm:inline">({o.hint})</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
