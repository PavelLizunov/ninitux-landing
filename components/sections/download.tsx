import { T } from "@/components/i18n/t";
import { Command } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { OsTabs } from "@/components/ui/os-tabs";
import { formatSize, RELEASES_URL, type Release, type ReleaseAsset } from "@/lib/github";

const WIN_COMMAND = "iwr -useb https://vpn.ninitux.com/install.ps1 | iex";
const MAC_COMMAND = "brew install --cask pavellizunov/vpnrouter/vpnrouter";
const LINUX_COMMAND = "curl -fsSL https://vpn.ninitux.com/install.sh | sudo sh";

function FileLink({ asset, label, event }: { asset: ReleaseAsset; label: string; event: string }) {
  return (
    <a className="file" href={asset.url} data-umami-event={event}>
      <b>{label}</b>
      {asset.size ? (
        <span>
          <T ru={formatSize(asset.size, "ru")} en={formatSize(asset.size, "en")} />
        </span>
      ) : null}
    </a>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li>
      <span className="step-num">{n}</span>
      <div>{children}</div>
    </li>
  );
}

/** A drawing of the Windows SmartScreen window with the two places to click. */
function SmartScreenSketch() {
  return (
    <figure className="sketch">
      <div className="ss" aria-hidden="true">
        <div className="ss-win">
          <p className="ss-title">
            <T ru="Система Windows защитила ваш компьютер" en="Windows protected your PC" />
          </p>
          <p className="ss-text">
            <T
              ru="Фильтр SmartScreen предотвратил запуск неопознанного приложения."
              en="SmartScreen prevented an unrecognized app from starting."
            />
          </p>
          <p className="ss-link">
            <span className="ss-hit">
              <T ru="Подробнее" en="More info" />
            </span>
            <span className="ss-badge">1</span>
          </p>
        </div>
        <div className="ss-win">
          <p className="ss-title">
            <T ru="Система Windows защитила ваш компьютер" en="Windows protected your PC" />
          </p>
          <p className="ss-text">
            <T ru="Приложение: VPNRouter-Setup" en="App: VPNRouter-Setup" />
          </p>
          <p className="ss-buttons">
            <span className="ss-btn ss-hit">
              <T ru="Выполнить в любом случае" en="Run anyway" />
            </span>
            <span className="ss-badge">2</span>
            <span className="ss-btn">
              <T ru="Не выполнять" en="Don't run" />
            </span>
          </p>
        </div>
      </div>
      <figcaption>
        <T
          ru="Так выглядит синее окно Windows. Это рисунок, не снимок экрана."
          en="This is what the blue Windows window looks like. A drawing, not a screenshot."
        />
      </figcaption>
    </figure>
  );
}

/**
 * Download and install. One tab per system; the visitor's own system is open
 * already. Each tab has one main button, numbered steps in plain words and a
 * folded block with the other ways to install.
 */
