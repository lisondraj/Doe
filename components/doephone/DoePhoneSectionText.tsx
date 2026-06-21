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
    if (reducedMotion) { setVisible(true); return; }

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.18 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`${DOEPHONE_SECTION_COPY_POSITION} ${DOEPHONE_SECTION_COPY_INSET}`}>
      <div ref={ref}>
        <p
          className={`${DOEPHONE_SECTION_COPY_TW} ${color} ${suisseIntl.className}`}
          style={{
            opacity: visible ? 1 : 0,
            filter: visible ? "blur(0)" : "blur(16px)",
            transform: visible ? "translateY(0)" : "translateY(1.75rem)",
            transition: visible
              ? "opacity 1.45s cubic-bezier(0.22, 1, 0.36, 1), filter 1.45s cubic-bezier(0.22, 1, 0.36, 1), transform 1.45s cubic-bezier(0.22, 1, 0.36, 1)"
              : "none",
            willChange: "opacity, filter, transform",
            textShadow: "none",
          }}
        >
          <span className="block">{line1}</span>
          {line2 ? <span className="block">{line2}</span> : null}
        </p>
      </div>
    </div>
  );
}
