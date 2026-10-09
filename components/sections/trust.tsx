import { T } from "@/components/i18n/t";
import { REPO_URL } from "@/lib/github";

/** Closing block: the code is open, and how to help the project. */
export function Trust() {
  return (
    <section className="trust" id="support">
      <div>
        <h2>
          <T ru="Нравится VPNRouter? Помогите проекту" en="Like VPNRouter? Help the project" />
        </h2>
        <p>
          <T
            ru="VPNRouter бесплатный, без рекламы и платных подписок. Если он вам помог, поддержите разработку или просто поставьте звезду на GitHub: так о проекте узнают другие."
            en="VPNRouter is free, with no ads and no paid plans. If it helped you, support the development or simply star it on GitHub: that is how others find the project."
          />
        </p>
      </div>
      <div className="trust-actions">
        <a className="btn btn-light" href="https://boosty.to/ninitux" data-umami-event="support-boosty">
          <T ru="Поддержать на Boosty" en="Support on Boosty" />
        </a>
        <a className="btn btn-light" href={REPO_URL} data-umami-event="support-github">
          <T ru="Код на GitHub" en="Code on GitHub" />
        </a>
      </div>
    </section>
  );
}
