"use client";

import { useEffect, useState } from "react";

import { DOEHEALTH_CLOSING_LABEL_CAROUSEL_ITEMS } from "@/lib/doehealth/doehealth-closing-label-carousel";
import { sourceSerif4 } from "@/lib/home/fonts";

const INTERVAL_MS = 2800;
const TRANSITION_MS = 520;

/** Vertical switch carousel — one serif label visible at a time. */
export function DoeHealthClosingLabelCarousel({ className = "" }: { className?: string }) {
  const items = DOEHEALTH_CLOSING_LABEL_CAROUSEL_ITEMS;
  const [index, setIndex] = useState(0);
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!motionOk) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [items.length, motionOk]);

  return (
    <div
      className={`doehealth-closing-label-carousel ${sourceSerif4.className}${className ? ` ${className}` : ""}`}
      aria-live="polite"
      aria-atomic
    >
      <div className="doehealth-closing-label-carousel__viewport">
        <ul
          className="doehealth-closing-label-carousel__track"
          style={{
            transform: `translateY(calc(-1 * ${index} * var(--doehealth-closing-label-step, 1.12rem)))`,
            transition: motionOk ? `transform ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)` : "none",
          }}
        >
          {items.map((label) => (
            <li key={label} className="doehealth-closing-label-carousel__slide">
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
