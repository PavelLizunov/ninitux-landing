import { T } from "@/components/i18n/t";

/**
 * How it works — 3 comic-style panels (sky/yellow/lime backgrounds) with
 * round step badges, arrow connectors between, and pdetail dashed-border
 * footnote at the bottom of each.
 */
export function How() {
  return (
    <section className="section" id="how">
      <div className="section-h">
        <div
          className="num"
          style={{
            color: "var(--lime)",
            WebkitTextStroke: "2px var(--ink)",
          }}
        >
          03
        </div>
        <h2>
          <T ru="Как это" en="How it actually" />{" "}
          <em>
            <T ru="работает" en="works" />
          </em>
          .
        </h2>
        <div className="meta">{"// 3 steps · ≈90s"}</div>
      </div>

      <div className="how-grid">
        <div className="how-panel">
          <span className="step">1</span>
          <h3 data-i18n="en">Install.</h3>
          <h3 data-i18n="ru">Установить.</h3>
          <p data-i18n="en">
            Paste the one-liner for your OS above. Windows needs admin. macOS
            asks <i>once</i> for a sudoers entry. Linux uses POSIX capabilities
            — no full-root daemon.
          </p>
          <p data-i18n="ru">
            Вставьте команду для вашей OS выше. Windows — нужен админ. macOS —{" "}
            <i>один раз</i> спросит про sudoers. Linux — POSIX capabilities,
            без полного root-демона.
          </p>
          <div className="pdetail" data-i18n="en">
            <b>under the hood:</b> drops a binary, registers TUN, writes one
            capability or sudoers line. ~6 sec.
          </div>
          <div className="pdetail" data-i18n="ru">
            <b>внутри:</b> кладёт бинарник, регистрирует TUN, пишет одну
            capability или sudoers-строку. ~6 сек.
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="how-panel">
          <span className="step">2</span>
          <h3 data-i18n="en">Add servers.</h3>
          <h3 data-i18n="ru">Добавить серверы.</h3>
          <p data-i18n="en">
            Paste a <code>subscription URL</code>, drop in your own sing-box{" "}
            <code>config.json</code>, or hit the <b>Free</b> tab and pick from
            the public pool. One-click TCP+TLS probe on any row.
          </p>
          <p data-i18n="ru">
            Вставьте <code>subscription URL</code>, свой sing-box{" "}
            <code>config.json</code>, или откройте вкладку <b>Free</b> и
            выберите из публичного пула. TCP+TLS probe в один клик на любой
            строке.
          </p>
          <div className="pdetail" data-i18n="en">
            <b>merge logic:</b> subscriptions + free pool → one unified server
            list, deduped by SNI+port.
          </div>
          <div className="pdetail" data-i18n="ru">
            <b>логика:</b> подписки + free pool → единый список, дедуп по
            SNI+port.
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="how-panel">
          <span className="step">3</span>
          <h3 data-i18n="en">Pick your apps.</h3>
          <h3 data-i18n="ru">Выберите приложения.</h3>
          <p data-i18n="en">
            Tick the processes that should go through the tunnel. Everything
            else stays direct. Hot-reloads with zero dropped sockets when new
            processes appear.
          </p>
          <p data-i18n="ru">
            Поставьте галки на процессах, которые должны идти через тоннель.
            Остальное идёт напрямую. Hot-reload без обрыва сокетов при
            появлении новых процессов.
          </p>
          <div className="pdetail" data-i18n="en">
            <b>match by:</b> exact name · regex · path. Survives reboot. Saved
            per-machine.
          </div>
          <div className="pdetail" data-i18n="ru">
            <b>матчинг:</b> точное имя · regex · путь. Переживает ребут.
            Сохраняется на машине.
          </div>
        </div>
      </div>
    </section>
  );
}
