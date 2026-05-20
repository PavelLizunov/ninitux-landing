import { T } from "@/components/i18n/t";
import type { ReactNode } from "react";

interface Q {
  q: { ru: string; en: string };
  a: { ru: ReactNode; en: ReactNode };
  open?: boolean;
}

const FAQS: Q[] = [
  {
    open: true,
    q: {
      ru: "Почему \"по процессам\", а не \"весь трафик\"?",
      en: "Why \"per-process\" and not the usual \"all traffic\"?",
    },
    a: {
      en: `Because most of your traffic is fine on the open net. Your bank, your Slack, your printer, the cloud storage on which your work lives — these should not take the long way around just because you wanted Telegram or a torrent client to use a tunnel. Routing by app means you get the tunnel exactly where you wanted it and pay no latency anywhere else.`,
      ru: `Потому что большая часть трафика прекрасно живёт в открытой сети. Банк, Slack, принтер, облако с рабочими файлами — им не нужно крутиться через тоннель только из-за того что вы хотели Telegram или торрент пустить через прокси. Маршрутизация по приложениям даёт тоннель именно там где вы хотели — без задержек везде ещё.`,
    },
  },
  {
    q: {
      en: "Does it really have no telemetry?",
      ru: "Реально нет телеметрии?",
    },
    a: {
      en: `Yes. Don't take my word for it — the code is GPL-3.0, you can grep it in 30 seconds (see the Telemetry section). The only outgoing requests are the four listed there, none of which carry usage data.`,
      ru: `Да. Не верьте на слово — код под GPL-3.0, grep-нуть можно за 30 секунд (см. раздел Телеметрия). Исходящие запросы только те четыре, что перечислены выше, и ни один из них не несёт usage-данных.`,
    },
  },
  {
    q: {
      en: "Where do the ≈25k free configs come from?",
      ru: "Откуда берутся ≈25k бесплатных конфигов?",
    },
    a: {
      en: (
        <>
          From a public scrape of openly-shared VLESS endpoints, refreshed every
          six hours. They are <i>not curated</i> — quality varies, anything can
          be down at any time, and you should treat them as found change. The
          Free tab is for when you have nowhere else to point a tunnel; bring
          your own server when you can.
        </>
      ),
      ru: (
        <>
          Это публичный скрейп открыто-расшаренных VLESS endpoint, обновляется
          раз в 6 часов. <i>Не курируется</i> — качество разное, любой сервер
          может лежать, относиться к ним как к найденной мелочи. Free — это
          когда некуда направить тоннель; свой сервер всегда лучше.
        </>
      ),
    },
  },
  {
    q: {
      en: "Does it work on a corporate network?",
      ru: "Будет ли работать в корпоративной сети?",
    },
    a: {
      en: `Sometimes. VLESS+Reality fingerprints as a regular browser TLS handshake which is usually fine; DPI-heavy networks may still block based on flow analysis. Zapret (Windows-only, bundled) helps for the most common cases. If your corp has its own MITM root certificate, no tunnel will get you out — and you should not try.`,
      ru: `Иногда. VLESS+Reality маскируется под обычный TLS, что обычно прокатывает; сети с тяжёлым DPI могут блокировать по flow-анализу. Zapret (Windows, в комплекте) помогает в типичных случаях. Если у корпорации свой MITM-сертификат — никакой тоннель не выпустит, и не стоит пытаться.`,
    },
  },
  {
    q: {
      en: "Does it need root / admin all the time?",
      ru: "Нужен ли постоянный root / админ?",
    },
    a: {
      en: `No. Linux uses POSIX capabilities so only the TUN-bind needs them — no full-root daemon. macOS writes a one-time sudoers entry at install. Windows needs admin because the TUN driver does; the app itself does not run as SYSTEM.`,
      ru: `Нет. Linux использует POSIX capabilities — только TUN-bind их требует, full-root демона нет. macOS пишет одну sudoers строку при установке. Windows требует админа из-за TUN-драйвера; само приложение не работает как SYSTEM.`,
    },
  },
  {
    q: {
      en: "Mobile support?",
      ru: "Поддержка мобилки?",
    },
    a: {
      en: (
        <>
          Not yet. iOS and Android are on the roadmap (see{" "}
          <a href="#roadmap">roadmap</a>) but not in 2026 H1. For now, mobile
          users can use a sing-box-compatible client and import the same
          subscription URL.
        </>
      ),
      ru: (
        <>
          Пока нет. iOS и Android в планах (см.{" "}
          <a href="#roadmap">роадмап</a>), но не в первой половине 2026. Сейчас
          на телефоне — sing-box совместимый клиент с той же subscription URL.
        </>
      ),
    },
  },
  {
    q: {
      en: "Can I trust the auto-updater?",
      ru: "Можно ли доверять авто-апдейтеру?",
    },
    a: {
      en: (
        <>
          It pulls release manifest from <code>api.github.com</code>, downloads
          the binary, verifies SHA-256 against the value in the signed
          manifest, swaps in place. If you don&apos;t want it, disable it in
          Settings → Updates; you&apos;ll still get notified.
        </>
      ),
      ru: (
        <>
          Тянет манифест с <code>api.github.com</code>, скачивает бинарник,
          проверяет SHA-256 против значения из подписанного манифеста,
          подменяет на месте. Не хотите — выключите в Настройках → Обновления;
          уведомления всё равно будут.
        </>
      ),
    },
  },
  {
    q: {
      en: "Does this support [my favourite protocol]?",
      ru: "Поддерживает ли [мой любимый протокол]?",
    },
    a: {
      en: `If sing-box supports it, this does: VLESS, TUIC, Hysteria2, Shadowsocks, Trojan, plain SOCKS5, plain HTTP. WireGuard works as an output too. Drop a JSON, click Apply, done.`,
      ru: `Если sing-box поддерживает — поддерживает и это: VLESS, TUIC, Hysteria2, Shadowsocks, Trojan, обычный SOCKS5, HTTP. WireGuard как outbound тоже работает. Кидаете JSON, жмёте Apply, готово.`,
    },
  },
];

/**
 * FAQ — 8 native <details> rows. Server-rendered, no JS needed for expand.
 */
export function FAQ() {
  return (
    <section className="section" id="faq">
      <div className="section-h">
        <div className="num" style={{ color: "var(--blue)" }}>
          07
        </div>
        <h2>
          <T ru="Частые" en="Common" />{" "}
          <em>
            <T ru="вопросы" en="questions" />
          </em>
          .
        </h2>
        <div className="meta">{"// click to expand"}</div>
      </div>

      <div className="faq-grid">
        {FAQS.map((item, i) => (
          <details key={i} className="faq" open={item.open}>
            <summary>
              <T ru={item.q.ru} en={item.q.en} />
            </summary>
            <div className="body">
              <p data-i18n="en">{item.a.en}</p>
              <p data-i18n="ru">{item.a.ru}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
