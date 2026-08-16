"use client";

import { useEffect, useState } from "react";
import { T } from "@/components/i18n/t";
import type { Release } from "@/lib/github";

type OS = "linux" | "mac" | "win" | "android";

const FALLBACK = "https://github.com/PavelLizunov/VPNRouter/releases/latest";

interface AssetLinkSpec {
  label: string;
  suffix?: string;
  match?: "win-zip";
  event: string;
}

const LINUX_ASSETS: AssetLinkSpec[] = [
  { label: ".deb", suffix: "-linux-amd64.deb", event: "dl-deb" },
  { label: ".AppImage", suffix: ".AppImage", event: "dl-appimage" },
  { label: ".tar.gz", suffix: "-linux.tar.gz", event: "dl-targz" },
];
const MAC_ASSETS: AssetLinkSpec[] = [
  { label: ".dmg", suffix: "-mac.dmg", event: "dl-dmg" },
  { label: ".zip", suffix: "-mac.zip", event: "dl-mac-zip" },
];
const WIN_ASSETS: AssetLinkSpec[] = [
  { label: ".zip", match: "win-zip", event: "dl-win-zip" },
];

function fmtSize(b: number) {
  if (!b && b !== 0) return "";
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
  return (b / (1024 * 1024)).toFixed(1) + " MB";
}

function CopyButton({
  text,
  event,
}: {
  text: string;
  event: string;
}) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className={ok ? "copy ok" : "copy"}
      data-copy={text}
      data-umami-event={event}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
          } catch {
            /* ignore */
          }
          ta.remove();
        }
        setOk(true);
        setTimeout(() => setOk(false), 1400);
      }}
    >
      {ok ? (
        <T ru="скопир." en="copied" />
      ) : (
        <T ru="копир." en="copy" />
      )}
    </button>
  );
}

function ManualLinks({
  specs,
  release,
}: {
  specs: AssetLinkSpec[];
  release: Release;
}) {
  return (
    <div className="manual">
      <span className="lbl">
        <T ru="вручную:" en="manual:" />
      </span>
      {specs.map((spec) => {
        const asset = release.assets.find((a) => {
          if (spec.match === "win-zip") {
            return (
              a.name.endsWith("-win.zip") &&
              !a.name.includes("update") &&
              !a.name.endsWith(".sha256")
            );
          }
          return spec.suffix ? a.name.endsWith(spec.suffix) : false;
        });
        // release is always non-null with direct URLs, but a specific suffix
        // might not exist in this version — fall back to releases/latest then.
        const href = asset?.browser_download_url ?? FALLBACK;
        const ver = asset
          ? `· ${release.tag_name}${asset.size ? ` · ${fmtSize(asset.size)}` : ""}`
          : "";
        return (
          <a key={spec.label} href={href} data-umami-event={spec.event}>
            {spec.label} <span className="ver">{ver}</span>
          </a>
        );
      })}
    </div>
  );
}

/**
 * Android card — sideload-only, no Play Store, no one-liner. So instead of
 * a cmd-box + copy button it shows a single big "Download .apk" CTA pulled
 * from the latest GitHub Release. Matches the same `.os-card` skeleton as
 * the other three so the grid stays consistent.
 */
