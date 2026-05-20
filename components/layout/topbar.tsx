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
  { href: "#compare", ru: "сравнение", en: "compare" },
  { href: "#telemetry", ru: "телеметрия", en: "telemetry" },
  { href: "#faq", ru: "FAQ", en: "FAQ" },
  { href: "#services", ru: "сервисы", en: "services" },
] as const;

/**
 * Sticky topbar with ninitux brand sticker (★ ninitux.com), section nav,
 * lang toggle and login button. When scrolled > 12px, adds `.scrolled`
 * class — that triggers ink border + lime shadow underline.
 *
 * Rendered INSIDE .wrap (matches main.html structure).
 *
 * The /auth/check call happens on mount: if 200, Login → Logout.
 */
export function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/auth/check")
      .then((r) => {
        if (r.ok) setAuthed(true);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <header className={scrolled ? "topbar scrolled" : "topbar"} id="topbar">
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
          <a
            className="auth-btn"
            id="auth-btn"
            href={authed ? "/auth/logout" : "/auth/login?next=https://ninitux.com"}
            data-umami-event={authed ? "click-logout" : "click-login"}
          >
            {authed ? (
              <T ru="Выйти" en="Logout" />
            ) : (
              <T ru="Войти" en="Login" />
            )}
          </a>
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
      </header>
      {drawerOpen && <MobileDrawer onClose={() => setDrawerOpen(false)} />}
    </>
  );
}
