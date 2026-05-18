"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";

const MOCK_WIDTH = 1100;
const MOCK_HEIGHT = 640;

/** Schedules product mock for the marketing hero — white rounded frame matching app chrome. */
export function HeroSchedulesMock() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.48);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      if (w > 0) {
        setScale(Math.min(1, w / MOCK_WIDTH));
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaledHeight = Math.round(MOCK_HEIGHT * scale);

  return (
    <div
      ref={viewportRef}
      className="relative w-full max-w-[min(100%,56rem)] shrink-0 overflow-hidden rounded-[clamp(1.15rem,3.25vw,1.85rem)] bg-white ring-1 ring-black/[0.06]"
      style={{ height: Math.max(scaledHeight, 200) }}
      aria-hidden
    >
      <div
        className="absolute left-0 top-0 origin-top-left will-change-transform"
        style={{
          width: MOCK_WIDTH,
          height: MOCK_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <DoeSchedulesAppMock variant="hero" />
      </div>
    </div>
  );
}
