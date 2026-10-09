import { T } from "@/components/i18n/t";
import { DownloadButton } from "@/components/ui/download-button";
import { OsLink } from "@/components/ui/os-tabs";
import { Stories } from "@/components/ui/stories";
import { formatSize, type Release } from "@/lib/github";
import { GUIDES } from "@/lib/guides";

function Meta({ ru, en }: { ru: string[]; en: string[] }) {
  return (
    <p className="cta-meta">
      <T ru={ru.filter(Boolean).join(" · ")} en={en.filter(Boolean).join(" · ")} />
    </p>
  );
}

/**
 * First screen: what the app does in one sentence, one download button for the
 * visitor's own system (data-show-os, chosen by the boot script) and a looping
 * demo of the first connection.
 */
export function Hero({ release }: { release: Release }) {
  const { assets, version } = release;
  const ver = { ru: `версия ${version}`, en: `version ${version}` };

  return (
    <section className="hero" id="top">
      <div className="hero-text">
        <h1>
          <T
            ru={
              <>
                VPN только там, где он <mark>нужен</mark>
              </>
            }
            en={
              <>
                A VPN only where you <mark>need</mark> it
              </>
            }
          />
        </h1>
        <p className="lede">
          <T
            ru="VPNRouter пускает через VPN только выбранные программы: браузер, Discord, Telegram. Игры, банк и всё остальное работают как обычно, напрямую."
            en="VPNRouter sends only the programs you choose through the VPN: your browser, Discord, Telegram. Games, banking and everything else keep working as usual, directly."
          />
        </p>

        <div className="cta">
          <div data-show-os="win">
            <DownloadButton href={assets.winSetup.url} os="win" event="hero-dl-win">
              <T ru="Скачать для Windows" en="Download for Windows" />
            </DownloadButton>
            <Meta
              ru={["Windows 10 и 11", formatSize(assets.winSetup.size, "ru"), ver.ru]}
              en={["Windows 10 and 11", formatSize(assets.winSetup.size, "en"), ver.en]}
            />
          </div>
          <div data-show-os="mac">
            <DownloadButton href={assets.macDmg.url} os="mac" event="hero-dl-mac">
              <T ru="Скачать для macOS" en="Download for macOS" />
            </DownloadButton>
            <Meta
              ru={["Mac на Apple Silicon (M1 и новее)", formatSize(assets.macDmg.size, "ru"), ver.ru]}
              en={["Apple Silicon Macs (M1 and later)", formatSize(assets.macDmg.size, "en"), ver.en]}
            />
          </div>
          <div data-show-os="linux">
            <a className="btn btn-primary btn-big" href="#download" data-umami-event="hero-dl-linux">
              <span>
                <T ru="Установить на Linux" en="Install on Linux" />
              </span>
            </a>
            <Meta
              ru={["Ubuntu, Debian, Mint: одна команда", "есть .deb и AppImage", ver.ru]}
              en={["Ubuntu, Debian, Mint: one command", ".deb and AppImage too", ver.en]}
            />
          </div>
          <div data-show-os="android">
            <DownloadButton href={assets.apk.url} os="android" event="hero-dl-android">
              <T ru="Скачать для Android" en="Download for Android" />
            </DownloadButton>
            <Meta
              ru={["APK-файл", "Android 6.0 и новее", formatSize(assets.apk.size, "ru"), ver.ru]}
              en={["APK file", "Android 6.0 and later", formatSize(assets.apk.size, "en"), ver.en]}
            />
          </div>
          <div data-show-os="ios">
            <p className="note note-warn">
              <T
                ru="Версии для iPhone и iPad пока нет. VPNRouter работает на Windows, macOS, Linux и Android."
                en="There is no iPhone or iPad version yet. VPNRouter runs on Windows, macOS, Linux and Android."
              />
            </p>
            <a className="btn btn-primary btn-big" href="#download">
              <span>
                <T ru="Скачать для другого устройства" en="Download for another device" />
              </span>
            </a>
          </div>

          <p className="cta-other">
            <T ru="Другая система:" en="Another system:" /> <OsLink os="win">Windows</OsLink>
            <OsLink os="mac">macOS</OsLink>
            <OsLink os="linux">Linux</OsLink>
            <OsLink os="android">Android</OsLink>
          </p>
        </div>

        <p className="note">
          <b>
            <T ru="Что понадобится:" en="What you will need:" />
          </b>{" "}
          <T
            ru={
              <>
                ссылка для подключения от вашего VPN-сервиса (её называют подпиской или ключом). Нет такой? В
                приложении есть{" "}
                <a href="#guide" data-guide-link="free">
                  бесплатные публичные серверы
                </a>
                .
              </>
            }
            en={
              <>
                a connection link from your VPN service (often called a subscription or a key). Do not have one?
                The app comes with{" "}
                <a href="#guide" data-guide-link="free">
                  free public servers
                </a>
                .
              </>
            }
          />
        </p>
      </div>

      <div className="hero-demo">
        <Stories guide={GUIDES[0]} variant="hero" />
        <span className="hero-pen" role="img" aria-label="VPNRouter mascot">
          <span className="hero-pen-art"></span>
        </span>
        <span className="hero-sticker" aria-hidden="true">
          <T ru="это просто!!" en="it is easy!!" />
        </span>
      </div>
    </section>
  );
}
