import frames from "@/lib/guide-frames.json";

export type Lang = "ru" | "en";
export type Bi = Record<Lang, string>;

/** Where to click on a frame, as fractions of its width and height. */
export interface Spot {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GuideStep {
  id: string;
  title: Bi;
  text: Bi;
  image: Bi;
  spot: Record<Lang, Spot | null>;
}

export interface Guide {
  id: string;
  title: Bi;
  /** Short label under the tab title. */
  note: Bi;
  steps: GuideStep[];
}

export const FRAME_WIDTH: number = frames.width;
export const FRAME_HEIGHT: number = frames.height;

type FrameSpots = Record<string, Record<string, Record<Lang, Spot | null>>>;

function step(guide: string, id: string, title: Bi, text: Bi): GuideStep {
  const spot = (frames as unknown as FrameSpots)[guide]?.[id];
  if (!spot) throw new Error(`no frame ${guide}/${id} in lib/guide-frames.json`);
  return {
    id,
    title,
    text,
    image: { ru: `/guide/ru/${guide}-${id}.webp`, en: `/guide/en/${guide}-${id}.webp` },
    spot,
  };
}

export const GUIDES: Guide[] = [
  {
    id: "first-run",
    title: { ru: "Первое подключение", en: "First connection" },
    note: { ru: "полминуты", en: "half a minute" },
    steps: [
      step(
        "first-run",
        "paste",
        { ru: "Вставьте ссылку в поле «Конфиг VPN»", en: "Paste your link into “VPN config”" },
        {
          ru: "Скопируйте ссылку для подключения в личном кабинете вашего VPN-сервиса. Её ещё называют подпиской или ключом.",
          en: "Copy the connection link from your account at your VPN service. It is often called a subscription or a key.",
        },
      ),
      step(
        "first-run",
        "press",
        { ru: "Нажмите «Подключить»", en: "Press “Connect”" },
        {
          ru: "Кнопка стала синей: ссылка распознана.",
          en: "The button turned blue: the link is recognized.",
        },
      ),
      step(
        "first-run",
        "wait",
        { ru: "Подождите пару секунд", en: "Wait a couple of seconds" },
        {
          ru: "Приложение соединяется с сервером.",
          en: "The app is reaching the server.",
        },
      ),
      step(
        "first-run",
        "done",
        { ru: "Готово: «Подключено»", en: "Done: “Connected”" },
        {
          ru: "Выбранные приложения уже идут через VPN. Чтобы выключить, нажмите «Отключить».",
          en: "The selected apps now go through the VPN. Press “Disconnect” to turn it off.",
        },
      ),
    ],
  },
  {
    id: "apps",
    title: { ru: "Какие приложения через VPN", en: "Which apps use the VPN" },
    note: { ru: "выбор программ", en: "choosing programs" },
    steps: [
      step(
        "apps",
        "mode",
        { ru: "Два режима на главном экране", en: "Two modes on the home screen" },
        {
          ru: "«Приложения»: через VPN идут только выбранные программы. «Весь трафик»: всё подряд, включая игры и банки.",
          en: "“Selected apps”: only the chosen programs use the VPN. “All traffic”: everything, games and banking included.",
        },
      ),
      step(
        "apps",
        "advanced",
        { ru: "Откройте «Расширенные настройки»", en: "Open “Advanced settings”" },
        {
          ru: "Это строка внизу главного экрана.",
          en: "It is the row at the bottom of the home screen.",
        },
      ),
      step(
        "apps",
        "tab",
        { ru: "Перейдите на вкладку «Приложения»", en: "Go to the “Applications” tab" },
        {
          ru: "Четвёртый значок в верхней строке.",
          en: "The fourth icon in the top row.",
        },
      ),
      step(
        "apps",
        "pick",
        { ru: "Отметьте нужные программы", en: "Tick the programs you need" },
        {
          ru: "Слева группы: браузеры, мессенджеры, игры. Справа сами программы. Галочка значит «через VPN».",
          en: "Groups on the left: browsers, messengers, games. Programs on the right. A tick means “through the VPN”.",
        },
      ),
      step(
        "apps",
        "add",
        { ru: "Нет вашей программы в списке?", en: "Your program is not in the list?" },
        {
          ru: "«Запущенные» покажет программы, открытые прямо сейчас. «Обзор» даст выбрать файл программы.",
          en: "“Running” shows the programs that are open right now. “Browse” lets you pick the program file.",
        },
      ),
    ],
  },
  {
    id: "free",
    title: { ru: "Нет своего сервера", en: "No server of your own" },
    note: { ru: "бесплатные публичные", en: "free public ones" },
    steps: [
      step(
        "free",
        "advanced",
        { ru: "Откройте «Расширенные настройки»", en: "Open “Advanced settings”" },
        {
          ru: "Это строка внизу главного экрана.",
          en: "It is the row at the bottom of the home screen.",
        },
      ),
      step(
        "free",
        "tab",
        { ru: "Перейдите на вкладку «Публичные»", en: "Go to the “Public” tab" },
        {
          ru: "Значок глобуса в верхней строке.",
          en: "The globe icon in the top row.",
        },
      ),
      step(
        "free",
        "find",
        { ru: "Нажмите «Найти рабочие конфиги»", en: "Press “Find working configs”" },
        {
          ru: "Приложение скачает список бесплатных публичных серверов и само проверит каждый. Дождитесь списка.",
          en: "The app downloads a list of free public servers and tests each one itself. Wait for the list.",
        },
      ),
      step(
        "free",
        "connect",
        { ru: "Выберите сервер и нажмите «Подключить»", en: "Pick a server and press “Connect”" },
        {
          ru: "Эти серверы держат посторонние люди. Для важных дел лучше VPN-сервис, которому вы доверяете.",
          en: "These servers are run by third parties. For anything important, use a VPN service you trust.",
        },
      ),
    ],
  },
];
