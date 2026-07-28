"use client";

import { useEffect, useRef, useState } from "react";

import { DoeHealthPhoneReveal } from "@/components/doehealth/DoeHealthPhoneBandReveal";
import { DoePhoneCallHistoryVisual } from "@/components/doephone/DoePhoneCallHistoryVisual";
import { suisseIntl } from "@/lib/home/fonts";

function RoutedCallsCursor({
  label,
  motionClass,
  shadowId,
}: {
  label: string;
  motionClass: string;
  shadowId: string;
}) {
  return (
    <div className={`doehealth-routed-calls-cursor ${motionClass}`} aria-hidden>
      <svg
        className="doehealth-routed-calls-cursor__pointer"
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
      >
        <defs>
          <filter id={shadowId} x="-40%" y="-20%" width="180%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#1a1208" floodOpacity="0.42" />
          </filter>
        </defs>
        <path
          d="M4.25 2.75 4.25 19.5c0 .62.72.98 1.24.62l4.38-2.72 2.85 5.58c.32.62 1.14.68 1.54.12l1.48-2.02-2.2-4.3 5.01-1.38c.64-.18.98-.92.62-1.52L5.47 2.89c-.48-.78-1.47-.42-1.47.62Z"
          fill="#1a1208"
          stroke="#d4a574"
          strokeWidth="1.15"
          strokeLinejoin="round"
          filter={`url(#${shadowId})`}
        />
      </svg>
      <span className={`doehealth-routed-calls-cursor__pill ${suisseIntl.className}`}>{label}</span>
    </div>
  );
}

/** Right-bleed routed calls — 18 routed UI with agent/human cursor loop + section gold type. */
export function DoeHealthRoutedCallsBleedRightScene({ layout = "phone" }: { layout?: "phone" | "desktop" }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [cursorsActive, setCursorsActive] = useState(true);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCursorsActive(entry.isIntersecting && document.visibilityState === "visible");
      },
      { rootMargin: "12% 0px", threshold: 0 },
    );
    observer.observe(node);

    const onVisibility = () => {
      const rect = node.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      setCursorsActive(inView && document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="doehealth-routed-calls-bleed-right" aria-hidden ref={rootRef}>
      <DoeHealthPhoneReveal segment="title" className="doehealth-routed-calls-bleed-right__reveal-ui">
        <div className="doehealth-routed-calls-bleed-right__ui">
          <DoePhoneCallHistoryVisual layout={layout} />
        </div>

        <div
          className={`doehealth-routed-calls-cursors${
            cursorsActive ? "" : " doehealth-routed-calls-cursors--paused"
          }`}
        >
          <RoutedCallsCursor
            label="Agent"
            motionClass="doehealth-routed-calls-cursor--agent"
            shadowId="doehealth-routed-calls-cursor-shadow-agent"
          />
          <RoutedCallsCursor
            label="Human"
            motionClass="doehealth-routed-calls-cursor--human"
            shadowId="doehealth-routed-calls-cursor-shadow-human"
          />
        </div>
      </DoeHealthPhoneReveal>

      <DoeHealthPhoneReveal segment="carousel" className="doehealth-routed-calls-bleed-right__title">
        <h2 className={`doehealth-routed-calls-bleed-right__title-text ${suisseIntl.className}`}>
          <span className="doehealth-routed-calls-bleed-right__title-line">Agents &amp; humans,</span>
          <span className="doehealth-routed-calls-bleed-right__title-line">together</span>
        </h2>
      </DoeHealthPhoneReveal>
    </div>
  );
}
