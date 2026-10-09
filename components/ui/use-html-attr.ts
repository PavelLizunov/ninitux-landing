"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Current value of an attribute of <html>, kept in sync when it changes.
 * The boot script and the tabs write page-wide choices (language, system)
 * there; the server render and the first client render use `fallback`.
 */
export function useHtmlAttr(name: string, fallback: string): string {
  const subscribe = useCallback(
    (notify: () => void) => {
      const observer = new MutationObserver(notify);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: [name] });
      return () => observer.disconnect();
    },
    [name],
  );
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute(name) ?? fallback,
    () => fallback,
  );
}

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(notify: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

/** True when the visitor asked the system for less motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}
