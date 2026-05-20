"use client";

import { useEffect, useState } from "react";
import { T } from "@/components/i18n/t";

type OS = "linux" | "mac" | "win";

interface Release {
  tag_name: string;
  assets: Array<{ name: string; size: number; browser_download_url: string }>;
}

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
  release: Release | null;
}) {
  return (
    <div className="manual">
      <span className="lbl">
        <T ru="вручную:" en="manual:" />
      </span>
      {specs.map((spec) => {
        const asset = release?.assets.find((a) => {
          if (spec.match === "win-zip") {
            return (
              a.name.endsWith("-win.zip") &&
              !a.name.includes("update") &&
              !a.name.endsWith(".sha256")
            );
          }
          return spec.suffix ? a.name.endsWith(spec.suffix) : false;
        });
        const href = asset?.browser_download_url ?? FALLBACK;
        const ver = asset
          ? `· ${release?.tag_name ?? ""} · ${fmtSize(asset.size)}`
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
 * Install section — 3 OS cards (Linux/macOS/Windows), each with badge, blurb,
 * cmd-box with copy button, terminal-open hint with kbd keys, manual download
 * links pulled from GitHub Releases API. The detected OS gets `.detected`
 * outlined dash and shows "your OS" tag.
 */
export function Install() {
  const [detected, setDetected] = useState<OS | null>(null);
  const [release, setRelease] = useState<Release | null>(null);

  useEffect(() => {
    const ua = (navigator.userAgent || "").toLowerCase();
    const plat = (navigator.platform || "").toLowerCase();
    let next: OS = "linux";
    if (ua.includes("windows") || plat.includes("win")) next = "win";
    else if (ua.includes("mac") || plat.includes("mac")) next = "mac";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDetected(next);

    fetch("https://api.github.com/repos/PavelLizunov/VPNRouter/releases/latest")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Release) => setRelease(data))
      .catch(() => {});
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
          <span className="badge">apt · pacman · curl</span>
          <span className="detected-tag">
            <T ru="ваша OS" en="your OS" />
          </span>
          <h3>
            <span className="glyph">🐧</span> Linux
          </h3>
          <p className="blurb" data-i18n="en">
            curl, sudo, capabilities. No system daemon, no full-root nonsense.
          </p>
          <p className="blurb" data-i18n="ru">
            curl, sudo, capabilities. Без системного демона, без полного root.
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
            Signed cask. One sudoers entry, never asked again. utun adapter.
          </p>
          <p className="blurb" data-i18n="ru">
            Подписанный cask. Один раз sudoers и больше не спрашивает. utun.
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
          <span className="req">macOS 12+ · Apple Silicon &amp; Intel</span>
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
            TUN driver + ETW listener + optional Zapret module for DPI bypass.
          </p>
          <p className="blurb" data-i18n="ru">
            TUN-драйвер + ETW listener + опциональный Zapret для DPI bypass.
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
