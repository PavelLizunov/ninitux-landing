"use client";

import { useEffect, useState } from "react";
import { Stories } from "@/components/ui/stories";
import { GUIDES } from "@/lib/guides";

/**
 * "How to use": three short guides, each played from frames of the real app.
 * A link with data-guide-link="<id>" anywhere on the page opens that guide.
 */
export function GuideSection() {
  const [active, setActive] = useState(GUIDES[0].id);
  const guide = GUIDES.find((item) => item.id === active) ?? GUIDES[0];

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("[data-guide-link]");
      const id = link?.getAttribute("data-guide-link");
      if (id && GUIDES.some((item) => item.id === id)) setActive(id);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <section className="section" id="guide">
      <header className="section-head">
        <h2>
          <span data-i18n="ru">
            Как <mark>пользоваться</mark>
          </span>
          <span data-i18n="en">
            How to <mark>use</mark> it
          </span>
        </h2>
        <p>
          <span data-i18n="ru">
            Ролики собраны из настоящих экранов приложения. Они идут сами; нажмите на шаг, чтобы остановиться и
            листать в своём темпе.
          </span>
          <span data-i18n="en">
            The clips are made from real screens of the app. They play by themselves; click a step to stop and go
            at your own pace.
          </span>
        </p>
      </header>

      <div className="guide-tabs" role="tablist" aria-label="Инструкции / Guides">
        {GUIDES.map((item, i) => (
          <button
            type="button"
            role="tab"
            key={item.id}
            aria-selected={item.id === active}
            data-umami-event={`guide-${item.id}`}
            onClick={() => setActive(item.id)}
          >
            <span className="guide-tab-num">{i + 1}</span>
            <span>
              <b>
                <span data-i18n="ru">{item.title.ru}</span>
                <span data-i18n="en">{item.title.en}</span>
              </b>
              <small>
                <span data-i18n="ru">{item.note.ru}</span>
                <span data-i18n="en">{item.note.en}</span>
              </small>
            </span>
          </button>
        ))}
      </div>

      <Stories guide={guide} key={guide.id} />

      <p className="section-foot">
        <span data-i18n="ru">
          Кадры сняты с версии для Windows на тестовых данных: настоящих серверов и аккаунтов на них нет. На macOS и
          Linux приложение выглядит так же.
        </span>
        <span data-i18n="en">
          The frames come from the Windows version with sample data: no real servers or accounts are shown. On macOS
          and Linux the app looks the same.
        </span>
      </p>
    </section>
  );
}
