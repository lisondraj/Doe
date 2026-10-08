"use client";

import { useEffect, useRef, useState } from "react";

import { DoeCareFall26DeskFrontDeskPanel } from "@/components/doe-carefall26-desk/DoeCareFall26DeskFrontDeskPanel";
import { DoeCareFall26DeskPaperFrame } from "@/components/doe-carefall26-desk/DoeCareFall26DeskPaperFrame";
import { DoeCareFall26DeskPhoneProductPreview } from "@/components/doe-carefall26-desk/DoeCareFall26DeskPhoneProductPreview";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";

/** Paper Workflows frame, scaled to the column. The bottom veil lifts as you scroll. */
export function DoeCareFall26DeskWorkspace() {
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
      const scrollY = document.scrollingElement?.scrollTop ?? window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / range);
      const rounded = Math.round(opacity * 100) / 100;
      if (rounded === lastOpacity) return;
      lastOpacity = rounded;
      fade.style.setProperty("--carefall26-product-fade", rounded.toFixed(2));
      fade.style.opacity = String(rounded);
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
    <section className={`carefall26-workspace ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}`} aria-label="Doe clinic workflows">
      <div className="carefall26-workspace__stage">
        <div className="carefall26-paper-slot">
          <div className="carefall26-paper-scale carefall26-paper-scale--workflows">
            <DoeCareFall26DeskPaperFrame />
          </div>
          <DoeCareFall26DeskPhoneProductPreview />
        </div>
        <DoeCareFall26DeskFrontDeskPanel />
      </div>
      <div ref={fadeRef} className="carefall26-workspace__fade" aria-hidden />
    </section>
  );
}
