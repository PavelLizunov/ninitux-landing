import { T } from "@/components/i18n/t";

/**
 * Phase 3 placeholder — Marquee + Topbar + Footer уже на месте через layout.
 * Контент секций (hero, install, features, ...) — заливается в Phase 4.
 */
export default function Home() {
  return (
    <section className="hero" id="top">
      <p className="eyebrow">
        <span className="blink"></span>{" "}
        <T
          ru="Phase 3 готов — layout + i18n"
          en="Phase 3 ready — layout + i18n"
        />
      </p>
      <h1 className="headline">
        <T
          ru={
            <>
              <span className="pop">ninitux</span>{" "}
              <span className="yel">Next.js</span>{" "}
              <span className="strike">vanilla</span>
            </>
          }
          en={
            <>
              <span className="pop">ninitux</span>{" "}
              <span className="yel">Next.js</span>{" "}
              <span className="strike">vanilla</span>
            </>
          }
        />
      </h1>
      <p className="lede">
        <T
          ru={
            <>
              Каркас готов. Шрифты (Unbounded + Manrope + JetBrains Mono),
              marquee, topbar, footer, mobile-drawer — на месте. Секции —{" "}
              <em>Phase 4</em>.
            </>
          }
          en={
            <>
              Skeleton ready. Fonts (Unbounded + Manrope + JetBrains Mono),
              marquee, topbar, footer, mobile-drawer — wired up. Sections{" "}
              come in <em>Phase 4</em>.
            </>
          }
        />
      </p>
    </section>
  );
}
