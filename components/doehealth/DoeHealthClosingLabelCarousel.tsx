"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DOEHEALTH_CLOSING_LABEL_CAROUSEL_ITEMS } from "@/lib/doehealth/doehealth-closing-label-carousel";
import { dmSans } from "@/lib/home/fonts";

const INTERVAL_MS = 5200;
const TRANSITION_MS = 980;
const TRANSITION_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Vertical switch carousel — DM Sans labels in brown pills beside Doe. */
export function DoeHealthClosingLabelCarousel({ className = "" }: { className?: string }) {
  const items = DOEHEALTH_CLOSING_LABEL_CAROUSEL_ITEMS;
  const loopCount = items.length;
  const slides = useMemo(
    () => (loopCount > 0 ? [...items, items[0]!] : []),
    [items, loopCount],
  );

  const [index, setIndex] = useState(0);
  const [motionOk, setMotionOk] = useState(true);
  const [transitionOn, setTransitionOn] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (loopCount <= 1) return;
    const id = window.setInterval(() => {
      if (motionOk) {
        setIndex((current) => (current >= loopCount ? current : current + 1));
      } else {
        setIndex((current) => (current + 1) % loopCount);
      }
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [loopCount, motionOk]);

  const onTrackTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLUListElement>) => {
      if (!motionOk || event.propertyName !== "transform") return;
      if (index !== loopCount) return;
      setTransitionOn(false);
      setIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitionOn(true));
      });
    },
    [index, loopCount, motionOk],
  );

  const trackItems = motionOk ? slides : items;
  const activeIndex = motionOk ? index : index % loopCount;

  return (
    <div className={`doehealth-closing-label-carousel ${dmSans.className}${className ? ` ${className}` : ""}`}>
      <div className="doehealth-closing-label-carousel__shell">
        <div className="doehealth-closing-label-carousel__viewport" aria-live="polite" aria-atomic>
          <ul
            className="doehealth-closing-label-carousel__track"
            onTransitionEnd={onTrackTransitionEnd}
            style={{
              transform: `translateY(calc(-1 * ${activeIndex} * var(--doehealth-closing-row-h, 4rem)))`,
              transition:
                motionOk && transitionOn
                  ? `transform ${TRANSITION_MS}ms ${TRANSITION_EASING}`
                  : "none",
            }}
          >
            {trackItems.map((label, slideIndex) => (
              <li
                key={motionOk && slideIndex === loopCount ? `${label}-loop` : label}
                className="doehealth-closing-label-carousel__slide"
                aria-hidden={motionOk && slideIndex === loopCount ? true : undefined}
              >
                <span className="doehealth-closing-label-carousel__chip">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
