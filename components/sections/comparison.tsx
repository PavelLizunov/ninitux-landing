import { T } from "@/components/i18n/t";

/**
 * Comparison table — VPN Router vs commercial / WireGuard / v2rayN.
 * Server-rendered, no interactivity.
 */
export function Comparison() {
  return (
    <section className="section" id="compare">
      <div className="section-h">
        <div className="num" style={{ color: "var(--red)" }}>
          05
        </div>
        <h2>
          <T ru="vs" en="vs" />{" "}
          <em>
            <T ru="других VPN" en="other VPNs" />
          </em>
          .
        </h2>
        <div className="meta">{"// what makes it different"}</div>
      </div>

      <div className="compare-wrap">
        <table className="compare">
          <thead>
            <tr>
              <th>
                <T ru="возможность" en="capability" />
              </th>
              <th className="us">VPN Router</th>
              <th>
                <T ru="коммерческий VPN" en="commercial VPN" />
              </th>
              <th>WireGuard / OpenVPN</th>
              <th>v2rayN / NekoBox</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="k">
                <T
                  ru="Маршрутизация по процессам"
                  en="Per-process routing"
                />
                <small>
                  <T
                    ru="отдельные приложения в тоннель"
                    en="match individual apps to the tunnel"
                  />
                </small>
              </td>
              <td className="cell us y">
                <T ru="да · вживую" en="yes · live" />
              </td>
              <td className="cell n">
                <T ru="всё или ничего" en="all-or-nothing" />
              </td>
              <td className="cell n">
                <T ru="на уровне интерфейса" en="interface-level" />
              </td>
              <td className="cell partial">routing rules</td>
            </tr>
            <tr>
              <td className="k">
                <T ru="Subscription URL" en="Subscription URLs" />
                <small>
                  <T
                    ru="авто-обновляемый список серверов"
                    en="auto-refreshing server list"
                  />
                </small>
              </td>
              <td className="cell us y">yes</td>
              <td className="cell n">—</td>
              <td className="cell n">—</td>
              <td className="cell y">yes</td>
            </tr>
            <tr>
              <td className="k">
                <T ru="VLESS + Reality из коробки" en="VLESS + Reality built-in" />
                <small>
                  <T ru="без вспомогательных бинарников" en="no extra binaries" />
                </small>
              </td>
              <td className="cell us y">yes</td>
              <td className="cell n">—</td>
              <td className="cell n">—</td>
              <td className="cell y">yes</td>
            </tr>
            <tr>
              <td className="k">
                <T ru="DPI bypass" en="DPI bypass" />
                <small>
                  <T ru="Zapret в комплекте, Windows" en="Zapret bundled, Windows" />
                </small>
              </td>
              <td className="cell us y">
                <T ru="в комплекте" en="bundled" />
              </td>
              <td className="cell partial">
                <T ru="платный тариф" en="paid tier" />
              </td>
              <td className="cell n">—</td>
              <td className="cell partial">manual</td>
            </tr>
            <tr>
              <td className="k">
                <T ru="Бесплатный публичный пул" en="Free public pool" />
                <small>
                  <T ru="обновляется каждые 6ч" en="refreshed every 6h" />
                </small>
              </td>
              <td className="cell us y">≈25 000</td>
              <td className="cell n">—</td>
              <td className="cell n">—</td>
              <td className="cell n">—</td>
            </tr>
            <tr>
              <td className="k">
                <T ru="Телеметрия / аналитика" en="Telemetry / analytics" />
                <small>
                  <T ru="в самом приложении" en="in the app itself" />
                </small>
              </td>
              <td className="cell us y">
                <b style={{ color: "#1B8B3A" }}>none</b>
              </td>
              <td className="cell n">
                <T ru="часто много" en="often heavy" />
              </td>
              <td className="cell y">none</td>
              <td className="cell y">none</td>
            </tr>
            <tr>
              <td className="k">
                <T ru="Open source" en="Open source" />
                <small>
                  <T ru="лицензия" en="license" />
                </small>
              </td>
              <td className="cell us y">GPL-3.0</td>
              <td className="cell n">—</td>
              <td className="cell y">GPL / Apache</td>
              <td className="cell y">GPL</td>
            </tr>
            <tr>
              <td className="k">
                <T ru="Цена" en="Price" />
                <small>
                  <T ru="за использование" en="to use the app" />
                </small>
              </td>
              <td className="cell us y">
                <b>
                  <T ru="бесплатно" en="free" />
                </b>
              </td>
              <td className="cell n">$8–12/mo</td>
              <td className="cell y">free</td>
              <td className="cell y">free</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