export function Download({ release }: { release: Release }) {
  const { assets, version } = release;

  return (
    <section className="section" id="download">
      <header className="section-head">
        <h2>
          <T
            ru={
              <>
                Скачать и <mark>установить</mark>
              </>
            }
            en={
              <>
                Download and <mark>install</mark>
              </>
            }
          />
        </h2>
        <p>
          <T
            ru={`Последняя версия: ${version}. Выберите своё устройство.`}
            en={`Latest version: ${version}. Choose your device.`}
          />
        </p>
      </header>

      <OsTabs />

      <p className="downloading" role="status">
        <T
          ru="Загрузка началась. Пока файл скачивается, посмотрите шаги ниже."
          en="The download has started. While the file is coming, look at the steps below."
        />
      </p>

      {/* ── Windows ── */}
      <div className="os-panel" data-os-panel="win" id="os-panel-win" role="tabpanel" aria-labelledby="os-tab-win">
        <div className="os-main">
          <DownloadButton href={assets.winSetup.url} os="win" event="dl-win-setup" scroll={false}>
            <T ru="Скачать для Windows" en="Download for Windows" />
          </DownloadButton>
          <p className="cta-meta">
            <T
              ru={["Windows 10 и 11, 64 бита", formatSize(assets.winSetup.size, "ru")].filter(Boolean).join(" · ")}
              en={["Windows 10 and 11, 64-bit", formatSize(assets.winSetup.size, "en")].filter(Boolean).join(" · ")}
            />
          </p>
          <ol className="steps">
            <Step n={1}>
              <T
                ru={
                  <>
                    Откройте скачанный файл <b>VPNRouter-Setup</b>. Обычно он лежит в папке «Загрузки».
                  </>
                }
                en={
                  <>
                    Open the downloaded file <b>VPNRouter-Setup</b>. It is usually in the Downloads folder.
                  </>
                }
              />
            </Step>
            <Step n={2}>
              <T
                ru={
                  <>
                    Если появилось синее окно «Система Windows защитила ваш компьютер», нажмите <b>«Подробнее»</b>,
                    затем <b>«Выполнить в любом случае»</b>. Окно появляется потому, что у программы нет платной
                    цифровой подписи.
                  </>
                }
                en={
                  <>
                    If a blue “Windows protected your PC” window appears, click <b>“More info”</b>, then{" "}
                    <b>“Run anyway”</b>. It appears because the program has no paid code-signing certificate.
                  </>
                }
              />
            </Step>
            <Step n={3}>
              <T
                ru={
                  <>
                    На вопрос «Разрешить этому приложению вносить изменения?» ответьте <b>«Да»</b> и нажимайте{" "}
                    <b>«Далее»</b> до конца установки.
                  </>
                }
                en={
                  <>
                    When asked “Do you want to allow this app to make changes?”, answer <b>“Yes”</b> and keep
                    clicking <b>“Next”</b> until the setup finishes.
                  </>
                }
              />
            </Step>
            <Step n={4}>
              <T
                ru={
                  <>
                    Откройте <b>VPNRouter</b> из меню «Пуск». Дальше смотрите раздел{" "}
                    <a href="#guide">«Как пользоваться»</a>.
                  </>
                }
                en={
                  <>
                    Open <b>VPNRouter</b> from the Start menu. Then see <a href="#guide">“How to use”</a>.
                  </>
                }
              />
            </Step>
          </ol>
        </div>
        <div className="os-side">
          <SmartScreenSketch />
          <details className="more">
            <summary>
              <T ru="Другие способы установки" en="Other ways to install" />
            </summary>
            <p>
              <T
                ru="Одной командой. Откройте PowerShell (Win+X) и вставьте её. Права администратора она запросит сама."
                en="With one command. Open PowerShell (Win+X) and paste it. It asks for administrator rights by itself."
              />
            </p>
            <Command text={WIN_COMMAND} event="copy-win" />
            <p>
              <T ru="Архив без установщика:" en="Archive without the installer:" />
            </p>
            <div className="files">
              <FileLink asset={assets.winZip} label=".zip" event="dl-win-zip" />
            </div>
          </details>
        </div>
      </div>

      {/* ── macOS ── */}
      <div className="os-panel" data-os-panel="mac" id="os-panel-mac" role="tabpanel" aria-labelledby="os-tab-mac">
        <div className="os-main">
          <DownloadButton href={assets.macDmg.url} os="mac" event="dl-mac-dmg" scroll={false}>
            <T ru="Скачать для macOS" en="Download for macOS" />
          </DownloadButton>
          <p className="cta-meta">
            <T
              ru={["macOS 12 и новее", "только Apple Silicon (M1 и новее)", formatSize(assets.macDmg.size, "ru")]
                .filter(Boolean)
                .join(" · ")}
              en={["macOS 12 and later", "Apple Silicon only (M1 and later)", formatSize(assets.macDmg.size, "en")]
                .filter(Boolean)
                .join(" · ")}
            />
          </p>
          <ol className="steps">
            <Step n={1}>
              <T
                ru={
                  <>
                    Откройте скачанный файл <b>.dmg</b> и перетащите <b>VPNRouter</b> в папку «Программы».
                  </>
                }
                en={
                  <>
                    Open the downloaded <b>.dmg</b> file and drag <b>VPNRouter</b> into Applications.
                  </>
                }
              />
            </Step>
            <Step n={2}>
              <T
                ru={
                  <>
                    В том же окне откройте файл <b>InstallGuide</b>. В нём одна команда и кнопка «Копировать».
                  </>
                }
                en={
                  <>
                    In the same window open the <b>InstallGuide</b> file. It has one command and a “Copy” button.
                  </>
                }
              />
            </Step>
            <Step n={3}>
              <T
                ru={
                  <>
                    Откройте «Терминал» (его значок есть в том же окне), вставьте команду (Cmd+V) и нажмите Enter. Введите пароль от Mac: он нужен
                    один раз, чтобы приложение могло включать VPN без пароля.
                  </>
                }
                en={
                  <>
                    Open Terminal (its icon is in the same window), paste the command (Cmd+V) and press Enter. Type your Mac password: it is asked
                    once, so that the app can turn the VPN on without a password later.
                  </>
                }
              />
            </Step>
            <Step n={4}>
              <T
                ru={
                  <>
                    Приложение запустится само. Дальше смотрите раздел <a href="#guide">«Как пользоваться»</a>.
                  </>
                }
                en={
                  <>
                    The app starts by itself. Then see <a href="#guide">“How to use”</a>.
                  </>
                }
              />
            </Step>
          </ol>
        </div>
        <div className="os-side">
          <div className="card">
            <h3>
              <T ru="Есть Homebrew? Тогда одна команда" en="Have Homebrew? Then one command" />
            </h3>
            <p>
              <T
                ru="Она сама поставит приложение и снимет карантин macOS. При первом запуске приложение один раз спросит пароль."
                en="It installs the app and clears the macOS quarantine. On the first launch the app asks for your password once."
              />
            </p>
            <Command text={MAC_COMMAND} event="copy-mac" />
          </div>
          <details className="more">
            <summary>
              <T ru="Другие файлы" en="Other files" />
            </summary>
            <div className="files">
              <FileLink asset={assets.macZip} label=".zip" event="dl-mac-zip" />
            </div>
            <p>
              <T
                ru="На Mac с процессором Intel приложение пока не работает."
                en="Intel Macs are not supported yet."
              />
            </p>
          </details>
        </div>
      </div>

      {/* ── Linux ── */}
      <div className="os-panel" data-os-panel="linux" id="os-panel-linux" role="tabpanel" aria-labelledby="os-tab-linux">
        <div className="os-main">
          <h3>
            <T ru="Ubuntu, Debian, Mint: одна команда" en="Ubuntu, Debian, Mint: one command" />
          </h3>
          <Command text={LINUX_COMMAND} event="copy-linux" />
          <ol className="steps">
            <Step n={1}>
              <T
                ru={
                  <>
                    Откройте терминал: <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd>.
                  </>
                }
                en={
                  <>
                    Open a terminal: <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd>.
                  </>
                }
              />
            </Step>
            <Step n={2}>
              <T
                ru="Нажмите «Копировать», вставьте команду в терминал и нажмите Enter. Введите свой пароль."
                en="Press “Copy”, paste the command into the terminal and press Enter. Type your password."
              />
            </Step>
            <Step n={3}>
              <T
                ru={
                  <>
                    Откройте <b>VPNRouter</b> из меню приложений. Дальше смотрите раздел{" "}
                    <a href="#guide">«Как пользоваться»</a>.
                  </>
                }
                en={
                  <>
                    Open <b>VPNRouter</b> from the applications menu. Then see <a href="#guide">“How to use”</a>.
                  </>
                }
              />
            </Step>
          </ol>
          <p className="fine">
            <T
              ru="Команда подключает подписанный репозиторий, поэтому обновления приходят вместе с обычным обновлением системы."
              en="The command adds a signed repository, so updates arrive with your regular system updates."
            />
          </p>
        </div>
        <div className="os-side">
          <div className="card">
            <h3>
              <T ru="Или скачайте файл" en="Or download a file" />
            </h3>
            <div className="files">
              <FileLink asset={assets.deb} label=".deb" event="dl-deb" />
              <FileLink asset={assets.appImage} label=".AppImage" event="dl-appimage" />
              <FileLink asset={assets.tarGz} label=".tar.gz" event="dl-targz" />
            </div>
            <p>
              <T
                ru=".deb подходит для Debian и Ubuntu. AppImage запускается на большинстве систем без установки. Нужен 64-битный компьютер (x86_64)."
                en=".deb is for Debian and Ubuntu. AppImage runs on most systems without installing. A 64-bit (x86_64) computer is required."
              />
            </p>
          </div>
        </div>
      </div>

      {/* ── Android ── */}
      <div
        className="os-panel"
        data-os-panel="android"
        id="os-panel-android"
        role="tabpanel"
        aria-labelledby="os-tab-android"
      >
        <div className="os-main">
          <DownloadButton href={assets.apk.url} os="android" event="dl-apk" scroll={false}>
            <T ru="Скачать для Android" en="Download for Android" />
          </DownloadButton>
          <p className="cta-meta">
            <T
              ru={["APK-файл", "Android 6.0 и новее", formatSize(assets.apk.size, "ru")].filter(Boolean).join(" · ")}
              en={["APK file", "Android 6.0 and later", formatSize(assets.apk.size, "en")].filter(Boolean).join(" · ")}
            />
          </p>
          <ol className="steps">
            <Step n={1}>
              <T
                ru="Откройте скачанный файл: нажмите на уведомление о загрузке."
                en="Open the downloaded file: tap the download notification."
              />
            </Step>
            <Step n={2}>
              <T
                ru={
                  <>
                    Телефон спросит про <b>установку из неизвестных источников</b>. Разрешите её для браузера: это
                    нужно один раз, потому что приложения нет в Google Play.
                  </>
                }
                en={
                  <>
                    The phone asks about <b>installing unknown apps</b>. Allow it for your browser: it is needed
                    once, because the app is not on Google Play.
                  </>
                }
              />
            </Step>
            <Step n={3}>
              <T
                ru={
                  <>
                    Нажмите <b>«Установить»</b>, затем <b>«Открыть»</b>.
                  </>
                }
                en={
                  <>
                    Tap <b>“Install”</b>, then <b>“Open”</b>.
                  </>
                }
              />
            </Step>
            <Step n={4}>
              <T
                ru={
                  <>
                    Вставьте ссылку на сервер или нажмите <b>«Сканировать QR»</b>, если сервис дал вам QR-код. Затем{" "}
                    <b>«Подключить»</b>.
                  </>
                }
                en={
                  <>
                    Paste your server link or tap <b>“Scan QR”</b> if your service gave you a QR code. Then{" "}
                    <b>“Connect”</b>.
                  </>
                }
              />
            </Step>
          </ol>
          <p className="fine">
            <T
              ru="Подходит для телефонов с процессором ARM64: это почти все современные телефоны. Версии для iPhone нет."
              en="For phones with an ARM64 processor: nearly every modern phone. There is no iPhone version."
            />
          </p>
        </div>
        <div className="os-side">
          <div className="card qr-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/qr-android.svg" width={164} height={164} alt="QR: ninitux.com" loading="lazy" />
            <div>
              <h3>
                <T ru="Сидите за компьютером?" en="On a computer right now?" />
              </h3>
              <p>
                <T
                  ru="Наведите камеру телефона на этот код: страница откроется на телефоне, и файл скачается сразу туда."
                  en="Point your phone camera at this code: the page opens on the phone and the file downloads right there."
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="section-foot">
        <T
          ru={
            <>
              Все версии и контрольные суммы файлов (.sha256) лежат на <a href={RELEASES_URL}>странице релизов</a>.
            </>
          }
          en={
            <>
              All versions and file checksums (.sha256) are on the <a href={RELEASES_URL}>releases page</a>.
            </>
          }
        />
      </p>
    </section>
  );
}
