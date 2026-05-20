import { T } from "@/components/i18n/t";

interface Item {
  title: { ru: string; en: string };
  sub: { ru: string; en: string };
}

const SHIPPED: Item[] = [
  {
    title: { ru: "Per-process routing", en: "Per-process routing" },
    sub: {
      ru: "по PID · живой список процессов",
      en: "match by PID · live process list",
    },
  },
  {
    title: { ru: "VLESS + Reality", en: "VLESS + Reality" },
    sub: { ru: "встроенный транспорт", en: "built-in transport" },
  },
  {
    title: { ru: "sing-box core", en: "sing-box core" },
    sub: { ru: "поддержка JSON", en: "JSON config support" },
  },
  {
    title: { ru: "Auto-update", en: "Auto-update" },
    sub: { ru: "с проверкой SHA-256", en: "SHA-256 verified" },
  },
  {
    title: { ru: "Free pool · 25k", en: "Free pool · 25k" },
    sub: { ru: "обн. каждые 6ч", en: "refreshed every 6h" },
  },
];

const NOW: Item[] = [
  {
    title: { ru: "WireGuard outbound", en: "WireGuard outbound" },
    sub: { ru: "в бете · sing-box 1.10", en: "in beta · sing-box 1.10" },
  },
  {
    title: { ru: "Группы приложений", en: "App groups" },
    sub: {
      ru: "маршрут по группам, не по приложениям",
      en: "route by group, not by app",
    },
  },
  {
    title: { ru: "Zapret v3", en: "Zapret v3" },
    sub: {
      ru: "улучшенный DPI bypass для Win",
      en: "improved DPI bypass for Win",
    },
  },
];

const NEXT: Item[] = [
  {
    title: { ru: "Linux GUI", en: "Linux GUI" },
    sub: { ru: "сейчас CLI + tray", en: "currently CLI + tray only" },
  },
  {
    title: { ru: "Кастомные правила", en: "Custom rules" },
    sub: { ru: "домен · IP · порт", en: "domain · IP · port" },
  },
  {
    title: { ru: "Diagnostic mode", en: "Diagnostic mode" },
    sub: {
      ru: "почему это приложение тормозит?",
      en: "why is this app slow?",
    },
  },
];

const LATER: Item[] = [
  {
    title: { ru: "iOS · Android", en: "iOS · Android" },
    sub: {
      ru: "нативные клиенты · те же конфиги",
      en: "native clients · same configs",
    },
  },
  {
    title: { ru: "Шаренные подписки", en: "Shared subscriptions" },
    sub: { ru: "для команд", en: "team-grade" },
  },
  {
    title: { ru: "Audit log", en: "Audit log" },
    sub: {
      ru: "какое приложение · когда · куда",
      en: "which app · when · where",
    },
  },
];

function Col({
  cls,
  title,
  count,
  items,
}: {
  cls: string;
  title: { ru: string; en: string };
  count: string;
  items: Item[];
}) {
  return (
    <div className={`road-col ${cls}`}>
      <h4>
        <T ru={title.ru} en={title.en} /> <span className="count">{count}</span>
      </h4>
      <ul>
        {items.map((it, idx) => (
          <li key={idx}>
            <b>
              <T ru={it.title.ru} en={it.title.en} />
            </b>
            <small>
              <T ru={it.sub.ru} en={it.sub.en} />
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Roadmap — 4 columns (shipped/now/next/later) with counts.
 */
export function Roadmap() {
  return (
    <section className="section" id="roadmap">
      <div className="section-h">
        <div
          className="num"
          style={{
            color: "var(--lime)",
            WebkitTextStroke: "2px var(--ink)",
          }}
        >
          08
        </div>
        <h2>
          <T ru="Что" en="What's" />{" "}
          <em>
            <T ru="релизится" en="shipping" />
          </em>
          .
        </h2>
        <div className="meta">{"// roadmap · 2026"}</div>
      </div>

      <div className="roadmap">
        <Col cls="done" title={{ ru: "в проде", en: "shipped" }} count="2025" items={SHIPPED} />
        <Col cls="now" title={{ ru: "сейчас", en: "now" }} count="Q2 '26" items={NOW} />
        <Col cls="next" title={{ ru: "скоро", en: "next" }} count="Q3 '26" items={NEXT} />
        <Col cls="later" title={{ ru: "потом", en: "later" }} count="2027+" items={LATER} />
      </div>
    </section>
  );
}
