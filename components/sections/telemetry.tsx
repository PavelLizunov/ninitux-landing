"use client";

import { useState } from "react";
import { T } from "@/components/i18n/t";

const VERIFY_TEXT = `git clone https://github.com/PavelLizunov/VPNRouter
grep -rE '(sentry|crashlytic|mixpanel|appmetrica|firebase-analytics|amplitude)' .
sudo tcpdump -i any
pktmon start`;

const KILL_TAGS = [
  "Sentry",
  "Crashlytics",
  "Mixpanel",
  "GA4",
  "AppMetrica",
  "Yandex.Metrika",
  "Firebase",
  "Amplitude",
  "PostHog",
];

/**
 * Telemetry: none. Black wrap with pink shadow, scrolling NO TRACKERS marquee
 * via ::before pseudo, big "none." statement, two cols (kill-tags + outgoing
 * connections list), terminal-style verify block with copy-all button.
 */
export function Telemetry() {
  const [copied, setCopied] = useState(false);

  return (
    <section className="section" id="telemetry">
      <div className="section-h">
        <div className="num" style={{ color: "var(--red)" }}>
          05
        </div>
        <h2>
          <T ru="Телеметрия:" en="Telemetry:" />{" "}
          <em>
            <T ru="нет" en="none" />
          </em>
          . <T ru="Проверяемо." en="Verifiable." />
        </h2>
        <div className="meta">{"// the part nobody else writes"}</div>
      </div>

      <div className="tele-wrap">
        <h3 className="tele-statement">
          <span className="none">none.</span>
          <em data-i18n="en">
            no analytics. no crash reports. no device IDs. no install UUIDs. no
            third-party SDKs at all.
          </em>
          <em data-i18n="ru">
            никакой аналитики. никаких crash-репортов. никаких device ID.
            никаких install UUID. вообще никаких сторонних SDK.
          </em>
        </h3>

        <div className="tele-cols">
          <div>
            <h4>
              <T ru="Чего нет в коде ↓" en="Not in the source ↓" />
            </h4>
            <div className="killtags">
              {KILL_TAGS.map((t) => (
                <span key={t}>{t}</span>
              ))}
              <span>
                <T ru="рекламные SDK" en="ad SDKs" />
              </span>
              <span>device ID</span>
              <span>install UUID</span>
            </div>
          </div>
          <div>
            <h4>
              <T
                ru="Что приложение реально шлёт ↓"
                en="Outgoing connections the app makes ↓"
              />
            </h4>
            <ul className="conn-list">
              <li>
                <span className="host">vpn.ninitux.com</span>
                <span className="why">
                  <T
                    ru="проверка обновлений и скачивание с проверкой SHA-256"
                    en="update check & SHA-256 binary download"
                  />
                </span>
              </li>
              <li>
                <span className="host">
                  <T ru="ваши VLESS / sing-box" en="your VLESS / sing-box" />
                </span>
                <span className="why">
                  <T
                    ru="сам тоннель — из ваших конфигов"
                    en="the actual tunnel, from your configs"
                  />
                </span>
              </li>
              <li>
                <span className="host">
                  <T ru="free-пул" en="free pool" />
                </span>
                <span className="why">
                  <T
                    ru="публичный список · обн. 6ч · только когда открыта Free"
                    en="public VLESS list · 6h refresh · only when Free tab open"
                  />
                </span>
              </li>
              <li>
                <span className="host">api.github.com</span>
                <span className="why">
                  <T
                    ru="манифест релизов для авто-обновления · опционально"
                    en="release manifest for auto-updater · optional"
                  />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="tele-verify">
          <button
            type="button"
            className={copied ? "copy-v ok" : "copy-v"}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(VERIFY_TEXT);
              } catch {
                /* ignore */
              }
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
          >
            {copied ? (
              <T ru="скопир." en="copied" />
            ) : (
              <T ru="копир. всё" en="copy all" />
            )}
          </button>
          <span className="c">
            # prove it to yourself — don&apos;t take my word for it
          </span>
          {"\n"}
          <span className="pmt">$</span> git clone
          https://github.com/PavelLizunov/VPNRouter{"\n"}
          <span className="pmt">$</span> grep -rE
          &quot;(sentry|crashlytic|mixpanel|appmetrica|firebase-analytics|amplitude)&quot;
          .{"\n\n"}
          <span className="c"># or watch the live traffic at runtime</span>
          {"\n"}
          <span className="pmt">$</span> sudo tcpdump -i any{"        "}
          <span className="c"># linux / macos</span>
          {"\n"}
          <span className="pmt">&gt;</span> pktmon start{"               "}
          <span className="c"># windows</span>
        </div>

        <p className="tele-site-note">
          <T
            ru={
              <>
                <b>Про этот сайт:</b> ninitux.com использует self-hosted Umami
                для счёта посещений (без cookies, без третьих сторон). Само
                приложение к этому сайту не обращается кроме endpoint обновлений
                выше.
              </>
            }
            en={
              <>
                <b>About this site:</b> ninitux.com uses self-hosted Umami for
                traffic counting (no cookies, no third parties). The app itself
                talks to nothing on this site beyond the update endpoint above.
              </>
            }
          />
        </p>
      </div>
    </section>
  );
}
