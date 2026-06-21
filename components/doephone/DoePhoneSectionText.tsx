"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { suisseIntl } from "@/lib/home/fonts";
import {
  DOEPHONE_SECTION_COPY_INSET,
  DOEPHONE_SECTION_COPY_POSITION,
  DOEPHONE_SECTION_COPY_TW,
} from "@/lib/doephone/section-styles";

export function DoePhoneSectionText({
  line1,
  line2,
  color = "text-[#1E343A]",
}: {
  line1: ReactNode;
  line2?: ReactNode;
  /** Tailwind text-color class. Use `text-white` on gradient sections. */
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`${DOEPHONE_SECTION_COPY_POSITION} ${DOEPHONE_SECTION_COPY_INSET}`}>
      <div ref={ref}>
        <p
          className={`doephone-section-copy ${DOEPHONE_SECTION_COPY_TW} ${color} ${suisseIntl.className} ${
            visible ? "doephone-section-copy-visible" : ""
          }`.trim()}
        >
          <span className="block">{line1}</span>
          {line2 ? <span className="block">{line2}</span> : null}
        </p>
      </div>
    </div>
  );
}

/** Thin-stroke + for section 2 — weight controlled via SVG, not opacity. */
export function DoePhoneSectionPlus() {
  return (
    <span className="doephone-section-plus" aria-hidden>
      <svg className="doephone-section-plus-icon" viewBox="0 0 12 12" aria-hidden>
        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="0.65" strokeLinecap="round" />
      </svg>
    </span>
  );
}
