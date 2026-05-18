"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";

const BASE_H = 580;

/**
 * Design width (px) mapped to viewport.
 * On-screen width scales as `~920 * vw / (CROP/SHRINK)`; larger `CROP/SHRINK` = slightly smaller mock + calmer right edge.
 */
const HERO_CROP_DESIGN_WIDTH = 686;

/** Multiplier on width-based scale; tuned with CROP so the Wed column crop stays similar but the shell reads a bit smaller */
const HERO_SCALE_SHRINK = 0.855;

/** Keep this much space on the right so top/bottom rounded corners aren’t clipped by the hero overflow */
const HERO_RIGHT_EDGE_RESERVE_PX = 18;

/**
 * Hero schedule: zoom/crop; bottom-clipped by hero; non-interactive inside mock.
 */
export function DoeHeroScheduleShowcase() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.85);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const update = () => {
      const r = host.getBoundingClientRect();
      const w = Math.max(r.width - HERO_RIGHT_EDGE_RESERVE_PX, 8);
      const h = r.height;
      if (h < 8) return;
      const sWidth = (w / HERO_CROP_DESIGN_WIDTH) * HERO_SCALE_SHRINK;
      setScale(Math.min(Math.max(sWidth, 0.28), 2.85));
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className="relative h-full min-h-0 w-full min-w-0 bg-transparent"
    >
      <div className="flex h-full w-full min-h-0 items-end justify-start pb-0">
        <div
          className="pointer-events-none shrink-0 select-none overflow-hidden rounded-tl-[clamp(0.45rem,1.1vw,0.65rem)] rounded-tr-[clamp(0.45rem,1.1vw,0.65rem)] rounded-br-[clamp(0.95rem,2.3vw,1.4rem)] rounded-bl-none bg-white shadow-[0_1px_3px_rgba(0,0,0,0.07)]"
          style={{
            width: 920,
            height: BASE_H,
            marginBottom: -2,
            backfaceVisibility: "hidden",
            transform: `translate3d(0, 2px, 0) scale(${scale})`,
            transformOrigin: "bottom left",
            willChange: "transform",
          }}
        >
          <DoeSchedulesAppMock variant="hero" />
        </div>
      </div>
    </div>
  );
}
