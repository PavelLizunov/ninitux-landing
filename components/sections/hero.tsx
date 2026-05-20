"use client";

import { useEffect, useState } from "react";
import { T } from "@/components/i18n/t";

interface Release {
  tag_name: string;
  assets: Array<{ name: string; size: number; browser_download_url: string }>;
}

function fmtSize(bytes: number) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/**
 * Hero — eyebrow + multi-line headline with pop/yel/strike/underline,
 * lede, CTA row with live version from GitHub Releases API, trust pills,
 * penguin sticker on the right with 3 attached stickers (wobble animation).
 */
export function Hero() {
  const [version, setVersion] = useState("v0.7.4");
  const [size, setSize] = useState("~14 MB");

  useEffect(() => {
    fetch("https://api.github.com/repos/PavelLizunov/VPNRouter/releases/latest")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Release) => {
        if (data.tag_name) setVersion(data.tag_name);
        const winAsset = data.assets?.find(
          (a) =>
            a.name.endsWith("-win.zip") &&
            !a.name.includes("update") &&
            !a.name.endsWith(".sha256"),
        );
        if (winAsset) setSize(fmtSize(winAsset.size));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero-grid">
        <div>
          <p className="eyebrow">
            <span className="blink"></span>{" "}
            <T
              ru="Virtual Penguin Network · работает"
              en="Virtual Penguin Network · live"
            />
          </p>

          <h1 className="headline" data-i18n="en">
            Not a <span className="strike">tunnel</span>.<br />
            A <span className="pop">router</span> for<br />
            <span className="underline">your apps.</span>
          </h1>
          <h1 className="headline" data-i18n="ru">
            Не <span className="strike">тоннель</span>.<br />
            <span className="pop">Роутер</span> для<br />
            <span className="underline">ваших приложений.</span>
          </h1>

          <p className="lede" data-i18n="en">
            <em>Pick which programs go through the proxy</em> — Slack, your
            torrent client, that one website. Everything else stays direct, on
            the open net. <b>Windows, macOS, Linux.</b> Open source.
          </p>
          <p className="lede" data-i18n="ru">
            <em>Выберите какие приложения идут через прокси</em> — Slack,
            торрент-клиент, один сайт. Всё остальное идёт напрямую, по обычной
            сети. <b>Windows, macOS, Linux.</b> Open source.
          </p>

          <div className="cta-row">
            <a className="cta" href="#install">
              <T ru="Установить →" en="Install →" />
            </a>
            <a
              className="cta secondary"
              href="https://github.com/PavelLizunov/VPNRouter"
              target="_blank"
              rel="noopener noreferrer"
            >
              ★ <T ru="Поставить звезду на GitHub" en="Star on GitHub" />
            </a>
            <span className="cta-meta">
              <T ru="последняя" en="latest" /> <b id="hero-ver">{version}</b> ·{" "}
              <b id="hero-size">{size}</b> · sha256 ✓
            </span>
          </div>

          <div className="trust-row">
            <span className="pill">
              <span className="dot"></span> GPL-3.0
            </span>
            <span className="pill">
              <span className="dot"></span> sing-box{" "}
              <T ru="core" en="core" />
            </span>
            <span className="pill">
              <span className="dot"></span> VLESS + Reality
            </span>
            <span className="pill">
              <span className="dot"></span>{" "}
              <T ru="без демона" en="no daemon" />
            </span>
          </div>
        </div>

        <div className="hero-pen-wrap">
          <div className="hero-pen" role="img" aria-label="Penguin mascot"></div>
          <span className="hero-sticker sticker-1">★ very cool</span>
          <span className="hero-sticker sticker-2">
            <T ru="это роутер!!" en="it's a router!!" />
          </span>
          <span className="hero-sticker sticker-3">{version} · GPL-3</span>
        </div>
      </div>
    </section>
  );
}
