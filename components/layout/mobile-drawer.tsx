"use client";

import { useEffect } from "react";
import { T } from "@/components/i18n/t";

const ITEMS = [
  { href: "#install", ru: "установка", en: "install" },
  { href: "#features", ru: "фичи", en: "features" },
  { href: "#how", ru: "как работает", en: "how it works" },
  { href: "#screenshots", ru: "скриншоты", en: "screenshots" },
  { href: "#telemetry", ru: "телеметрия", en: "telemetry" },
  { href: "#faq", ru: "FAQ", en: "FAQ" },
  { href: "#services", ru: "другие сервисы", en: "other services" },
] as const;

/**
 * Mobile drawer — opens via the ≡ button in topbar on viewports < 720px.
 * Locks body scroll while open. Closes on backdrop click, × button, or Esc.
 */
export function MobileDrawer({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="mobile-drawer open"
      id="mobile-drawer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="panel" role="dialog" aria-label="Меню">
        <button
          type="button"
          className="close"
          id="mobile-close"
          aria-label="close"
          onClick={onClose}
        >
          ×
        </button>
        {ITEMS.map((item) => (
          <a key={item.href} href={item.href} onClick={onClose}>
            <T ru={item.ru} en={item.en} />
          </a>
        ))}
        <a
          href="https://github.com/PavelLizunov/VPNRouter"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          ★ GitHub
        </a>
        <a
          href="https://boosty.to/ninitux"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          ♥ Boosty
        </a>
      </div>
    </div>
  );
}