function AndroidCard({
  detected,
  release,
}: {
  detected: boolean;
  release: Release;
}) {
  const asset = release.assets.find((a) =>
    a.name.endsWith("-android-arm64.apk"),
  );
  // Deterministic direct .apk URL — github.com 302 redirect resolves it to
  // the CDN with Content-Disposition: attachment, so the browser downloads
  // immediately. FALLBACK only if the android suffix somehow isn't built.
  const href = asset?.browser_download_url ?? FALLBACK;
  const verSize = asset
    ? `· ${release.tag_name}${asset.size ? ` · ${fmtSize(asset.size)}` : ""}`
    : "";

  return (
    <div
      className={detected ? "os-card detected" : "os-card"}
      data-os="android"
    >
      <span className="badge">apk · sideload</span>
      <span className="detected-tag">
        <T ru="ваша OS" en="your OS" />
      </span>
      <h3>
        <span className="glyph">🤖</span> Android
      </h3>
      <p className="blurb" data-i18n="en">
        Android 6.0+ (API 23), ARM64. Sideload, no Play Store. Self-update
        via in-app banner.
      </p>
      <p className="blurb" data-i18n="ru">
        Android 6.0+ (API 23), ARM64. Sideload, без Play Store.
        Самообновление через баннер в приложении.
      </p>
      <a
        className="apk-btn"
        href={href}
        data-umami-event="dl-apk"
      >
        <span className="glyph">↓</span>{" "}
        <T ru="Скачать .apk" en="Download .apk" />{" "}
        <span className="ver">{verSize}</span>
      </a>
      <div className="hint">
        <T ru="разрешить sideload:" en="allow sideload:" />
        <span className="kbd">Settings</span> →{" "}
        <span className="kbd">Apps</span> →{" "}
        <span className="kbd">Install unknown</span>
      </div>
      <span className="req" data-i18n="en">
        only 3 perms · CAMERA · INTERNET · VPN_SERVICE
      </span>
      <span className="req" data-i18n="ru">
        всего 3 пермишена · CAMERA · INTERNET · VPN_SERVICE
      </span>
    </div>
  );
}

/**
 * Install section — 4 OS cards (Linux / macOS / Windows / Android). The first
 * three share a one-liner + copy button shape; Android instead has a single
 * big download CTA (no Play Store, sideload-only). Cards pulled from GitHub
 * Releases API. Detected OS gets `.detected` outlined dash + "your OS" tag.
 */
