import { T } from "@/components/i18n/t";

const ITEMS = [
  {
    ru: ["Только нужные программы", "Браузер и Discord идут через VPN, а игры и банк работают напрямую, как без VPN."],
    en: ["Only the programs you need", "Your browser and Discord use the VPN, while games and banking go direct, just as without a VPN."],
  },
  {
    ru: ["Или сразу всё", "Нужен VPN для всего компьютера? Один переключатель «Весь трафик» на главном экране."],
    en: ["Or everything at once", "Need the VPN for the whole computer? One “All traffic” switch on the home screen."],
  },
  {
    ru: ["Одна ссылка, и готово", "Вставьте ссылку от вашего VPN-сервиса. Приложение само поймёт, сервер это или подписка, и всё настроит."],
    en: ["One link and you are set", "Paste the link from your VPN service. The app works out whether it is a server or a subscription and sets everything up."],
  },
  {
    ru: ["Сам найдёт рабочий сервер", "Если выбранный сервер перестал отвечать, приложение подключится к самому быстрому из рабочих."],
    en: ["Finds a working server itself", "If the server you picked stops answering, the app connects to the fastest one that works."],
  },
  {
    ru: ["Не следит за вами", "Нет рекламы, нет аккаунта, нет сбора статистики. Отчёты о сбоях остаются на вашем компьютере."],
    en: ["Does not watch you", "No ads, no account, no usage statistics. Crash reports stay on your computer."],
  },
  {
    ru: ["Открытый код", "Весь код лежит на GitHub под лицензией GPL-3.0. Любой может проверить, что делает программа."],
    en: ["Open source", "All the code is on GitHub under GPL-3.0. Anyone can check what the program does."],
  },
] as const;

/** What the app gives you, in plain words; the technical line is folded away. */
export function Benefits() {
  return (
    <section className="section" id="why">
      <header className="section-head">
        <h2>
          <T
            ru={
              <>
                Что оно <mark>умеет</mark>
              </>
            }
            en={
              <>
                What it <mark>does</mark>
              </>
            }
          />
        </h2>
      </header>
      <ul className="benefits">
        {ITEMS.map((item) => (
          <li key={item.en[0]}>
            <h3>
              <T ru={item.ru[0]} en={item.en[0]} />
            </h3>
            <p>
              <T ru={item.ru[1]} en={item.en[1]} />
            </p>
          </li>
        ))}
      </ul>
      <details className="more more-wide">
        <summary>
          <T ru="Для тех, кто в теме: технические подробности" en="For the technically minded: the details" />
        </summary>
        <p>
          <T
            ru="Ядро sing-box в режиме TUN: прокси в самих программах настраивать не нужно. Принимает ссылки vless (Reality), hysteria2, tuic, ss и naive, подписки по http и https, а также ваш собственный JSON-конфиг sing-box. Есть правила маршрутизации, защита от утечек DNS и мастер проверки настроек. На Windows дополнительно: обход DPI (Zapret) и прокси для Telegram."
            en="A sing-box core in TUN mode: no proxy settings inside the programs themselves. It accepts vless (Reality), hysteria2, tuic, ss and naive links, http and https subscriptions, and your own sing-box JSON config. There are routing rules, DNS leak protection and a setup check wizard. Windows only extras: DPI bypass (Zapret) and a Telegram proxy."
          />
        </p>
      </details>
    </section>
  );
}
