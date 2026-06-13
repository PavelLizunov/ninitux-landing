import { T } from "@/components/i18n/t";
import type { Release } from "@/lib/github";

function fmtSize(bytes: number) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/**
 * Hero — eyebrow + multi-line headline with pop/yel/strike/underline,
 * lede, CTA row, trust pills, penguin sticker with 3 attached stickers.
 *
 * `release` is fetched server-side in app/page.tsx (cached 10min) and passed
 * down — no more client fetch race where href stayed on fallback long enough
 * for the user to click. If fetch failed, we fall back to the latest known
 * version string so the visible info is still truthful.
 */
export function Hero({ release }: { release: Release }) {
  const version = release.tag_name;
  const winAsset = release.assets.find(
    (a) =>
      a.name.endsWith("-win.zip") &&
      !a.name.includes("update") &&
      !a.name.endsWith(".sha256"),
  );
  // size may be 0 if the HEAD size probe failed — show version only then.
  const size = winAsset && winAsset.size ? fmtSize(winAsset.size) : "";

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
            the open net. <b>Windows, macOS, Linux, Android.</b> Open source.
          </p>
          <p className="lede" data-i18n="ru">
            <em>Выберите какие приложения идут через прокси</em> — Slack,
            торрент-клиент, один сайт. Всё остальное идёт напрямую, по обычной
            сети. <b>Windows, macOS, Linux, Android.</b> Open source.
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
              <T ru="последняя" en="latest" /> <b id="hero-ver">{version}</b>
              {size ? (
                <>
                  {" · "}
                  <b id="hero-size">{size}</b>
                </>
              ) : null}{" "}
              · sha256 ✓
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
