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
    let pauseUntil = performance.now() + 1800;
    /** ~3.2px/s — slow drift, perceptible within a few seconds */
    const speedPxPerMs = 0.0032;
    const edgePauseMs = 2800;
    let running = true;

    const maxScroll = () => Math.max(0, el.scrollHeight - el.clientHeight);

    const tick = (now: number) => {
      if (!running || reducedMotion.matches) return;

      const scrollRange = maxScroll();

      if (scrollRange > 2) {
        if (now >= pauseUntil) {
          const delta = Math.min(now - lastTime, 48);
          lastTime = now;

          let next = el.scrollTop + delta * speedPxPerMs * direction;

          if (next >= scrollRange - 0.5) {
            next = scrollRange;
            direction = -1;
            pauseUntil = now + edgePauseMs;
          } else if (next <= 0.5) {
            next = 0;
            direction = 1;
            pauseUntil = now + edgePauseMs;
          }

          el.scrollTop = next;
        }
      } else {
        lastTime = now;
      }

      frame = requestAnimationFrame(tick);
    };

    const kick = () => {
      lastTime = performance.now();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(kick);
    resizeObserver.observe(el);
    const content = el.firstElementChild;
    if (content) resizeObserver.observe(content);

    void document.fonts.ready.then(kick);
    kick();

    const onReducedMotionChange = () => {
      if (reducedMotion.matches) {
        running = false;
        cancelAnimationFrame(frame);
      }
    };
    reducedMotion.addEventListener("change", onReducedMotionChange);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", onReducedMotionChange);
    };
  }, []);

  return (
    <div ref={scrollRef} className="doehealth-initiatives__call-history-scroll">
      {children}
    </div>
  );
}
