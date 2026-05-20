"use client";

import { useEffect, useState } from "react";
import { T } from "@/components/i18n/t";

/**
 * Support — tip card + star count from GitHub. Live count via api.github.com,
 * fallback "1.2k".
 */
export function Support() {
  const [stars, setStars] = useState("1.2k");

  useEffect(() => {
    fetch("https://api.github.com/repos/PavelLizunov/VPNRouter")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { stargazers_count?: number }) => {
        if (typeof data.stargazers_count === "number") {
          const n = data.stargazers_count;
          if (n < 1000) setStars(String(n));
          else setStars((n / 1000).toFixed(1) + "k");
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section">
      <div className="support">
        <div>
          <h3 data-i18n="en">
            Like it? <em>Tip the maintainer.</em>
          </h3>
          <h3 data-i18n="ru">
            Нравится? <em>Поддержите автора.</em>
          </h3>
          <p data-i18n="en">
            No ads, no premium tier, no telemetry. A monthly tip keeps the
            free pool refreshed, the update server alive, and the maintainer
            caffeinated. Stars on GitHub also help.
          </p>
          <p data-i18n="ru">
            Без рекламы, без премиум-тарифа, без телеметрии. Ежемесячный тип
            помогает обновлять free-пул, держать update-сервер живым и
            поддерживает кофейный режим автора. Звёзды на GitHub тоже помогают.
          </p>
          <div className="row">
            <a
              className="cta"
              href="https://boosty.to/ninitux"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="click-boosty"
            >
              ♥ <T ru="Тип на Boosty" en="Tip on Boosty" />
            </a>
            <a
              className="cta secondary"
              href="https://github.com/PavelLizunov/VPNRouter"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="click-star-cta"
            >
              ★ <T ru="Звезда на GitHub" en="Star on GitHub" />
            </a>
          </div>
        </div>
        <div className="star-card">
          <div className="big" id="star-count">
            {stars}
          </div>
          <div className="sub">
            ★ <T ru="на GitHub" en="on GitHub" />
          </div>
          <p
            style={{
              margin: "14px 0 0",
              fontSize: 12,
              color: "var(--cream)",
              opacity: 0.8,
            }}
            data-i18n="en"
          >
            join the people who think a router beats a tunnel.
          </p>
          <p
            style={{
              margin: "14px 0 0",
              fontSize: 12,
              color: "var(--cream)",
              opacity: 0.8,
            }}
            data-i18n="ru"
          >
            присоединяйтесь к тем кто считает что роутер лучше тоннеля.
          </p>
        </div>
      </div>
    </section>
  );
}
