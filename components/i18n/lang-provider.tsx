"use client";

import { useEffect } from "react";

/**
 * Reads saved language from localStorage on mount and applies it to
 * <html data-lang>. CSS in globals.css hides the inactive language via
 * [data-lang="..."] selectors. All bilingual strings render as sibling spans
 * with data-i18n="ru" / data-i18n="en".
 *
 * SSR defaults to "en" (matches main.html prototype). On client mount, if the
 * user stored a preference or has navigator.language=ru, we switch — but only
 * AFTER first paint so SSR HTML matches the initial client tree.
 */
export function LangProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let target: "ru" | "en" = "en";
    try {
      const stored = localStorage.getItem("ninitux_lang");
      if (stored === "ru" || stored === "en") {
        target = stored;
      } else if (
        typeof navigator !== "undefined" &&
        navigator.language?.toLowerCase().startsWith("ru")
      ) {
        target = "ru";
      }
    } catch {
      /* ignore — fall back to en */
    }
    if (document.documentElement.getAttribute("data-lang") !== target) {
      document.documentElement.setAttribute("data-lang", target);
      document.documentElement.setAttribute("lang", target);
    }
  }, []);

  return <>{children}</>;
}
