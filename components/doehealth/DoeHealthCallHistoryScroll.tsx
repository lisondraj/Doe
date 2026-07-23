"use client";

import { type ReactNode, useEffect, useRef } from "react";

/** Very slow auto-scroll through embedded call history convo. */
export function DoeHealthCallHistoryScroll({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let frame = 0;
    let lastTime = performance.now();
    let direction = 1;
    let pauseUntil = performance.now() + 2400;
    const speedPxPerMs = 0.0018;
    const edgePauseMs = 3200;

    const tick = (now: number) => {
      if (reducedMotion.matches) return;

      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 4) return;

      if (now < pauseUntil) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const delta = Math.min(now - lastTime, 48);
      lastTime = now;

      let next = el.scrollTop + delta * speedPxPerMs * direction;

      if (next >= maxScroll) {
        next = maxScroll;
        direction = -1;
        pauseUntil = now + edgePauseMs;
      } else if (next <= 0) {
        next = 0;
        direction = 1;
        pauseUntil = now + edgePauseMs;
      }

      el.scrollTop = next;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={scrollRef} className="doehealth-initiatives__call-history-scroll">
      {children}
    </div>
  );
}
