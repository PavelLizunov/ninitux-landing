"use client";

import { useState } from "react";
import { T } from "@/components/i18n/t";

type Filter = "all" | "routing" | "protocol" | "ops" | "open";

const FILTERS: { value: Filter; ru: string; en: string }[] = [
  { value: "all", ru: "все", en: "all" },
  { value: "routing", ru: "routing", en: "routing" },
  { value: "protocol", ru: "protocols", en: "protocols" },
  { value: "ops", ru: "ops", en: "ops" },
  { value: "open", ru: "open-source", en: "open-source" },
];

/**
 * Features grid — 7 colored cards + 1 big-stat block, click-to-filter chips.
 * Each card has a tag, f.NN number, bilingual heading + body. The big-stat
 * shows ≈25k pool with live count + pulse animation.
 */
export function Features() {
  const [filter, setFilter] = useState<Filter>("all");

  const isHidden = (cat: Filter) => filter !== "all" && filter !== cat;

  return (
    <section className="section feat-wrap" id="features">
      <div className="section-h">
        <div className="num" style={{ color: "var(--pink)" }}>
          02
        </div>
        <h2>
          <T ru="Что внутри" en="What's in the" />{" "}
          <em>
            <T ru="коробки" en="box" />
          </em>
          .
        </h2>
        <div className="meta">{"// 8 features · click to filter"}</div>
      </div>

      <div className="feat-filter" role="group" aria-label="filter">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            data-fil={f.value}
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            <T ru={f.ru} en={f.en} />
          </button>
        ))}
      </div>

      <div className="feat-grid">
        <div
          className="feat feat-1"
          data-cat="routing"
          hidden={isHidden("routing")}
        >
          <span className="tag">★ the point</span>
          <span className="num">f.01</span>
          <h4 data-i18n="en">Per-process routing</h4>
          <h4 data-i18n="ru">Маршрутизация по процессам</h4>
          <p data-i18n="en">
            Match by PID. Live process list. ETW watches for new processes
            and hot-reloads the sing-box config without dropping connections.
          </p>
          <p data-i18n="ru">
            Сопоставление по PID. Живой список процессов. ETW следит за новыми
            процессами и горячо перезагружает sing-box без обрыва соединений.
          </p>
        </div>

        <div
          className="feat feat-2"
          data-cat="protocol"
          hidden={isHidden("protocol")}
        >
          <span className="tag">built-in</span>
          <span className="num">f.02</span>
          <h4>VLESS + Reality</h4>
          <p data-i18n="en">
            Censorship-resistant transport, TLS fingerprinting that looks like
            a regular browser. No plugin, no helper.
          </p>
          <p data-i18n="ru">
            Цензуроустойчивый транспорт, TLS-fingerprint как у обычного
            браузера. Без плагина, без вспомогательного процесса.
          </p>
        </div>

        <div
          className="feat feat-3"
          data-cat="protocol"
          hidden={isHidden("protocol")}
        >
          <span className="tag">core</span>
          <span className="num">f.03</span>
          <h4 data-i18n="en">Bring your own sing-box</h4>
          <h4 data-i18n="ru">Свой sing-box</h4>
          <p data-i18n="en">
            Drop JSON in. VLESS, TUIC, Hysteria2, Shadowsocks — whatever you
            actually use.
          </p>
          <p data-i18n="ru">
            Вставьте JSON. VLESS, TUIC, Hysteria2, Shadowsocks — что у вас уже
            работает.
          </p>
        </div>

        <div
          className="feat feat-4"
          data-cat="protocol"
          hidden={isHidden("protocol")}
        >
          <span className="tag">auto-refresh</span>
          <span className="num">f.04</span>
          <h4 data-i18n="en">Subscription URLs</h4>
          <h4 data-i18n="ru">Subscription URL</h4>
          <p data-i18n="en">
            One link, many servers, refreshed on a schedule. Merges into your
            list automatically.
          </p>
          <p data-i18n="ru">
            Одна ссылка — много серверов, обновляется по расписанию. Сливается
            в общий список автоматически.
          </p>
        </div>

        <div className="feat feat-5" data-cat="ops" hidden={isHidden("ops")}>
          <span className="tag">sha256 ✓</span>
          <span className="num">f.05</span>
          <h4 data-i18n="en">Auto-update</h4>
          <h4 data-i18n="ru">Авто-обновление</h4>
          <p data-i18n="en">
            Pulls from <code style={{ fontFamily: "var(--mono)" }}>api.github.com</code>,
            verifies SHA-256, swaps the binary. Disable-able.
          </p>
          <p data-i18n="ru">
            Тянет с <code style={{ fontFamily: "var(--mono)" }}>api.github.com</code>,
            проверяет SHA-256, заменяет бинарник. Можно отключить.
          </p>
        </div>

        <div className="feat feat-6" data-cat="ops" hidden={isHidden("ops")}>
          <span className="tag">win-only</span>
          <span className="num">f.06</span>
          <h4 data-i18n="en">DPI bypass (Zapret)</h4>
          <h4 data-i18n="ru">DPI bypass (Zapret)</h4>
          <p data-i18n="en">
            Bundled for Windows. Useful where the carrier has opinions about
            your TLS handshakes.
          </p>
          <p data-i18n="ru">
            Встроено в Windows-сборку. Полезно когда провайдер имеет мнение о
            ваших TLS handshake.
          </p>
        </div>

        <div className="feat feat-7" data-cat="open" hidden={isHidden("open")}>
          <span className="tag">★ free</span>
          <span className="num">f.07</span>
          <h4 data-i18n="en">Open source · GPL-3.0</h4>
          <h4 data-i18n="ru">Open source · GPL-3.0</h4>
          <p data-i18n="en">
            Code at{" "}
            <a href="https://github.com/PavelLizunov/VPNRouter">
              github.com/PavelLizunov/VPNRouter
            </a>
            . Read it, fork it, send a patch. Pull requests are read.
          </p>
          <p data-i18n="ru">
            Код тут:{" "}
            <a href="https://github.com/PavelLizunov/VPNRouter">
              github.com/PavelLizunov/VPNRouter
            </a>
            . Читайте, форкайте, шлите PR. Я их читаю.
          </p>
        </div>

        <div
          className="feat feat-bigstat"
          data-cat="routing"
          hidden={isHidden("routing")}
        >
          <div>
            <div className="big">
              ≈25k
              <span className="small">
                <T
                  ru={
                    <>
                      бесплатных публичных
                      <br />
                      VLESS конфигов
                    </>
                  }
                  en={
                    <>
                      free public
                      <br />
                      VLESS configs
                    </>
                  }
                />
              </span>
            </div>
            <div className="pool-stats">
              <span>
                <span className="pulse"></span>{" "}
                <span id="pool-active">24 962</span> active
              </span>
              <span>
                last sync <span id="pool-sync">02:11</span> ago
              </span>
              <span>refresh every 6h</span>
            </div>
          </div>
          <div className="why">
            <p style={{ margin: "0 0 10px" }} data-i18n="en">
              <b>The Free tab</b> joins a public pool that&apos;s refreshed every{" "}
              <b>6 hours</b>. Not curated. Variable quality. Useful when you
              have nowhere else to point a tunnel at — and unlike &quot;premium
              free&quot; VPNs, <b>the app does not phone home</b> with usage data
              while you use it.
            </p>
            <p style={{ margin: "0 0 10px" }} data-i18n="ru">
              <b>Вкладка Free</b> подключается к публичному пулу, обновляемому
              раз в <b>6 часов</b>. Без курирования. Качество переменчиво.
              Полезно когда некуда направить тоннель — и в отличие от
              &quot;premium free&quot; VPN, <b>приложение не сливает</b> данные пока вы
              им пользуетесь.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
