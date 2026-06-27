import { T } from "@/components/i18n/t";

/**
 * Big-foot footer in v4 style — large "ninitux .com" wordmark, 5 columns,
 * legal line, mascot in corner. Rendered INSIDE .wrap (matches main.html).
 */
export function Footer() {
  return (
    <footer className="bigfoot">
      <div className="huge">
        ninitux<br />
        <span className="pop">·com</span><br />
        <span className="yel">
          <T ru="открытая сеть" en="open net" />
        </span>
      </div>
      <div className="cols">
        <div>
          <h5>Source</h5>
          <p>
            <a href="https://github.com/PavelLizunov/VPNRouter">/VPNRouter</a>
          </p>
          <p>
            <a href="https://github.com/PavelLizunov/ninitux-landing">
              /ninitux-landing
            </a>
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>GPL-3.0</p>
        </div>
        <div>
          <h5>Support</h5>
          <p>
            <a href="https://boosty.to/ninitux">boosty.to/ninitux</a>
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            <T
              ru="ежемесячный тип помогает обновлять."
              en="a monthly tip keeps things refreshed."
            />
          </p>
        </div>
        <div>
          <h5>Maintainer</h5>
          <p>P. Lizunov</p>
          <p>
            <a href="https://t.me/ninitux_auth_bot">@ninitux_auth_bot</a>
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            <T
              ru="саундтрек: jungle, dnb, новости."
              en="soundtrack: jungle, dnb, the news."
            />
          </p>
        </div>
        <div>
          <h5>Network</h5>
          <p>
            <a href="https://github.com/PavelLizunov/VPNRouter/releases">
              releases ↗
            </a>
          </p>
          <p>
            <a href="https://github.com/PavelLizunov/VPNRouter/issues">
              issues ↗
            </a>
          </p>
          <p>
            <a href="https://github.com/PavelLizunov/VPNRouter/pulls">
              PRs ↗
            </a>
          </p>
        </div>
      </div>
      <div className="legal">
        <span>© 2026 ninitux.com</span>
        <span>·</span>
        <span>GPL-3.0</span>
        <span>·</span>
        <span>
          <T
            ru="без cookies · без трекеров · self-hosted Umami считает посещения"
            en="no cookies · no trackers · self-hosted Umami counts visits"
          />
        </span>
      </div>
      <div className="pen-bottom" role="img" aria-label="Penguin mascot"></div>
    </footer>
  );
}
