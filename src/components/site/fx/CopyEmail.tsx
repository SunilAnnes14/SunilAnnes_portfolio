"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Copies an address to the clipboard and confirms with a short "Copied" state. */
export function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; fall back to opening the mail app.
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`relative inline-flex min-w-[8.5rem] items-center justify-center gap-2 rounded-md border border-stone-600 px-4 py-3 text-sm uppercase tracking-[0.2em] text-stone-300 outline-none transition-colors hover:border-stone-400 hover:text-stone-100 focus-visible:ring-2 focus-visible:ring-amber-300/80 ${className}`}
      aria-label={copied ? "Email address copied" : `Copy ${email}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "copy"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className={copied ? "text-emerald-300" : undefined}
        >
          {copied ? "Copied ✓" : "Copy email"}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
