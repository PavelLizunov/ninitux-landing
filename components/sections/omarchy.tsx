import { T } from "@/components/i18n/t";
import { Command } from "@/components/ui/copy-button";

const COMMAND = "omarchy plugin add https://github.com/PavelLizunov/omarchy-vpnrouter --enable";

export function Omarchy() {
  return (
    <section className="section" id="omarchy">
      <header className="section-head">
        <h2><T ru={<>VPNRouter внутри <mark>Omarchy</mark></>} en={<>VPNRouter inside <mark>Omarchy</mark></>} /></h2>
        <p><T ru="Нативная панель Quattro: открывается из строки состояния, без отдельного окна приложения." en="A native Quattro panel: opens from the bar, without a separate app window." /></p>
      </header>
      <Command text={COMMAND} event="copy-omarchy" />
      <ol className="steps">
        <li><span className="step-num">1</span><div><T ru="В Omarchy Quattro на компьютере x86_64 выполните команду в терминале и подтвердите добавление плагина." en="On an x86_64 computer running Omarchy Quattro, run the command in a terminal and confirm adding the plugin." /></div></li>
        <li><span className="step-num">2</span><div><T ru="Откройте значок VPNRouter в строке состояния и нажмите «Установить VPN-компонент». Системное окно попросит пароль для установки встроенного Arch-пакета." en="Open VPNRouter from the bar and press “Install VPN component”. The system dialog asks for your password to install the bundled Arch package." /></div></li>
        <li><span className="step-num">3</span><div><T ru="Добавьте подписку или импортируйте сервер. Выберите приложения либо весь трафик, затем нажмите «Подключить»." en="Add a subscription or import a server. Choose selected apps or all traffic, then press “Connect”." /></div></li>
      </ol>
      <div className="card">
        <h3><T ru="Обзор всех разделов за 24 секунды" en="Every section in 24 seconds" /></h3>
        <div data-i18n="en"><video controls playsInline preload="metadata" poster="/media/omarchy-tour.jpg" style={{ width: "100%", maxHeight: 640 }}><source src="/media/omarchy-tour.webm" type="video/webm" /><a href="/media/omarchy-tour.mp4">Download the video</a></video></div>
        <div data-i18n="ru"><video controls playsInline preload="metadata" poster="/media/omarchy-tour.ru.jpg" style={{ width: "100%", maxHeight: 640 }}><source src="/media/omarchy-tour.ru.webm" type="video/webm" /><a href="/media/omarchy-tour.ru.mp4">Скачать видео</a></video></div>
        <p className="fine"><T ru="Запись настоящего QML-интерфейса на демонстрационных данных. Показаны главная панель, серверы, подписки, приложения, правила, настройки, диагностика, бесплатные серверы, профили и конфигурации. Это не запись реального VPN-подключения." en="A recording of the real QML interface with sample data. Shows Home, servers, subscriptions, apps, rules, settings, diagnostics, free servers, profiles and configurations. This is not a recording of a live VPN connection." /></p>
      </div>
      <p className="fine"><T ru="Версия для Omarchy пока разрабатывается. Аварийная блокировка трафика и DNS lockdown в Linux недоступны. Плагин работает с правами пользователя внутри общей оболочки; установка VPN-компонента отдельно требует системного разрешения." en="The Omarchy version is still in development. Kill switch and DNS lockdown are unavailable on Linux. The plugin runs with user permissions inside the shared shell; installing the VPN component separately requires system authorization." /></p>
      <p className="section-foot"><a href="https://github.com/PavelLizunov/omarchy-vpnrouter"><T ru="Исходники, обновление и удаление плагина" en="Plugin source, updates and removal" /></a></p>
    </section>
  );
}