export function Install({ release }: { release: Release }) {
  // Only OS detection stays client-side (depends on navigator). Release data
  // is now passed as a server-rendered prop so download links carry the
  // correct browser_download_url in the very first HTML byte — clicking the
  // APK button no longer redirects to the GitHub release page while waiting
  // for a client fetch to resolve.
  const [detected, setDetected] = useState<OS | null>(null);

  useEffect(() => {
    const ua = (navigator.userAgent || "").toLowerCase();
    const plat = (navigator.platform || "").toLowerCase();
    let next: OS = "linux";
    // Check Android first — Android UAs also contain "linux" (it's a kernel).
    if (ua.includes("android")) next = "android";
    else if (ua.includes("windows") || plat.includes("win")) next = "win";
    else if (ua.includes("mac") || plat.includes("mac")) next = "mac";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDetected(next);
  }, []);

  return (
    <section className="section" id="install">
      <div className="section-h">
        <div className="num" style={{ color: "var(--blue)" }}>
          01
        </div>
        <h2>
          <T ru="Выберите" en="Pick an" /> <em>OS</em>.{" "}
          <T ru="Вставьте команду. Готово." en="Paste the line. Done." />
        </h2>
        <div className="meta">{"// install · 1 command each"}</div>
      </div>

      <div className="os-grid">
        {/* Linux */}
        <div
          className={detected === "linux" ? "os-card detected" : "os-card"}
          data-os="linux"
        >
          <span className="badge">apt · deb · curl</span>
          <span className="detected-tag">
            <T ru="ваша OS" en="your OS" />
          </span>
          <h3>
            <span className="glyph">🐧</span> Linux
          </h3>
          <p className="blurb" data-i18n="en">
            Debian / Ubuntu / Mint / Pop. Signed apt repo, POSIX capabilities
            — no full-root daemon. Updates via <code>apt upgrade</code>.
          </p>
          <p className="blurb" data-i18n="ru">
            Debian / Ubuntu / Mint / Pop. Подписанный apt-репо, POSIX
            capabilities — без полного root. Обновления через{" "}
            <code>apt upgrade</code>.
          </p>
          <div className="cmd-box">
            <div className="cmd">
              <span className="pmt">$</span>curl <span className="flag">-fsSL</span>{" "}
              <span className="url">vpn.ninitux.com/install.sh</span> | sudo sh
            </div>
            <CopyButton
              text="curl -fsSL https://vpn.ninitux.com/install.sh | sudo sh"
              event="copy-install-linux"
            />
          </div>
          <div className="hint">
            <T ru="терминал:" en="terminal:" />
            <span className="kbd">Ctrl</span>+<span className="kbd">Alt</span>+
            <span className="kbd">T</span>
          </div>
          <ManualLinks specs={LINUX_ASSETS} release={release} />
          <span className="req" data-i18n="en">
            sudo at install only · uses POSIX caps
          </span>
          <span className="req" data-i18n="ru">
            sudo только при установке · POSIX caps
          </span>
        </div>

        {/* macOS */}
        <div
          className={detected === "mac" ? "os-card detected" : "os-card"}
          data-os="mac"
        >
          <span className="badge">homebrew · cask</span>
          <span className="detected-tag">
            <T ru="ваша OS" en="your OS" />
          </span>
          <h3>
            <span className="glyph">🍎</span> macOS
          </h3>
          <p className="blurb" data-i18n="en">
            Apple Silicon. Auto-strips Gatekeeper quarantine. One-time
            sudoers prompt, then passwordless. <code>brew upgrade</code>.
          </p>
          <p className="blurb" data-i18n="ru">
            Apple Silicon. Снимает Gatekeeper quarantine автоматически. Один
            раз sudoers, дальше без пароля. <code>brew upgrade</code>.
          </p>
          <div className="cmd-box">
            <div className="cmd">
              <span className="pmt">$</span>brew install{" "}
              <span className="flag">--cask</span>{" "}
              pavellizunov/vpnrouter/vpnrouter
            </div>
            <CopyButton
              text="brew install --cask pavellizunov/vpnrouter/vpnrouter"
              event="copy-install-mac"
            />
          </div>
          <div className="hint">
            <T ru="терминал:" en="terminal:" />
            <span className="kbd">⌘</span>+<span className="kbd">Space</span> →{" "}
            <span className="kbd">Terminal</span>
          </div>
          <ManualLinks specs={MAC_ASSETS} release={release} />
          <span className="req">macOS 12+ · Apple Silicon only</span>
        </div>

        {/* Windows */}
        <div
          className={detected === "win" ? "os-card detected" : "os-card"}
          data-os="win"
        >
          <span className="badge">powershell · admin</span>
          <span className="detected-tag">
            <T ru="ваша OS" en="your OS" />
          </span>
          <h3>
            <span className="glyph">🪟</span> Windows
          </h3>
          <p className="blurb" data-i18n="en">
            Windows 10/11 x64. Auto-elevates via UAC, registers in Start
            Menu. Optional Zapret bundled for DPI bypass.
          </p>
          <p className="blurb" data-i18n="ru">
            Windows 10/11 x64. Авто-elevate через UAC, регистрируется в
            Start Menu. Опциональный Zapret для DPI bypass.
          </p>
          <div className="cmd-box">
            <div className="cmd">
              <span className="pmt">&gt;</span>iwr{" "}
              <span className="flag">-useb</span>{" "}
              <span className="url">vpn.ninitux.com/install.ps1</span> | iex
            </div>
            <CopyButton
              text="iwr -useb https://vpn.ninitux.com/install.ps1 | iex"
              event="copy-install-win"
            />
          </div>
          <div className="hint">
            <T ru="PowerShell админ:" en="PowerShell admin:" />
            <span className="kbd">Win</span>+<span className="kbd">X</span>
          </div>
          <ManualLinks specs={WIN_ASSETS} release={release} />
          <span className="req" data-i18n="en">
            requires admin · Windows 10 / 11
          </span>
          <span className="req" data-i18n="ru">
            нужен админ · Windows 10 / 11
          </span>
        </div>

        {/* Android */}
        <AndroidCard detected={detected === "android"} release={release} />
      </div>

      <p
        style={{
          marginTop: 22,
          textAlign: "center",
          fontFamily: "var(--mono)",
          fontSize: 13,
          color: "var(--ink-mute)",
        }}
      >
        <T ru="→ все релизы на" en="→ all releases on" />{" "}
        <a
          href="https://github.com/PavelLizunov/VPNRouter/releases"
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="click-releases"
          style={{ fontWeight: 700, color: "var(--ink)" }}
        >
          GitHub
        </a>
        &nbsp;·&nbsp;
        <T
          ru="проверка контрольных сумм:"
          en="verify checksums:"
        />{" "}
        <a
          href="https://github.com/PavelLizunov/VPNRouter/releases"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: 700, color: "var(--ink)" }}
        >
          SHA256SUMS
        </a>
      </p>
    </section>
  );
}
