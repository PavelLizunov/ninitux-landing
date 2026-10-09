"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/ui/use-html-attr";
import { FRAME_HEIGHT, FRAME_WIDTH, type Guide, type Lang, type Spot } from "@/lib/guides";

const LANGS: Lang[] = ["ru", "en"];

function spotStyle(spot: Spot | null): React.CSSProperties {
  if (!spot) return { opacity: 0 };
  return {
    left: `${spot.x * 100}%`,
    top: `${spot.y * 100}%`,
    width: `${spot.w * 100}%`,
    height: `${spot.h * 100}%`,
  };
}

function cursorStyle(spot: Spot | null): React.CSSProperties {
  if (!spot) return { opacity: 0 };
  return { left: `${(spot.x + spot.w * 0.62) * 100}%`, top: `${(spot.y + spot.h * 0.55) * 100}%` };
}

/**
 * A guide played like stories: frames of the real app change by themselves,
 * a ring and a cursor show where to click, the bars on top show progress.
 * The viewer can pause it or step back and forth at their own pace.
 *
 * `hero` is the compact variant for the first screen: no step list, no buttons.
 * Both languages are in the markup; globals.css hides the inactive one.
 */
export function Stories({ guide, variant = "full" }: { guide: Guide; variant?: "full" | "hero" }) {
  const steps = guide.steps;
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  // null: the viewer has not touched the controls, so it plays unless they asked for less motion.
  const [choice, setPlaying] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const playing = choice ?? !reduced;
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const go = useCallback(
    (next: number) => {
      setIndex(((next % steps.length) + steps.length) % steps.length);
      setCycle((value) => value + 1);
    },
    [steps.length],
  );

  const running = playing && inView;
  const step = steps[index];

  return (
    <div className="st" data-variant={variant} data-running={running} data-guide={guide.id} ref={root}>
      <div className="st-screen">
        <div className="st-bars">
          {steps.map((item, i) => (
            <button
              type="button"
              key={item.id}
              className={i < index ? "st-bar is-done" : i === index ? "st-bar is-active" : "st-bar"}
              aria-label={`${i + 1} / ${steps.length}`}
              aria-current={i === index ? "step" : undefined}
              onClick={() => {
                setPlaying(false);
                go(i);
              }}
            >
              {i === index ? (
                <span className="st-bar-fill" key={cycle} onAnimationEnd={() => go(index + 1)}></span>
              ) : null}
            </button>
          ))}
        </div>
        <div className="st-stage" style={{ aspectRatio: `${FRAME_WIDTH} / ${FRAME_HEIGHT}` }}>
          {LANGS.map((lang) => (
            <div className="st-layer" data-i18n={lang} key={lang}>
              {steps.map((item, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={item.id}
                  className={i === index ? "st-img is-active" : "st-img"}
                  src={item.image[lang]}
                  alt={item.title[lang]}
                  width={FRAME_WIDTH}
                  height={FRAME_HEIGHT}
                  loading={variant === "hero" && i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              ))}
              <span className="st-spot" style={spotStyle(step.spot[lang])} aria-hidden="true"></span>
              <svg
                className="st-cursor"
                style={cursorStyle(step.spot[lang])}
                viewBox="0 0 36 48"
                aria-hidden="true"
              >
                <path d="M3 3 L3 38 L12 28 L21 44 L29 40 L20 25 L33 24 Z" />
              </svg>
            </div>
          ))}
          <button
            type="button"
            className="st-tap st-tap-prev"
            aria-label="Назад / Back"
            onClick={() => {
              setPlaying(false);
              go(index - 1);
            }}
          ></button>
          <button
            type="button"
            className="st-tap st-tap-next"
            aria-label="Дальше / Next"
            onClick={() => {
              setPlaying(false);
              go(index + 1);
            }}
          ></button>
        </div>
      </div>

      <div className="st-caption" aria-live="polite">
        <span className="st-num">{index + 1}</span>
        <div>
          {LANGS.map((lang) => (
            <span data-i18n={lang} key={lang}>
              <b>{step.title[lang]}</b>
              <span className="st-caption-text">{step.text[lang]}</span>
            </span>
          ))}
        </div>
      </div>

      {variant === "full" ? (
        <>
          <ol className="st-steps">
            {steps.map((item, i) => (
              <li key={item.id} className={i === index ? "is-active" : undefined}>
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    go(i);
                  }}
                >
                  <span className="st-num">{i + 1}</span>
                  <span className="st-step-body">
                    {LANGS.map((lang) => (
                      <span data-i18n={lang} key={lang}>
                        <b>{item.title[lang]}</b>
                        <span>{item.text[lang]}</span>
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="st-controls">
            <button type="button" className="btn btn-small" onClick={() => { setPlaying(false); go(index - 1); }}>
              <span aria-hidden="true">←</span> <span data-i18n="ru">Назад</span>
              <span data-i18n="en">Back</span>
            </button>
            <button
              type="button"
              className="btn btn-small st-play"
              aria-pressed={playing}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? (
                <>
                  <span data-i18n="ru">Пауза</span>
                  <span data-i18n="en">Pause</span>
                </>
              ) : (
                <>
                  <span data-i18n="ru">Играть</span>
                  <span data-i18n="en">Play</span>
                </>
              )}
            </button>
            <button type="button" className="btn btn-small" onClick={() => { setPlaying(false); go(index + 1); }}>
              <span data-i18n="ru">Дальше</span>
              <span data-i18n="en">Next</span> <span aria-hidden="true">→</span>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
