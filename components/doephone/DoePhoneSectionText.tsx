"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { suisseIntl } from "@/lib/home/fonts";
import {
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_COPY_POSITION,
  DOEPHONE_SECTION_COPY_TW,
} from "@/lib/doephone/section-styles";

export function DoePhoneSectionTitle({
  line1,
  line2,
  color = "text-[#1E343A]",
  segmentedReveal = false,
  revealed = false,
}: {
  line1: ReactNode;
  line2?: ReactNode;
  color?: string;
  /** Section 2 — parent drives staggered title → carousel → menu reveal. */
  segmentedReveal?: boolean;
  revealed?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (segmentedReveal) return;

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
  }, [segmentedReveal]);

  const showCopy = segmentedReveal ? revealed : visible;

  return (
    <div ref={ref}>
      <p
        className={`${
          segmentedReveal
            ? `doephone-section-reveal doephone-section-reveal--title${showCopy ? " doephone-section-reveal--in" : ""}`
            : `doephone-section-copy${showCopy ? " doephone-section-copy-visible" : ""}`
        } ${DOEPHONE_SECTION_COPY_TW} ${color} ${suisseIntl.className}`.trim()}
      >
        <span className="block">{line1}</span>
        {line2 ? <span className="block">{line2}</span> : null}
      </p>
    </div>
  );
}

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
  return (
    <div className={`${DOEPHONE_SECTION_COPY_POSITION} ${DOEPHONE_SECTION_CONTENT_INSET}`}>
      <DoePhoneSectionTitle line1={line1} line2={line2} color={color} />
    </div>
  );
}

/** SVG + for section 2 — stroke weight matched to Suisse Intl Light body copy. */
export function DoePhoneSectionPlus() {
  return (
    <span className="doephone-section-plus">
      <svg
        className="doephone-section-plus-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/** SVG apostrophe — matches Suisse Intl Light display stroke weight (avoids system-font fallback). */
export function DoePhoneSectionApostrophe() {
  return (
    <span className="doephone-section-apostrophe">
      <svg
        className="doephone-section-apostrophe-icon"
        viewBox="0 0 8 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M4.35 0.75c1.65 0 2.85 1.15 2.65 2.75-.15 1.05-.95 1.75-1.55 2.45-.45.52-.75.95-.85 1.45l-.25 2.05c-.1.75-.65 1.25-1.35 1.05-.6-.18-.65-.85-.5-1.45l.3-1.95c-.85-.65-1.85-1.45-1.65-2.85.2-1.15 1.15-2.5 2.55-2.5z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
