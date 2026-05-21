"use client";

import { useCallback, useEffect, useState } from "react";
import { T } from "@/components/i18n/t";

interface Tile {
  id: string;
  size: "wide" | "tall" | "med";
  badge: string;
  thumbLabel: string;
  media?: { type: "video" | "img"; src: string; poster?: string; ruSrc?: string; ruPoster?: string };
  ru: { title: string; sub: string };
  en: { title: string; sub: string };
}

const TILES: Tile[] = [
  {
    id: "main",
    size: "wide",
    badge: "webm",
    thumbLabel: "main flow",
    media: {
      type: "video",
      src: "/media/guide-main.webm",
      poster: "/media/guide-main.jpg",
      ruSrc: "/media/guide-main.ru.webm",
      ruPoster: "/media/guide-main.ru.jpg",
    },
    en: { title: "Main flow", sub: "install → subscribe → pick apps" },
    ru: { title: "Главный сценарий", sub: "установка → подписка → выбор приложений" },
  },
  {
    id: "settings",
    size: "tall",
    badge: "webm",
    thumbLabel: "advanced",
    media: { type: "video", src: "/media/guide-settings.webm", poster: "/media/guide-settings.jpg" },
    en: { title: "Advanced", sub: "settings, one click away" },
    ru: { title: "Advanced", sub: "настройки, один клик" },
  },
  {
    id: "subscribe",
    size: "med",
    badge: "png",
    thumbLabel: "subscribe",
    media: { type: "img", src: "/media/shot-subscribe.png" },
    en: { title: "Subscribe", sub: "one URL, many servers" },
    ru: { title: "Subscribe", sub: "один URL, много серверов" },
  },
  {
    id: "apps",
    size: "med",
    badge: "webm",
    thumbLabel: "applications",
    media: {
      type: "video",
      src: "/media/guide-apps.webm",
      poster: "/media/guide-apps.jpg",
      ruSrc: "/media/guide-apps.ru.webm",
      ruPoster: "/media/guide-apps.ru.jpg",
    },
    en: { title: "Applications", sub: "pick processes for the tunnel" },
    ru: { title: "Applications", sub: "выбор процессов для тоннеля" },
  },
  {
    id: "free",
    size: "med",
    badge: "webm",
    thumbLabel: "free pool",
    media: { type: "video", src: "/media/guide-free.webm", poster: "/media/guide-free.jpg" },
    en: { title: "Free", sub: "≈25k public configs" },
    ru: { title: "Free", sub: "≈25 тыс публичных конфигов" },
  },
];

/**
 * Screenshots grid — 6 colorful tiles (wide/tall/med), real .webm/.png media,
 * click to enlarge in lightbox with full controls. ESC and backdrop close.
 */
export function Screenshots() {
  const [openTile, setOpenTile] = useState<Tile | null>(null);
  const [lang, setLang] = useState<"ru" | "en">("en");

  useEffect(() => {
    const v = document.documentElement.getAttribute("data-lang");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (v === "ru" || v === "en") setLang(v);
    const observer = new MutationObserver(() => {
      const cur = document.documentElement.getAttribute("data-lang");
      if (cur === "ru" || cur === "en") setLang(cur);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-lang"],
    });
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => setOpenTile(null), []);

  useEffect(() => {
    if (!openTile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openTile, close]);

  const mediaSrc = (t: Tile) =>
    t.media?.type === "video" && lang === "ru" && t.media.ruSrc
      ? t.media.ruSrc
      : t.media?.src;
  const mediaPoster = (t: Tile) =>
    t.media?.type === "video" && lang === "ru" && t.media.ruPoster
      ? t.media.ruPoster
      : t.media?.poster;

  return (
    <section className="section" id="screenshots">
      <div className="section-h">
        <div className="num" style={{ color: "var(--purple)" }}>
          04
        </div>
        <h2>
          <T ru="Как" en="How it" />{" "}
          <em>
            <T ru="выглядит" en="looks" />
          </em>
          .
        </h2>
        <div className="meta">{"// click any tile to enlarge"}</div>
      </div>

      <div className="shot-grid">
        {TILES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`shot ${t.size}`}
            data-shot
            onClick={() => setOpenTile(t)}
          >
            <div className="frame">
              <span className="badge-png">{t.badge}</span>
              {t.media?.type === "video" ? (
                <video
                  src={mediaSrc(t)}
                  poster={mediaPoster(t)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : t.media ? (
                <img
                  src={t.media.src}
                  alt={t.en.title}
                  loading="lazy"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span>{t.thumbLabel}</span>
              )}
            </div>
            <div className="cap">
              <T ru={t.ru.title} en={t.en.title} />
              <span className="sub">
                <T ru={t.ru.sub} en={t.en.sub} />
              </span>
            </div>
          </button>
        ))}
      </div>

      {openTile && (
        <div
          className="lightbox show"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            className="close"
            aria-label="close"
            onClick={close}
          >
            ✕
          </button>
          <div className="box">
            <div className="frame">
              {openTile.media?.type === "video" ? (
                <video
                  key={mediaSrc(openTile)}
                  src={mediaSrc(openTile)}
                  poster={mediaPoster(openTile)}
                  controls
                  autoPlay
                  loop
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
                />
              ) : openTile.media ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={openTile.media.src}
                  alt={openTile.en.title}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : null}
            </div>
            <div className="cap">
              <T
                ru={`${openTile.ru.title} — ${openTile.ru.sub}`}
                en={`${openTile.en.title} — ${openTile.en.sub}`}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
