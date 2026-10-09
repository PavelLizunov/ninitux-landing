import { T } from "@/components/i18n/t";
import { REPO_URL, RELEASES_URL } from "@/lib/github";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-pen" role="img" aria-label="VPNRouter mascot"></span>
        <div>
          <b>VPNRouter</b>
          <span>Virtual Penguin Network</span>
        </div>
      </div>
      <nav className="footer-links" aria-label="Ссылки / Links">
        <a href={REPO_URL}>
          <T ru="Исходный код" en="Source code" />
        </a>
        <a href={RELEASES_URL}>
          <T ru="Все версии" en="All versions" />
        </a>
        <a href={`${REPO_URL}/issues`}>
          <T ru="Сообщить о проблеме" en="Report a problem" />
        </a>
        <a href="https://boosty.to/ninitux">
          <T ru="Поддержать автора" en="Support the author" />
        </a>
      </nav>
      <p className="footer-legal">
        © 2026 Pavel Lizunov · GPL-3.0 ·{" "}
        <T
          ru="Сайт не ставит cookies. Посещения считает собственная аналитика Umami, без сторонних сервисов."
          en="This site sets no cookies. Visits are counted by self-hosted Umami analytics, no third parties."
        />
      </p>
    </footer>
  );
}
