"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";

const BASE_W = 920;
/** Baseline height of hero mock artboard (920×580) */
const BASE_H = 580;

/**
 * Hero schedule: one white shell with rounded corners only — scale grows with the hero band
 * so the UI fills horizontal space (width-first; excess height clips from the top).
 */
export function DoeHeroScheduleShowcase() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const update = () => {
      const r = host.getBoundingClientRect();
      const w = r.width;
      if (w < 8) return;
      // Fill left/right of the hero band; vertical overflow is clipped (mock anchored to bottom)
      const s = Math.min(w / BASE_W, 2.6);
      setScale(Math.max(s, 0.28));
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className="relative h-full min-h-0 w-full min-w-0 overflow-hidden rounded-[clamp(0.7rem,1.75vw,1.1rem)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.07)]"
    >
      <div className="flex h-full w-full items-end justify-center overflow-hidden">
        <div
          className="shrink-0"
          style={{
            width: BASE_W,
            height: BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: "bottom center",
          }}
        >
          <DoeSchedulesAppMock variant="hero" />
        </div>
      </div>
    </div>
  );
}
