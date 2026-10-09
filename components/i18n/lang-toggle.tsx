"use client";

import { useHtmlAttr } from "@/components/ui/use-html-attr";

type Lang = "ru" | "en";

/**
 * RU/EN switch. The boot script has already set <html data-lang>; a click
 * rewrites the attribute and remembers the choice.
 */
export function LangToggle() {
  const lang = useHtmlAttr("data-lang", "ru");

  function choose(value: Lang) {
    document.documentElement.setAttribute("data-lang", value);
    document.documentElement.setAttribute("lang", value);
    try {
      localStorage.setItem("ninitux_lang", value);
    } catch {
      /* private mode: the choice lasts until the page is closed */
    }
  }

  return (
    <div className="seg" role="group" aria-label="Язык / Language">
      <button type="button" aria-pressed={lang === "ru"} onClick={() => choose("ru")}>
        RU
      </button>
      <button type="button" aria-pressed={lang === "en"} onClick={() => choose("en")}>
        EN
      </button>
    </div>
  );
}
