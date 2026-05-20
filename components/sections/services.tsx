"use client";

import { useEffect, useState } from "react";
import { T } from "@/components/i18n/t";

/**
 * Services grid — 4 public + 4 admin cards. Admin cards stay locked until
 * /auth/check returns 200; then `.locked` is removed and pointer events
 * restored. Auth banner shown when locked, hidden when unlocked.
 */
export function Services() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch("/auth/check")
      .then((r) => {
        if (r.ok) setAuthed(true);
      })
      .catch(() => {});
  }, []);

  const adminClass = (extra: string) =>
    authed ? `svc-card ${extra}` : `svc-card ${extra} locked`;

  return (
    <section className="section" id="services">
      <div className="section-h">
        <div className="num" style={{ color: "var(--blue)" }}>
          09
        </div>
        <h2>
          <T ru="Остальной" en="The rest of the" />{" "}
          <em>
            <T ru="дом" en="house" />
          </em>
          .
        </h2>
        <div className="meta">{"// *.ninitux.com"}</div>
      </div>

      <div className="svc-wrap">
        <div className="svc-card svc-1 commercial">
          <span className="tag">commercial</span>
          <span className="host">
            <a href="https://wb.ninitux.com">wb.ninitux.com</a>
          </span>
          <span className="desc" data-i18n="en">
            WB — pricing &amp; tasks. The commercial side of the house, kept
            separate on purpose.
          </span>
          <span className="desc" data-i18n="ru">
            WB — цены и задачи. Коммерческая часть, специально отдельно.
          </span>
        </div>
        <div className="svc-card svc-2 edu">
          <span className="tag">★ edu</span>
          <span className="host">
            <a href="https://edu.ninitux.com">edu.ninitux.com</a>
          </span>
          <span className="desc" data-i18n="en">
            DevOps cheatsheet for Middle+. Same vibe as this page.
          </span>
          <span className="desc" data-i18n="ru">
            DevOps шпаргалка для Middle+. Тот же вайб что у этой страницы.
          </span>
        </div>
        <div className="svc-card svc-3 public">
          <span className="tag">public</span>
          <span className="host">
            <a href="https://md.ninitux.com">md.ninitux.com</a>
          </span>
          <span className="desc">
            Flatnotes · <T ru="markdown viewer" en="markdown viewer" />
          </span>
        </div>
        <div className="svc-card svc-4 public">
          <span className="tag">public</span>
          <span className="host">
            <a href="https://docs.ninitux.com">docs.ninitux.com</a>
          </span>
          <span className="desc">
            <T ru="Документация" en="Documentation" />
          </span>
        </div>
        <div className={adminClass("svc-5")} data-svc="git">
          <span className="tag">admin</span>
          <span className="host">
            <a href="https://git.ninitux.com">git.ninitux.com</a>
          </span>
          <span className="desc">
            Forgejo · <T ru="self-hosted git" en="self-hosted git" />
          </span>
        </div>
        <div className={adminClass("svc-6")} data-svc="analytics">
          <span className="tag">admin</span>
          <span className="host">
            <a href="https://analytics.ninitux.com">analytics.ninitux.com</a>
          </span>
          <span className="desc">
            Umami ·{" "}
            <T ru="self-hosted аналитика" en="self-hosted analytics" />
          </span>
        </div>
        <div className={adminClass("svc-7")} data-svc="db">
          <span className="tag">admin</span>
          <span className="host">
            <a href="https://db.ninitux.com">db.ninitux.com</a>
          </span>
          <span className="desc">
            pgweb · <T ru="postgres клиент" en="postgres client" />
          </span>
        </div>
        <div className={adminClass("svc-8")} data-svc="tasks">
          <span className="tag">admin</span>
          <span className="host">
            <a href="https://tasks.ninitux.com">tasks.ninitux.com</a>
          </span>
          <span className="desc">
            Plane · <T ru="issue tracker" en="issue tracker" />
          </span>
        </div>

        <div
          className={authed ? "auth-banner unlocked" : "auth-banner"}
          id="auth-banner"
        >
          <span className="ico">{authed ? "🔓" : "🔒"}</span>
          <T
            ru={
              <>
                admin-сервисы открываются после авторизации через{" "}
                <a
                  href="https://t.me/ninitux_auth_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @ninitux_auth_bot
                </a>{" "}
                — только telegram, email не нужен
              </>
            }
            en={
              <>
                admin services unlock after auth via{" "}
                <a
                  href="https://t.me/ninitux_auth_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @ninitux_auth_bot
                </a>{" "}
                — telegram-only, no email required
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}
