"use client";

import { useEffect, useRef, useState } from "react";

import { DoeFall26DeskFrontDeskPanel } from "@/components/doe-fall26-desk/DoeFall26DeskFrontDeskPanel";
import { DoeFall26DeskPaperFrame } from "@/components/doe-fall26-desk/DoeFall26DeskPaperFrame";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";

/** Paper Workflows frame, scaled to the column. The bottom veil lifts as you scroll. */
export function DoeFall26DeskWorkspace() {
  const [shown, setShown] = useState(false);
  const fadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setShown(true));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const fade = fadeRef.current;
    if (!fade) return;
    let raf = 0;
    let lastOpacity = -1;
    const update = () => {
      raf = 0;
      const range = 200;
      const opacity = Math.max(0, 1 - window.scrollY / range);
      const rounded = Math.round(opacity * 100) / 100;
      if (rounded === lastOpacity) return;
      lastOpacity = rounded;
      fade.style.setProperty("--fall26-product-fade", rounded.toFixed(2));
      fade.style.visibility = rounded === 0 ? "hidden" : "";
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className={`fall26-workspace ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}`} aria-label="Doe clinic workflows">
      <div className="fall26-workspace__stage">
        <div className="fall26-paper-slot">
          <div className="fall26-paper-scale">
            <DoeFall26DeskPaperFrame />
          </div>
        </div>
        <DoeFall26DeskFrontDeskPanel />
      </div>
      <div ref={fadeRef} className="fall26-workspace__fade" aria-hidden />
    </section>
  );
}
