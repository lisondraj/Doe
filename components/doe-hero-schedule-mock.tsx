"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";

const BASE_H = 580;

/**
 * Design-space width from left edge of artboard to the right edge of the Wed column
 * (Harper Scott / Apr 1): sidebar 220 + main `px-4` 16 + time 72 + 3×day cols in 980px week grid.
 */
const HERO_CROP_DESIGN_WIDTH = 698;

/**
 * Hero schedule: zoom/crop so the viewport spans sidebar → Wed column (clips Thu–Sun);
 * anchored bottom-left so the UI fills the band without a void above.
 */
export function DoeHeroScheduleShowcase() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.85);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const update = () => {
      const r = host.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      if (w < 8 || h < 8) return;
      const sWidth = w / HERO_CROP_DESIGN_WIDTH;
      const sHeight = h / BASE_H;
      // Fill both width (Wed crop) and height so there’s no empty white band above the UI
      const s = Math.min(Math.max(Math.max(sWidth, sHeight), 0.32), 3.2);
      setScale(s);
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className="relative h-full min-h-0 w-full min-w-0 overflow-hidden rounded-t-[clamp(0.65rem,1.5vw,1rem)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.07)]"
    >
      <div className="flex h-full w-full items-end justify-start overflow-hidden">
        <div
          className="shrink-0"
          style={{
            width: 920,
            height: BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: "bottom left",
          }}
        >
          <DoeSchedulesAppMock variant="hero" />
        </div>
      </div>
    </div>
  );
}
