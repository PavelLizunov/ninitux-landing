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
 *
 * Items TRIPLED so the wrap is seamless on any viewport wider than one set.
 * (A doubled marquee leaves a gap on viewports wider than half the track —
 * at 1400px viewport with ~2700px track, half = 1350px < 1400px = ~50px gap.
 * Tripling keeps the visible window inside the loop region at any moment.)
 *
 * Animation: translateX(0) → translateX(-33.333%) over the cycle. At that
 * point, item[N] sits exactly where item[0] was → visually identical → loop.
 */
export function Marquee() {
  const tripled = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {tripled.map((item, idx) => (
          <span key={idx}>
            <span className="dot">●</span> <T ru={item.ru} en={item.en} />
          </span>
        ))}
      </div>
    </div>
  );
}
