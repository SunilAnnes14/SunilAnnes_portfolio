"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Reader } from "@/content/projectHighlights";

const KEY = "portfolio:project-reader";
const EVENT = "portfolio:project-reader-change";

function read(): Reader {
  try {
    return window.localStorage.getItem(KEY) === "developer" ? "developer" : "recruiter";
  } catch {
    return "recruiter";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The visitor's chosen reading, remembered in localStorage. Server render uses "recruiter". */
export function useReader(): [Reader, (r: Reader) => void] {
  const reader = useSyncExternalStore(subscribe, read, () => "recruiter" as const);
  const setReader = useCallback((r: Reader) => {
    try {
      window.localStorage.setItem(KEY, r);
    } catch {
      /* storage unavailable: the choice just won't be remembered */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [reader, setReader];
}
