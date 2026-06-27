"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { T } from "@/components/i18n/t";
import { LangToggle } from "@/components/i18n/lang-toggle";
import { MobileDrawer } from "@/components/layout/mobile-drawer";

const NAV = [
  { href: "#install", ru: "установка", en: "install" },
  { href: "#features", ru: "фичи", en: "features" },
  { href: "#how", ru: "как", en: "how" },
  { href: "#screenshots", ru: "скрины", en: "shots" },
  { href: "#telemetry", ru: "телеметрия", en: "telemetry" },
  { href: "#faq", ru: "FAQ", en: "FAQ" },
] as const;

/**
 * Sticky topbar with ninitux brand sticker (★ ninitux.com), section nav,
 * lang toggle. When scrolled > 12px, adds `.scrolled` class — that triggers
 * ink border + lime shadow underline.
 *
 * Rendered INSIDE .wrap (matches main.html structure).
 */
export function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={scrolled ? "topbar scrolled" : "topbar"} id="topbar">
        <div className="topbar-inner">
          <Link className="brand" href="/" aria-label="ninitux.com">
            <span className="star">★</span> ninitux.com
          </Link>
          <nav className="nav">
            {NAV.map((item) => (
              <a key={item.href} className="nl" href={item.href}>
                <T ru={item.ru} en={item.en} />
              </a>
            ))}
            <LangToggle />
          </nav>
          <div className="nav-mobile">
            <button
              type="button"
              id="mobile-open"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
            >
              ≡
            </button>
          </div>
        </div>
      </header>
      {drawerOpen && <MobileDrawer onClose={() => setDrawerOpen(false)} />}
    </>
  );
}
