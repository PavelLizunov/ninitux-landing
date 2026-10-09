import { T } from "@/components/i18n/t";
import { LangToggle } from "@/components/i18n/lang-toggle";

/** Sticky bar: brand, three section links, language switch and a download button. */
export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#top" aria-label="ninitux.com">
          <span className="brand-star" aria-hidden="true">
            ★
          </span>{" "}
          ninitux.com
        </a>
        <nav className="nav" aria-label="Разделы / Sections">
          <a href="#download">
            <T ru="Скачать" en="Download" />
          </a>
          <a href="#guide">
            <T ru="Как пользоваться" en="How to use" />
          </a>
          <a href="#faq">
            <T ru="Вопросы" en="Questions" />
          </a>
        </nav>
        <LangToggle />
        <a className="btn btn-primary btn-small topbar-cta" href="#download">
          <T ru="Скачать" en="Download" />
        </a>
      </div>
    </header>
  );
}
