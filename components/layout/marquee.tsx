import { T } from "@/components/i18n/t";

const ITEMS = [
  { ru: "бесплатно", en: "free" },
  { ru: "без регистрации", en: "no sign-up" },
  { ru: "без рекламы", en: "no ads" },
  { ru: "открытый код", en: "open source" },
  { ru: "Windows · macOS · Linux · Android", en: "Windows · macOS · Linux · Android" },
  { ru: "VPN только там, где он нужен", en: "a VPN only where you need it" },
] as const;

/**
 * The running line above the top bar. Decoration only, so it is hidden from
 * screen readers; the same facts are in the page text. The items are repeated
 * three times and the track moves by one third, which makes the loop seamless.
 */
export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1, 2].map((copy) =>
          ITEMS.map((item) => (
            <span key={`${copy}-${item.en}`}>
              <i>●</i> <T ru={item.ru} en={item.en} />
            </span>
          )),
        )}
      </div>
    </div>
  );
}
