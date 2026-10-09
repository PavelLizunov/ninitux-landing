"use client";

import { useState } from "react";

/** A terminal command with a copy button. */
export function Command({ text, event }: { text: string; event: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing else to try: the command stays selectable */
      }
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="cmd">
      <code>{text}</code>
      <button type="button" className={copied ? "cmd-copy is-ok" : "cmd-copy"} data-umami-event={event} onClick={copy}>
        {copied ? (
          <>
            <span data-i18n="ru">Готово</span>
            <span data-i18n="en">Copied</span>
          </>
        ) : (
          <>
            <span data-i18n="ru">Копировать</span>
            <span data-i18n="en">Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
