"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { profile } from "@/content/portfolio";
import { shellProjects } from "@/content/projectHighlights";
import { LOAD_SHELL_EVENT } from "./events";

interface Command {
  id: string;
  group: "Go to" | "Load a shell" | "Do";
  label: string;
  hint?: string;
  keywords: string;
  run: () => void;
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
}

/** A CRT-style command bar (Ctrl+K / ⌘K) for jumping around the portfolio. */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const commands = useMemo<Command[]>(() => {
    const go = (id: string, label: string, keywords = ""): Command => ({
      id: `go-${id}`,
      group: "Go to",
      label,
      keywords,
      run: () => scrollToId(id),
    });
    const ext = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
    return [
      go("about", "About", "bio who intro"),
      go("work", "Work", "projects shells highlights"),
      go("skills", "Skills", "stack tech languages"),
      go("experience", "Timeline", "education journey experience"),
      go("contact", "Contact", "email talk hire"),
      ...shellProjects.map<Command>((p) => ({
        id: `shell-${p.id}`,
        group: "Load a shell",
        label: p.title,
        hint: p.status === "live" ? "shipped" : "in progress",
        keywords: `${p.label} ${p.stack.join(" ")}`,
        run: () => {
          scrollToId("work");
          window.dispatchEvent(new CustomEvent(LOAD_SHELL_EVENT, { detail: p.id }));
        },
      })),
      {
        id: "play",
        group: "Do",
        label: "Play The Interview",
        hint: "game",
        keywords: "game buckshot recruiter play",
        run: () => router.push("/interview"),
      },
      {
        id: "copy-email",
        group: "Do",
        label: "Copy email address",
        hint: profile.email,
        keywords: "mail contact clipboard",
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setToast("Email copied");
          } catch {
            window.location.href = `mailto:${profile.email}`;
          }
        },
      },
      ...profile.links.map<Command>((l) => ({
        id: `link-${l.label}`,
        group: "Do",
        label: `Open ${l.label}`,
        hint: "new tab",
        keywords: "profile social",
        run: () => ext(l.href),
      })),
      {
        id: "hire",
        group: "Do",
        label: "hire sunil",
        hint: "opens your mail app",
        keywords: "job internship offer recruit",
        run: () => {
          window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Let's talk about a role")}`;
        },
      },
    ];
  }, [router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.keywords}`.toLowerCase().includes(q));
  }, [commands, query]);

  const active = Math.min(cursor, Math.max(0, results.length - 1));

  // Global shortcut: Ctrl+K / ⌘K toggles the terminal.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const runCommand = (c: Command | undefined) => {
    if (!c) return;
    close();
    // Let the dialog close before scrolling or navigating.
    window.setTimeout(c.run, 60);
  };

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((active + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((active - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  let lastGroup = "";

  return (
    <MotionConfig reducedMotion="user">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command terminal (Ctrl+K)"
        aria-haspopup="dialog"
        className="hidden items-center gap-2 rounded-md border border-stone-700 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.2em] text-stone-400 outline-none transition-colors hover:border-stone-500 hover:text-stone-100 focus-visible:ring-2 focus-visible:ring-amber-300/80 sm:inline-flex"
      >
        <span className="text-amber-300/90">&gt;_</span>
        <kbd className="rounded border border-stone-700 px-1 py-px font-mono text-[10px] normal-case tracking-normal">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="terminal"
            className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command terminal"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-lg overflow-hidden rounded-lg border border-stone-700 bg-[#0a0b0a] font-mono shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 3px)" }}
            >
              <div className="flex items-center gap-2 border-b border-stone-800 px-4 py-3">
                <span className="shrink-0 text-sm text-amber-300">sunil@portfolio:~$</span>
                <input
                  ref={inputRef}
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCursor(0);
                  }}
                  onKeyDown={onInputKey}
                  placeholder="type a command…"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="terminal-results"
                  aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
                  className="min-w-0 flex-1 bg-transparent text-sm text-stone-100 caret-amber-300 outline-none placeholder:text-stone-600"
                />
                <kbd className="hidden rounded border border-stone-700 px-1.5 text-[10px] text-stone-500 sm:inline">Esc</kbd>
              </div>

              <ul id="terminal-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
                {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-stone-500">command not found</li>}
                {results.map((c, i) => {
                  const header = c.group !== lastGroup ? c.group : null;
                  lastGroup = c.group;
                  const on = i === active;
                  return (
                    <li key={c.id} role="presentation">
                      {header && <p className="px-3 pb-1 pt-3 text-[10px] uppercase tracking-[0.3em] text-stone-600">{header}</p>}
                      <div
                        id={`cmd-${c.id}`}
                        role="option"
                        aria-selected={on}
                        onMouseMove={() => setCursor(i)}
                        onClick={() => runCommand(c)}
                        className="relative flex cursor-pointer items-center justify-between gap-3 rounded px-3 py-2 text-sm"
                      >
                        {on && (
                          <motion.span
                            layoutId="terminal-cursor"
                            className="absolute inset-0 rounded border border-amber-300/40 bg-amber-300/10"
                            transition={{ type: "spring", stiffness: 600, damping: 40 }}
                            aria-hidden
                          />
                        )}
                        <span className={`relative ${on ? "text-amber-100" : "text-stone-300"}`}>
                          <span className="mr-2 text-stone-600">{on ? "›" : " "}</span>
                          {c.label}
                        </span>
                        {c.hint && <span className="relative truncate text-xs text-stone-500">{c.hint}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex gap-4 border-t border-stone-800 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-stone-600">
                <span>↑↓ move</span>
                <span>Enter run</span>
                <span>Esc close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            role="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 z-[71] -translate-x-1/2 rounded-md border border-emerald-400/40 bg-[#0a0b0a] px-4 py-2 font-mono text-sm text-emerald-300 shadow-lg"
          >
            {toast} ✓
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
