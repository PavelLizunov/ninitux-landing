"use client";

import { useCallback, useEffect, useState } from "react";

type Lang = "ru" | "en";

/**
 * EN/RU segmented toggle. Matches main.html `.seg` class structure inside
 * `.topbar .nav`. Sync state from <html data-lang> on mount so LangProvider's
 * effect wins.
 */
export function LangToggle() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const v = document.documentElement.getAttribute("data-lang");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (v === "ru" || v === "en") setLang(v);
  }, []);

  const set = useCallback((value: Lang) => {
    setLang(value);
    document.documentElement.setAttribute("data-lang", value);
    document.documentElement.setAttribute("lang", value);
    try {
      localStorage.setItem("ninitux_lang", value);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="seg" role="group" aria-label="Language">
      <button
        type="button"
        data-lang="en"
        aria-pressed={lang === "en"}
        onClick={() => set("en")}
      >
        EN
      </button>
      <button
        type="button"
        data-lang="ru"
        aria-pressed={lang === "ru"}
        onClick={() => set("ru")}
      >
        RU
      </button>
    </div>
  );
}
