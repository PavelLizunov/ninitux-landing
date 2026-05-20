import { T } from "@/components/i18n/t";

const ITEMS = [
  { ru: "маршрутизация по процессам", en: "per-process routing" },
  { ru: "25 000 публичных конфигов", en: "25 000 free public configs" },
  { ru: "НОЛЬ телеметрии", en: "ZERO telemetry" },
  { ru: "VLESS + Reality + sing-box", en: "VLESS + Reality + sing-box" },
  { ru: "GPL-3.0 · open source", en: "GPL-3.0 · open source" },
  { ru: "windows · macos · linux", en: "windows · macos · linux" },
];

/**
 * Full-width black bar at the top with lime monospaced text scrolling left.
 * Rendered OUTSIDE .wrap so the background stretches edge-to-edge.
 * Items doubled so the animation loops seamlessly at -50% translateX.
 */
export function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {doubled.map((item, idx) => (
          <span key={idx}>
            <span className="dot">●</span> <T ru={item.ru} en={item.en} />
          </span>
        ))}
      </div>
    </div>
  );
}
