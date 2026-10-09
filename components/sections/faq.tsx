import { T } from "@/components/i18n/t";
import { REPO_URL, RELEASES_URL } from "@/lib/github";

interface Item {
  id: string;
  q: { ru: string; en: string };
  a: { ru: React.ReactNode; en: React.ReactNode };
}

const ITEMS: Item[] = [
  {
    id: "free",
    q: { ru: "Это бесплатно?", en: "Is it free?" },
    a: {
      ru: "Да. Приложение бесплатное, без рекламы и без регистрации. Его код открыт под лицензией GPL-3.0.",
      en: "Yes. The app is free, with no ads and no sign-up. Its code is open under the GPL-3.0 license.",
    },
  },
  {
    id: "link",
    q: { ru: "Где взять ссылку на сервер?", en: "Where do I get a server link?" },
    a: {
      ru: (
        <>
          VPNRouter это программа, а не VPN-сервис: своих серверов у неё нет. Ссылку даёт ваш VPN-сервис. Обычно
          она называется «подписка», «ключ» или «конфиг» и начинается с https://, vless://, hysteria2://, tuic://
          или ss://. Нет своего сервиса? В приложении есть{" "}
          <a href="#guide" data-guide-link="free">
            бесплатные публичные серверы
          </a>
          .
        </>
      ),
      en: (
        <>
          VPNRouter is a program, not a VPN service: it has no servers of its own. The link comes from your VPN
          service. It is usually called a “subscription”, a “key” or a “config” and starts with https://, vless://,
          hysteria2://, tuic:// or ss://. No service of your own? The app comes with{" "}
          <a href="#guide" data-guide-link="free">
            free public servers
          </a>
          .
        </>
      ),
    },
  },
  {
    id: "difference",
    q: { ru: "Чем это отличается от обычного VPN?", en: "How is it different from a regular VPN?" },
    a: {
      ru: "Обычный VPN пускает через себя весь трафик компьютера. VPNRouter по умолчанию пускает через VPN только выбранные программы: браузеры, Discord, Telegram. Игры, банки и остальное идут напрямую. Если нужен весь трафик, на главном экране есть переключатель «Весь трафик».",
      en: "A regular VPN takes all the traffic of your computer. By default VPNRouter sends only the chosen programs through the VPN: browsers, Discord, Telegram. Games, banking and the rest go direct. If you need everything, there is an “All traffic” switch on the home screen.",
    },
  },
  {
    id: "smartscreen",
    q: {
      ru: "Windows пишет «Система Windows защитила ваш компьютер». Это вирус?",
      en: "Windows says “Windows protected your PC”. Is it a virus?",
    },
    a: {
      ru: (
        <>
          Нет. Windows показывает это окно для любой программы без платной цифровой подписи, а у VPNRouter её нет.
          Нажмите «Подробнее», затем «Выполнить в любом случае». Хотите проверить файл? Рядом с каждым файлом на{" "}
          <a href={RELEASES_URL}>странице релизов</a> лежит его контрольная сумма (.sha256).
        </>
      ),
      en: (
        <>
          No. Windows shows this window for any program without a paid code-signing certificate, and VPNRouter has
          none. Click “More info”, then “Run anyway”. Want to verify the file? Next to every file on the{" "}
          <a href={RELEASES_URL}>releases page</a> there is its checksum (.sha256).
        </>
      ),
    },
  },
  {
    id: "admin",
    q: { ru: "Зачем программе права администратора?", en: "Why does the program need administrator rights?" },
    a: {
      ru: "Чтобы создать сетевой адаптер VPN и направлять через него выбранные программы. Без этих прав система не разрешает менять сетевые маршруты.",
      en: "To create the VPN network adapter and route the chosen programs through it. Without these rights the system does not allow changing network routes.",
    },
  },
  {
    id: "fail",
    q: { ru: "Не подключается. Что делать?", en: "It does not connect. What now?" },
    a: {
      ru: (
        <>
          Сначала проверьте, что ссылка вставлена целиком. Затем на главном экране откройте «Проверка настроек»:
          мастер шаг за шагом проверит сеть и маршрутизацию. Если серверов несколько, попробуйте другой: кнопка
          «Изменить» рядом с названием сервера. Не помогло? Напишите в{" "}
          <a href={`${REPO_URL}/issues`}>раздел проблем на GitHub</a>.
        </>
      ),
      en: (
        <>
          First check that the whole link was pasted. Then open “Check my setup” on the home screen: the wizard
          checks the network and the routing step by step. If you have several servers, try another one: the
          “Change” button next to the server name. Still stuck? Write to the{" "}
          <a href={`${REPO_URL}/issues`}>issues section on GitHub</a>.
        </>
      ),
    },
  },
  {
    id: "iphone",
    q: { ru: "Есть версия для iPhone?", en: "Is there an iPhone version?" },
    a: {
      ru: "Пока нет. VPNRouter работает на Windows 10 и 11, на Mac с Apple Silicon, на Linux и на Android 6.0 и новее.",
      en: "Not yet. VPNRouter runs on Windows 10 and 11, Apple Silicon Macs, Linux and Android 6.0 and later.",
    },
  },
  {
    id: "update",
    q: { ru: "Как обновлять?", en: "How do I update?" },
    a: {
      ru: "Когда выходит новая версия, приложение само сообщает об этом и предлагает обновиться. На Linux при установке одной командой обновления приходят вместе с обновлением системы.",
      en: "When a new version is out, the app tells you and offers to update. On Linux installed with the one command, updates arrive with your system updates.",
    },
  },
  {
    id: "data",
    q: { ru: "Собирает ли приложение мои данные?", en: "Does the app collect my data?" },
    a: {
      ru: "Нет: в нём нет рекламы, аккаунтов и сбора статистики, а отчёты о сбоях остаются на вашем компьютере. Важно другое: ваш трафик видит тот, кто держит VPN-сервер. Выбирайте сервис, которому доверяете.",
      en: "No: it has no ads, no accounts and no usage statistics, and crash reports stay on your computer. Something else matters: whoever runs the VPN server can see your traffic. Choose a service you trust.",
    },
  },
  {
    id: "remove",
    q: { ru: "Как удалить?", en: "How do I remove it?" },
    a: {
      ru: "Windows: «Параметры», затем «Приложения», затем VPNRouter и «Удалить». Android: как любое приложение. macOS: перетащите VPNRouter из «Программ» в корзину. Linux: команда sudo apt remove vpnrouter.",
      en: "Windows: Settings, then Apps, then VPNRouter and Uninstall. Android: like any other app. macOS: drag VPNRouter from Applications to the Trash. Linux: the command sudo apt remove vpnrouter.",
    },
  },
];

export function Faq() {
  return (
    <section className="section" id="faq">
      <header className="section-head">
        <h2>
          <T
            ru={
              <>
                Частые <mark>вопросы</mark>
              </>
            }
            en={
              <>
                Common <mark>questions</mark>
              </>
            }
          />
        </h2>
      </header>
      <div className="faq">
        {ITEMS.map((item) => (
          <details key={item.id} id={`faq-${item.id}`}>
            <summary>
              <T ru={item.q.ru} en={item.q.en} />
            </summary>
            <p>
              <T ru={item.a.ru} en={item.a.en} />
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
