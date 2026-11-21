"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "portfolio:shell-loader-sound";
const EVENT = "portfolio:shell-loader-sound-change";

function read(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "on";
  } catch {
    return false;
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

/** Shell Loader sound effects: off by default, remembered in localStorage. */
export function useSoundSetting(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(subscribe, read, () => false);
  const set = useCallback((value: boolean) => {
    try {
      window.localStorage.setItem(KEY, value ? "on" : "off");
    } catch {
      /* storage unavailable: the setting just won't be remembered */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [on, set];
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** True while the browser tab is visible. */
export function useTabVisible() {
  return useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => true);
}
